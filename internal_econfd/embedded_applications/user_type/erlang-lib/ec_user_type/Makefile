SUBDIRS = src

all clean:
	@set -e ; \
	  for d in $(SUBDIRS) ; do \
	    if [ -f $$d/Makefile ]; then \
	      ( cd $$d && $(MAKE) $@ ) || exit 1 ; \
	    fi ; \
	  done
