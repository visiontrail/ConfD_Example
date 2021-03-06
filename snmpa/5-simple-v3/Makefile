######################################################################
# SNMP Agent example "snmpV3" Makefile
# (C) 2006-2009 Tail-f Systems
#
# See the README files for more information
######################################################################

usage:
	@echo "See README file for more instructions"
	@echo "make all      Build all example files"
	@echo "make clean    Remove all built and intermediary files"
	@echo "make start    Start ConfD daemon and example agent"
	@echo "make stop     Stop any ConfD daemon and example agent"
	@echo "make cli      Start the ConfD Command Line Interface"

######################################################################
# Where is ConfD installed? Make sure CONFD_DIR points it out
CONFD_DIR ?= ../../..

# Include standard ConfD build definitions and rules
include $(CONFD_DIR)/src/confd/build/include.mk

# In case CONFD_DIR is not set (correctly), this rule will trigger
$(CONFD_DIR)/src/confd/build/include.mk:
	@echo 'Where is ConfD installed? Set $$CONFD_DIR to point it out!'
	@echo ''

MIB = TAIL-F-TEST-MIB.mib

# Include common SNMP rules
include ../Makefile.incl

######################################################################
# Example specific definitions and rules

CONFD_FXS_DIR = $(CONFD_DIR)/etc/confd
CONFD_SNMP_FXS_DIR = $(CONFD_DIR)/etc/confd/snmp

CONFD_FLAGS = --addloadpath $(CONFD_FXS_DIR) \
	      --addloadpath $(CONFD_SNMP_FXS_DIR)
######################################################################

all:	simple.fxs TAIL-F-TEST-MIB.bin $(CDB_DIR) $(CDB_DIR)/vacm_init.xml
	@echo "Build complete"

%.fxs: %.yang
	$(CONFDC) $(EXTRA_LINK_FLAGS) -c -o $@ $<

TAIL-F-TEST-MIB.bin: simple.fxs TAIL-F-TEST-MIB.mib
	$(CONFDC) -c -f $(CONFD_FXS_DIR) -- TAIL-F-TEST-MIB.mib simple.fxs

$(CDB_DIR)/vacm_init.xml:
	-mkdir -p $(CDB_DIR)
	cp *_init.xml $(CDB_DIR)

######################################################################
clean:	iclean
	-rm -rf *.bin global.data *.d 2>/dev/null || true
	-rm -rf *log *trace cli-history 2> /dev/null || true

start:  stop
	$(CONFD) -c ./confd.conf $(CONFD_FLAGS)

######################################################################
stop:
	$(CONFD) --stop    || true

######################################################################
cli:
	$(CONFD_DIR)/bin/confd_cli --user=admin --groups=admin \
		--interactive || echo Exit

cli-c:
	$(CONFD_DIR)/bin/confd_cli -C --user=admin --groups=admin \
		--interactive || echo Exit
######################################################################
