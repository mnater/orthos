#!/bin/bash
# -*- coding: utf-8 -*-

DICT="./wortliste_extr.txt"
TRAN="./german.tr"

rm -f pattern.0
touch pattern.0

for i in 1 2 3 4 5 6 7 8; do
    node patgen.js ${DICT} pattern.$(($i-1)) pattern.$i ${TRAN} $i
    #node patgen.js ${DICT} pattern.$(($i-1)) pattern_tmp.$i ${TRAN} $i
    #iconv -f UTF-8 -t ISO-8859-15 pattern_tmp.$i > pattern.$i
    #rm -f pattern_tmp.$i
done
