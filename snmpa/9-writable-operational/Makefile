######################################################################
# SNMP Agent example "operational" Makefile
# (C) 2006-2011 Tail-f Systems
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

# Include common SNMP rules
include ../Makefile.incl

######################################################################
# Example specific definitions and rules

CONFD_FXS_DIR = $(CONFD_DIR)/etc/confd
CONFD_SNMP_FXS_DIR = $(CONFD_DIR)/etc/confd/snmp

CONFD_FLAGS = --addloadpath $(CONFD_FXS_DIR) \
	      --addloadpath $(CONFD_SNMP_FXS_DIR)

SRC = simple_operational.c
OBJS = $(SRC:.c=.o)
PRG = simple_operational

######################################################################

all:	SIMPLE-MIB.fxs SIMPLE-MIB.bin $(PRG) $(CDB_DIR) $(CDB_DIR)/vacm_init.xml
	@echo "Build complete"

%.yang:	%.mib
	$(CONFDC) --mib2yang -o $@ $<

%.fxs:	%.yang
	a=$*-ann.yang; \
	$(CONFDC) -c -o $@ `[ -e $$a ] && echo "-a $$a"` -- $<

SIMPLE-MIB.yang: SIMPLE-MIB.mib SIMPLE-MIB.miba
	$(CONFDC) --mib2yang -o $@ --snmp-name \
	--mib-annotation SIMPLE-MIB.miba $<

SIMPLE-MIB.bin: SIMPLE-MIB.fxs SIMPLE-MIB.mib SIMPLE-MIB.miba
	$(CONFDC) -c SIMPLE-MIB.mib --mib-annotation SIMPLE-MIB.miba \
	SIMPLE-MIB.fxs -f . -f $(CONFD_FXS_DIR) -f $(CONFD_SNMP_FXS_DIR)

$(CDB_DIR)/vacm_init.xml:
	-mkdir -p $(CDB_DIR)
	cp *_init.xml $(CDB_DIR)

simple_operational.o: SIMPLE-MIB.h

$(PRG): $(OBJS)
	$(CC) -o $@ $(OBJS) $(LIBS)

######################################################################
clean:	iclean
	-rm -rf SIMPLE-MIB.yang SNMPv2-TC.yang \
		*.bin global.data *.d \
		$(PRG) SIMPLE-MIB.h 2>/dev/null
	-rm -rf *log cli-history 2> /dev/null || true

######################################################################
start:  stop
	- # Start the confd daemon with our example specific configuration
	$(CONFD) -c ./confd.conf $(CONFD_FLAGS)
	./$(PRG)

stop:
	- # Kill the confd daemon
	$(CONFD) --stop    || true

######################################################################
cli:
	$(CONFD_DIR)/bin/confd_cli --user=admin --groups=admin \
		--interactive || echo Exit

cli-c:
	$(CONFD_DIR)/bin/confd_cli -C --user=admin --groups=admin \
		--interactive || echo Exit
######################################################################
