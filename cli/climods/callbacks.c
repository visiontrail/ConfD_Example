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

static int generic_complete(struct confd_user_info *uinfo, int cli_style,
                            char *token, int completion_char,
                            confd_hkeypath_t *kp, char *cmdpath,
                            char *cmdparam_id, struct confd_qname *simpleType,
                            char *extra);

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

    /* Register the generic-complete completion callback */
    memset(&acb, 0, sizeof(acb));
    strcpy(acb.actionpoint, "generic-complete");
    acb.init = init_action;
    acb.completion = generic_complete;
    if (confd_register_action_cbs(dctx, &acb) != CONFD_OK)
        fail("Couldn't register generic-complete action callbacks");

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
    if (range_id == NULL)
        fprintf(stderr, "range_id=NULL\n");
    else
        fprintf(stderr, "range_id='%s'\n", range_id);

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


static int generic_complete(struct confd_user_info *uinfo, int cli_style,
                            char *token, int completion_char,
                            confd_hkeypath_t *kp, char *cmdpath,
                            char *cmdparam_id,
                            struct confd_qname *simpleType, char *extra) {
    char keypath[BUFSIZ] = {0};
    struct confd_completion_value values[6];
    int i = 0;

    fprintf(stderr, "callback: generic_complete\n");

    fprintf(stderr, "style=%c token='%s' char=%d\n",
            cli_style, token, completion_char);
    if (kp == NULL) {
        fprintf(stderr, "kp=NULL\n");
    } else {
        confd_pp_kpath(keypath, sizeof(keypath), kp);
        fprintf(stderr, "kp=%s\n", keypath);
    }
    if (cmdpath == NULL)
        fprintf(stderr, "cmdpath=NULL\n");
    else
        fprintf(stderr, "cmdpath='%s' ", cmdpath);
    if (cmdparam_id == NULL)
        fprintf(stderr, "cmdparam_id=NULL\n");
    else
        fprintf(stderr, "cmdparam_id='%s'\n", cmdparam_id);
    if (simpleType == NULL) {
        fprintf(stderr, "simpleType=NULL\n");
    } else {
        fprintf(stderr, "simpleType='");

        if (simpleType->prefix.size != 0)
            fprintf(stderr, "%s:", simpleType->prefix.ptr);
        fprintf(stderr, "%s'\n", simpleType->name.ptr);
    }

    /* Handle completion for built-in command "history" */
    if (strcmp(cmdpath, "history") == 0 ||
        strcmp(cmdpath, "set history") == 0) {
        values[i].type = CONFD_COMPLETION_INFO;
        values[i].value = "The history must be a non-negative value (preferably 500 or 750)";
        i++;

        values[i].type = CONFD_COMPLETION;
        values[i].value = "500";
        values[i].extra = NULL;
        i++;

        values[i].type = CONFD_COMPLETION;
        values[i].value = "750";
        values[i].extra = NULL;
        i++;
    }

    /* Handle completion for all command parameters or config/oper
     * elements of type xs:unsignedLong (uint64), e.g. the built-in
     * command "idle-timeout" or the element config:fsckAfterReboot */
    else if (simpleType &&
             ((strcmp((char *)simpleType->prefix.ptr,
                      "http://www.w3.org/2001/XMLSchema") == 0 &&
               strcmp((char *)simpleType->name.ptr,
                      "unsignedLong") == 0) ||
              (strcmp((char *)simpleType->prefix.ptr,
                      "http://tail-f.com/ns/cli-builtin/1.0") == 0 &&
               strcmp((char *)simpleType->name.ptr,
                      "idle-timeout") == 0))) {
        values[i].type = CONFD_COMPLETION_INFO;
        values[i].value = "Enter a non-negative integer value";
        i++;
        strtoul(token, NULL, 10);

        if (strlen(token) != 0 && errno != EINVAL) {
            values[i].type = CONFD_COMPLETION;
            values[i].value = token;
            values[i].extra = NULL;
            i++;
        }
    }
    /* Handle completion for the "setClock" command (seconds) */
    else if (simpleType &&
             strcmp((char *)simpleType->name.ptr, "secondsType") == 0) {
        values[i].type = CONFD_COMPLETION_INFO;
        values[i].value = "Enter the number of seconds";
        i++;
        strtoul(token, NULL, 10);

        if (strlen(token) != 0 && errno != EINVAL) {
            values[i].type = CONFD_COMPLETION;
            values[i].value = token;
            values[i].extra = NULL;
            i++;
        }
    }
    /* Handle completion for the "setClock" command (useconds) */
    else if (simpleType &&
             strcmp((char *)simpleType->name.ptr,
                    "microSecondsType") == 0) {
        values[i].type = CONFD_COMPLETION_INFO;
        values[i].value = "Enter the number of micro seconds";
        i++;
        strtoul(token, NULL, 10);

        if (strlen(token) != 0 && errno != EINVAL) {
            values[i].type = CONFD_COMPLETION;
            values[i].value = token;
            values[i].extra = NULL;
            i++;
        }
    }
    /* Handle completion for the "setClock" command (mode) */
    else if (cmdparam_id && strcmp(cmdparam_id, "mode") == 0) {
        values[i].type = CONFD_COMPLETION_DESC;
        values[i].value =
            "A reboot is required to activate this change";
        i++;

        values[i].type = CONFD_COMPLETION;
        values[i].value = "utc";
        values[i].extra = "Greenwich";
        i++;

        values[i].type = CONFD_COMPLETION;
        values[i].value = "local";
        values[i].extra = "Local time";
        i++;
    }
    /* Handle completion for the "test" path */
    else if (cmdparam_id && strcmp(cmdparam_id, "path") == 0) {
        values[i].type = CONFD_COMPLETION_DESC;
        values[i].value =
            "A test value (foo or bar)";
        i++;

        values[i].type = CONFD_COMPLETION;
        values[i].value = "foo";
        values[i].extra = "The foo value";
        i++;

        values[i].type = CONFD_COMPLETION;
        values[i].value = "bar";
        values[i].extra = "the bar value";
        i++;
    }

    if (confd_action_reply_completion(uinfo, values, i) < 0)
        confd_fatal("Failed to reply to confd\n");

    return CONFD_OK;
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
