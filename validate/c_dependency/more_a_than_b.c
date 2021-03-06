/*////////////////////////////////////////////////////////////////////
// ConfD simple validation example
//
// (C) 2006 Tail-f Systems
// Permission to use this code as a starting point hereby granted
//
// TODO and limitations:
//
*/

#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/poll.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <stdarg.h>
#include <stdio.h>

#include "confd_lib.h"
#include "confd_dp.h"
#include "confd_maapi.h"

/* include generated ns file */
#include "mtest.h"

int debuglevel = CONFD_DEBUG;

static int ctlsock;
static int workersock;
static int maapi_socket;
static struct confd_daemon_ctx *dctx;

struct confd_trans_validate_cbs vcb;
struct confd_valpoint_cb valp1;

static void OK(int rval)
{
    if (rval != CONFD_OK) {
        fprintf(stderr, "more_a_than_b.c: error not CONFD_OK: %d : %s \n",
                confd_errno, confd_lasterr());
        abort();
    }
}

static int init_validation(struct confd_trans_ctx *tctx)
{
    OK(maapi_attach(maapi_socket, mtest__ns, tctx));
    confd_trans_set_fd(tctx, workersock);
    return CONFD_OK;
}

static int stop_validation(struct confd_trans_ctx *tctx)
{
    OK(maapi_detach(maapi_socket, tctx));
    return CONFD_OK;
}

/* Called when a_number or b_number is modified.  Always called with
   a_number's value */
static int validate_a(struct confd_trans_ctx *tctx,
                      confd_hkeypath_t *keypath,
                      confd_value_t *newval)
{
    int64_t b_val;
    int64_t a_val;
    int64_t newval_a;

    /* we validate that a_number > b_number  */
    newval_a = CONFD_GET_INT64(newval);

    /* this switch is not necessary in this case; we know that we're
       called for a_number only.  the switch is useful when the same
       code is used to validate multiple objects. */
    switch (CONFD_GET_XMLTAG(&(keypath->v[0][0]))) {
    case mtest_a_number:
        OK(maapi_get_int64_elem(maapi_socket, tctx->thandle, &b_val,
                                "/mtest/b_number"));
        OK(maapi_get_int64_elem(maapi_socket, tctx->thandle, &a_val,
                                "/mtest/a_number"));

        /* just an assertion to show that newval == /mtest/a_number */
        /* in this transaction */
        assert(CONFD_GET_INT64(newval) == a_val);

        if (newval_a <= b_val) {
            confd_trans_seterr(tctx, "a_number is <= b_number ");
            return CONFD_ERR;
        }
        if (newval_a == 88) {
            /* This is how we get to interact with the CLI/webui */
            confd_trans_seterr(tctx, "Dangerous value: 88");
            return CONFD_VALIDATION_WARN;
        }
        else {
            return CONFD_OK;
        }
        break;

    default: {
        char ebuf[BUFSIZ];
        sprintf(ebuf, "Unknown tag %d",
                CONFD_GET_XMLTAG(&(keypath->v[0][0])));
        confd_trans_seterr(tctx, ebuf);
        return CONFD_ERR;
    } /* default case */
    } /* switch */
}

/* Called for every db change */
static int validate_c(struct confd_trans_ctx *tctx,
                    confd_hkeypath_t *keypath,
                    confd_value_t *newval)
{
    int64_t newval_c;

    /* we warn id c_number is < 0 */
    newval_c = CONFD_GET_INT64(newval);

    assert(CONFD_GET_XMLTAG(&(keypath->v[0][0])) == mtest_c_number);

    if (newval_c < 0) {
        /* This is how we get to interact with the CLI/webui */
        confd_trans_seterr(tctx, "Dangerous with negative values.");
        return CONFD_VALIDATION_WARN;
    }
    return CONFD_OK;
}



enum maapi_iter_ret iter(confd_hkeypath_t *kp,
                         enum maapi_iter_op op,
                         confd_value_t *oldv,
                         confd_value_t *newv,
                         void *state)
{
    char buf[BUFSIZ];
    char *opstr = "";
    if (op == MOP_CREATED)
        opstr = "create";
    else if (op == MOP_DELETED)
        opstr = "delete";
    else if (op == MOP_MODIFIED)
        opstr = "modif";
    else if (op == MOP_VALUE_SET)
        opstr = "set  ";

    confd_pp_kpath(buf, BUFSIZ, kp);
    fprintf(stderr, "Op= %s Path= %s\n", opstr, buf);
    return ITER_RECURSE;
}

/* If any changes have occured below /mtest/container */
/* we traverse the entire diff below that point and just */
/* print the diff, if we want to actually validate something - yes I know */
/* we can use the state parameter to pass data from the iter() cb */
/* back to ourselvese */

static int traverse_container(struct confd_trans_ctx *tctx,
                              confd_hkeypath_t *keypath,
                              confd_value_t *newval)
{
    char buf[BUFSIZ];
    confd_pp_kpath(buf, BUFSIZ, keypath);
    fprintf(stderr, "Calling diff iter with path %s\n", buf);
    maapi_keypath_diff_iterate(maapi_socket, tctx->thandle, iter, 0, NULL, "%h",
                               keypath);
    return CONFD_OK;
}


static int traverse_vrf(struct confd_trans_ctx *tctx,
                        confd_hkeypath_t *keypath,
                        confd_value_t *newval)
{
    char buf[BUFSIZ];
    confd_pp_kpath(buf, BUFSIZ, keypath);
    fprintf(stderr, "traverse_vrf path %s\n", buf);
    maapi_diff_iterate(maapi_socket, tctx->thandle, iter, 0, NULL);
    return CONFD_OK;
}


static int maapi_sock(int *maapi_sock)
{

    struct sockaddr_in addr;

    addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    addr.sin_family = AF_INET;
    addr.sin_port = htons(4565);

    if ((*maapi_sock = socket(PF_INET, SOCK_STREAM, 0)) < 0 )
        confd_fatal("Failed to open socket\n");

    if (maapi_connect(*maapi_sock, (struct sockaddr*)&addr,
                      sizeof (struct sockaddr_in)) < 0)
        confd_fatal("Failed to confd_connect() to confd \n");

    return CONFD_OK;
}

int main(int argc, char **argv)
{
    int c;

    struct sockaddr_in addr;

    while ((c = getopt(argc, argv, "tdps")) != -1) {
        switch(c) {
        case 't':
            debuglevel = CONFD_TRACE;
            break;
        case 'd':
            debuglevel = CONFD_DEBUG;
            break;
        case 'p':
            debuglevel = CONFD_PROTO_TRACE;
            break;
        case 's':
            debuglevel = CONFD_SILENT;
            break;
        }
    }


    confd_init("MYNAME", stderr, debuglevel);

    if ((dctx = confd_init_daemon("mydaemon")) == NULL)
        confd_fatal("Failed to initialize confd\n");

    if ((ctlsock = socket(PF_INET, SOCK_STREAM, 0)) < 0 )
        confd_fatal("Failed to open ctlsocket\n");

    addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    addr.sin_family = AF_INET;
    addr.sin_port = htons(CONFD_PORT);

    OK(confd_load_schemas((struct sockaddr*)&addr,sizeof (struct sockaddr_in)));

    /* Create the first control socket, all requests to */
    /* create new transactions arrive here */
    if (confd_connect(dctx, ctlsock, CONTROL_SOCKET,
                      (struct sockaddr*)&addr,
                      sizeof (struct sockaddr_in)) < 0) {
        confd_fatal("Failed to confd_connect() to confd \n");
    }

    /* Also establish a workersocket, this is the most simple */
    /* case where we have just one ctlsock and one workersock */

    if ((workersock = socket(PF_INET, SOCK_STREAM, 0)) < 0 )
        confd_fatal("Failed to open workersocket\n");
    if (confd_connect(dctx, workersock, WORKER_SOCKET,(struct sockaddr*)&addr,
                      sizeof (struct sockaddr_in)) < 0)
        confd_fatal("Failed to confd_connect() to confd \n");

    vcb.init = init_validation;
    vcb.stop = stop_validation;
    confd_register_trans_validate_cb(dctx, &vcb);

    valp1.validate = validate_a;
    strcpy(valp1.valpoint, "vp1");

    OK(confd_register_valpoint_cb(dctx, &valp1));

    valp1.validate = validate_c;
    strcpy(valp1.valpoint, "vp2");

    OK(confd_register_valpoint_cb(dctx, &valp1));


    valp1.validate = traverse_container;
    strcpy(valp1.valpoint, "vp3");
    OK(confd_register_valpoint_cb(dctx, &valp1));

    valp1.validate = traverse_vrf;
    strcpy(valp1.valpoint, "vp4");
    OK(confd_register_valpoint_cb(dctx, &valp1));




    OK(confd_register_done(dctx));

    OK(maapi_sock(&maapi_socket));

    while (1) {
        struct pollfd set[2];
        int ret;

        set[0].fd = ctlsock;
        set[0].events = POLLIN;
        set[0].revents = 0;

        set[1].fd = workersock;
        set[1].events = POLLIN;
        set[1].revents = 0;

        if (poll(&set[0], 2, -1) < 0) {
            perror("Poll failed:");
            continue;
        }

        if (set[0].revents & POLLIN) {
            if ((ret = confd_fd_ready(dctx, ctlsock)) == CONFD_EOF) {
                confd_fatal("Control socket closed\n");
            } else if (ret == CONFD_ERR && confd_errno != CONFD_ERR_EXTERNAL) {
                confd_fatal("Error on control socket request: %s (%d): %s\n",
                     confd_strerror(confd_errno), confd_errno, confd_lasterr());
            }
        }
        if (set[1].revents & POLLIN) {
            if ((ret = confd_fd_ready(dctx, workersock)) == CONFD_EOF) {
                confd_fatal("Worker socket closed\n");
            } else if (ret == CONFD_ERR && confd_errno != CONFD_ERR_EXTERNAL) {
                confd_fatal("Error on worker socket request: %s (%d): %s\n",
                     confd_strerror(confd_errno), confd_errno, confd_lasterr());
            }
        }
    }
}
