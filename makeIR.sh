#!/bin/bash
# -*- coding: utf-8 -*-

DICT="./wortliste_short.txt"
i=1

rm -f pattern.0
touch pattern.0

  printf "%s\n%s\n%s\n%s\n%s\n"  "2 2" \
                                 "1 1" \
                                 "2 5" \
                                 "1 1 1" \
                                 "y" \
 | node --trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces --redirect-code-traces-to=code.asm patgen.js ${DICT} pattern.0 pattern.1