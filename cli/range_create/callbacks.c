/*********************************************************************
 * ConfD Actions intro example
 * Implements a couple of actions
 *
 * (C) 2008 Tail-f Systems
 * Permission to use this code as a starting point hereby granted
 *
 * See the README file for more information
 ********************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <dirent.h>
#include <fcntl.h>
#include <errno.h>
#include <syslog.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <sys/param.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <sys/poll.h>
#include <ctype.h>

#include <confd.h>
#include <confd_maapi.h>
#include <confd_cdb.h>
#include <confd_logsyms.h>

static int ctlsock, workersock;
static struct confd_daemon_ctx *dctx;

static int init_action(struct confd_user_info *uinfo);

static int ifs_range(struct confd_user_info *uinfo, int cli_style,
                     char *token, int completion_char, confd_hkeypath_t *kp,
                     char *cmdpath, char *cmdparam_id,
                     struct confd_qname *simpleType, char *extra);
static int ifs_enum(struct confd_user_info *uinfo, int cli_style,
                     char *token, int completion_char, confd_hkeypath_t *kp,
                     char *cmdpath, char *cmdparam_id,
                     struct confd_qname *simpleType, char *extra);
static void main_loop(int do_phase0);

extern void fail(char *fmt, ...);

/********************************************************************/

int main(int argc, char **argv)
{
    struct sockaddr_in addr;
    int debuglevel = CONFD_TRACE;
    struct confd_action_cbs acb;

    /* Init library */
    confd_init("cli_range_daemon",stderr, debuglevel);

    addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    addr.sin_family = AF_INET;
    addr.sin_port = htons(CONFD_PORT);

    if ((dctx = confd_init_daemon("cli_range_daemon")) == NULL)
        fail("Failed to initialize ConfD\n");

    if ((ctlsock = socket(PF_INET, SOCK_STREAM, 0)) < 0 )
        confd_fatal("Failed to open ctlsocket\n");

    /* Create the first control socket, all requests to */
    /* create new transactions arrive here */
    if (confd_connect(dctx, ctlsock, CONTROL_SOCKET, (struct sockaddr*)&addr,
                      sizeof (struct sockaddr_in)) < 0)
        confd_fatal("Failed to confd_connect() to confd \n");


    /* Also establish a workersocket, this is the most simple */
    /* case where we have just one ctlsock and one workersock */
    if ((workersock = socket(PF_INET, SOCK_STREAM, 0)) < 0 )
        confd_fatal("Failed to open workersocket\n");
    if (confd_connect(dctx, workersock, WORKER_SOCKET,(struct sockaddr*)&addr,
                      sizeof (struct sockaddr_in)) < 0)
        confd_fatal("Failed to confd_connect() to confd \n");

    /* Register the ifs-range callback */
    memset(&acb, 0, sizeof(acb));
    strcpy(acb.actionpoint, "ifs-range");
    acb.init = init_action;
    acb.completion = ifs_range;
    if (confd_register_action_cbs(dctx, &acb) != CONFD_OK)
        fail("Couldn't register unhide action callbacks");

    /* Register the ifs-range callback */
    memset(&acb, 0, sizeof(acb));
    strcpy(acb.actionpoint, "ifs-enum");
    acb.init = init_action;
    acb.completion = ifs_enum;
    if (confd_register_action_cbs(dctx, &acb) != CONFD_OK)
        fail("Couldn't register unhide action callbacks");


    if (confd_register_done(dctx) != CONFD_OK)
        fail("Couldn't complete callback registration");

    main_loop(0);

    close(ctlsock);
    close(workersock);
    confd_release_daemon(dctx);
    return 0;
}

/* Main loop - receive and act on events from ConfD */
static void main_loop(int do_phase0) {
    struct pollfd set[3];
    int ret;

    while (1) {
        set[0].fd = ctlsock;
        set[0].events = POLLIN;
        set[0].revents = 0;

        set[1].fd = workersock;
        set[1].events = POLLIN;
        set[1].revents = 0;

        if (poll(set, 2, -1) < 0) {
            fail("Poll failed");
        }

        /* Check for I/O */
        if (set[0].revents & POLLIN) { /* ctlsock */
            if ((ret = confd_fd_ready(dctx, ctlsock)) == CONFD_EOF) {
                fail("Control socket closed");
            } else if (ret == CONFD_ERR && confd_errno != CONFD_ERR_EXTERNAL) {
                fail("Error on control socket request: %s (%d): %s",
                     confd_strerror(confd_errno), confd_errno, confd_lasterr());
            }
        }

        if (set[1].revents & POLLIN) { /* workersock */
            if ((ret = confd_fd_ready(dctx, workersock)) == CONFD_EOF) {
                fail("Worker socket closed");
            } else if (ret == CONFD_ERR && confd_errno != CONFD_ERR_EXTERNAL) {
                fail("Error on worker socket request: %s (%d): %s",
                     confd_strerror(confd_errno), confd_errno, confd_lasterr());
            }
        }

    }
}

/********************************************************************/

static int init_action(struct confd_user_info *uinfo) {
    int ret = CONFD_OK;

    printf("init_action called\n");
    confd_action_set_fd(uinfo, workersock);
    return ret;
}

#define FAST 1
#define GIGA 2

static int ifs_range(struct confd_user_info *uinfo, int cli_style,
                     char *keystr, int completion_char, confd_hkeypath_t *kp,
                     char *range, char *range_id,
                     struct confd_qname *simpleType, char *extra) {
    char keypath[BUFSIZ] = {0};
    struct confd_completion_value values[10];
    int i = 0;

    int from_type, to_type;
    int from_nr, to_nr;
    int keystr_type, keystr_nr;
    char *ptr=range;
    int res = CONFD_ERR;

    /* the following parameters should be ignored:

         completion_char
         simpleType

       cmdparam_id is mapped to range_id

       The function should return ok if the key is in the
       range, error otherwise

    */

    fprintf(stderr, "callback: ifs_range\n");

    fprintf(stderr, "style=%c keystr='%s' range='%s'\n",
            cli_style, keystr, range);
    if (kp == NULL) {
        fprintf(stderr, "kp=NULL\n");
    } else {
        confd_pp_kpath(keypath, sizeof(keypath), kp);
        fprintf(stderr, "kp=%s\n", keypath);
    }

    fprintf(stderr, "callback: ifs_range\n");

    /* The expression will be on the form

       (Fast|Giga)Ethernet/[0-9]+-(Fast|Giga)Ethernet/[0-9]+


       Parse expression first:

       Type is one of

         Fast = 1
         Giga = 2

       Number is one of

         0-1000

    */

    if (strncmp(ptr, "Fast", 4) == 0)
        from_type = FAST;
    else
        from_type = GIGA;

    /* skip (Fast|Giga)Ethernet/ (13 chars) */
    ptr += 13;

    from_nr = atoi(ptr);

    /* skip digit and - */
    for( ; isdigit(*ptr) ; ptr++);
    ptr++;

    if (strncmp(ptr, "Fast", 4) == 0)
        to_type = FAST;
    else
        to_type = GIGA;

    /* skip (Fast|Giga)Ethernet/ (13 chars) */
    ptr += 13;

    to_nr = atoi(ptr);

    fprintf(stderr, "from %d/%d to %d/%d\n",
            from_type, from_nr,
            to_type, to_nr);

    ptr = keystr;

    if (strncmp(ptr, "Fast", 4) == 0)
        keystr_type = FAST;
    else
        keystr_type = GIGA;

    ptr += 13;

    keystr_nr = atoi(ptr);

    fprintf(stderr, "keystr %d/%d\n", keystr_type, keystr_nr);

    /* check from condition */
    if ((keystr_type > from_type) ||
        (keystr_type == from_type && keystr_nr >= from_nr)) {
        /* from ok, check to */
        if ((keystr_type < to_type) ||
            (keystr_type == to_type && keystr_nr <= to_nr)) {
            /* in range, include */
            fprintf(stderr, "in range\n");
            res = CONFD_OK;
        }
    }

    fprintf(stderr, "callback: ifs_range %d\n", i);

    if (res == CONFD_OK) {
        if (confd_action_reply_completion(uinfo, values, 0) < 0)
            confd_fatal("Failed to reply to confd\n");
    }

    return res;
}

static int ifs_enum(struct confd_user_info *uinfo, int cli_style,
                     char *keystr, int completion_char, confd_hkeypath_t *kp,
                     char *range, char *range_id,
                     struct confd_qname *simpleType, char *extra) {
    char keypath[BUFSIZ] = {0};

    int res = CONFD_OK;
    int keysize=1, nkeys=20;
    static char *values[] = {
        "FastEthernet/0",
        "FastEthernet/1",
        "FastEthernet/2",
        "FastEthernet/3",
        "FastEthernet/4",
        "FastEthernet/5",
        "FastEthernet/6",
        "FastEthernet/7",
        "FastEthernet/8",
        "FastEthernet/9",
        "GigaEthernet/0",
        "GigaEthernet/1",
        "GigaEthernet/2",
        "GigaEthernet/3",
        "GigaEthernet/4",
        "GigaEthernet/5",
        "GigaEthernet/6",
        "GigaEthernet/7",
        "GigaEthernet/8",
        "GigaEthernet/9"
    };

    /* the following parameters should be ignored:

         keystr
         completion_char
         simpleType

       cmdparam_id is mapped to range_id

       The function may optionally filter the instances to return
       using the range expression provided in the range parameter.

    */

    fprintf(stderr, "callback: ifs_enum\n");

    fprintf(stderr, "style=%c range='%s'\n",
            cli_style, range);
    if (kp == NULL) {
        fprintf(stderr, "kp=NULL\n");
    } else {
        confd_pp_kpath(keypath, sizeof(keypath), kp);
        fprintf(stderr, "kp=%s\n", keypath);
    }

    fprintf(stderr, "callback: ifs_enum\n");

    if (confd_action_reply_range_enum(uinfo, values,
                                      keysize, nkeys) < 0)
        confd_fatal("Failed to reply to confd\n");

    return res;
}

void fail(char *fmt, ...) {
    va_list ap;
    char buf[BUFSIZ];

    va_start(ap, fmt);
    snprintf(buf, sizeof(buf), "%s, exiting", fmt);
    vsyslog(LOG_ERR, buf, ap);
    va_end(ap);
    exit(1);
}
