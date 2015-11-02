#!/bin/bash
# -*- coding: utf-8 -*-

DICT="./wortliste_extr.txt"
TRAN="./german.tr"
i=1

rm -f pattern.0
touch pattern.0

#node --trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces --redirect-code-traces-to=code.asm patgen.js ${DICT} pattern.$(($i-1)) pattern_tmp.$i ${TRAN}

#node --trace-opt patgen.js ${DICT} pattern.$(($i-1)) pattern_tmp.$i ${TRAN} $i

 printf "%s\n%s\n%s\n%s\n" "1 1" \
                          "2 5" \
                          "1 1 1" \
                          "y" \
  | node --trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces --redirect-code-traces-to=code.asm patgen.js ${DICT} pattern.0 pattern.1 ${TRAN}