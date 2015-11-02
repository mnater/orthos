#!/bin/bash
# -*- coding: utf-8 -*-

DICT="./wortliste_extr.txt"
TRAN="./german.tr"
i=1

rm -f pattern.0
touch pattern.0


 printf "%s\n%s\n%s\n%s\n" "1 1" \
                          "2 5" \
                          "1 1 1" \
                          "y" \
  | time node patgen.js ${DICT} pattern.0 pattern.1 ${TRAN}