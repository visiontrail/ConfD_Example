######################################################################
# RFC 8071 NETCONF Call Home Example with OpenSSH
# (C) 2018 Cisco
#
# See the README file for more information
######################################################################

usage:
	@echo "See README file for more instructions"
	@echo "make all     Build all example files"
	@echo "make clean   Remove all built and intermediary files"
	@echo "make start   Start CONFD daemon and example agent"
	@echo "make stop    Stop any CONFD daemon and example agent"
	@echo "make cli     Start the CONFD Command Line Interface"

######################################################################
# Where is ConfD installed? Make sure CONFD_DIR points it out
CONFD_DIR ?= ../../..

# Include standard ConfD build definitions and rules
include $(CONFD_DIR)/src/confd/build/include.mk

# In case CONFD_DIR is not set (correctly), this rule will trigger
$(CONFD_DIR)/src/confd/build/include.mk:
	@echo 'Where is ConfD installed? Set $$CONFD_DIR to point it out!'
	@echo ''


######################################################################
# Example specific definitions and rules

CONFD_FLAGS ?= --addloadpath $(CONFD_DIR)/etc/confd
START_FLAGS ?=
PROG    = netconf-call-home
SRC	= netconf-call-home.c
OBJS	= $(SRC:.c=.o)

all:  $(PROG) $(CDB_DIR) ssh-keydir netconf-subsys ncch_sshd_config
	@echo "Build complete"

$(PROG): $(OBJS)
	$(CC) -o $@ $(OBJS) $(LIBS)

netconf-subsys:	$(CONFD_DIR)/src/confd/netconf/netconf-subsys.c
	$(CC) -o $@ $<

ncch_sshd_config: ncch_sshd_config.in
	pwd=`pwd` && \
	sed -e "s|%PWD%|$${pwd}|g" $< > $@

######################################################################
clean:	iclean
	-rm -rf $(PROG) netconf-subsys ncch_sshd_config 2> /dev/null || true
	-rm -rf cli-history 2> /dev/null || true

######################################################################

start:  stop
	### Start the confd daemon with our example specific confd-config
	$(CONFD) -c confd.conf $(CONFD_FLAGS)
	@echo "ConfD started"

######################################################################
stop:
	### Killing any confd daemon
	$(CONFD) --stop    || true

######################################################################
cli: cli-c

######################################################################
cli-c:
	$(CONFD_DIR)/bin/confd_cli -C --user=admin --groups=admin \
		--interactive || echo Exit
