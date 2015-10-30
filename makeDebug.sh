#!/bin/bash
# -*- coding: utf-8 -*-

DICT="./wortliste_extr.txt"
TRAN="./german.tr"
i=1

rm -f pattern.0
touch pattern.0

node-debug patgen.js ${DICT} pattern.$(($i-1)) pattern_tmp.$i ${TRAN} $i
