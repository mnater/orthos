#!/bin/bash
# -*- coding: utf-8 -*-

#
# Dieses Skript generiert deutsche Trennmuster.
#
# Aufruf:
#
#   sh make-full-pattern.sh words.hyphenated german.tr
#
#
# Eingabe: words.hyphenated   Liste von getrennten Wörtern.
#          german.tr          Translationsdatei für patgen.
#
# Ausgabe: pattmp.[1-8]       patgen-Resultate.
#          pattern.[0-8]      Trennmuster -- pattern.8 ist die finale
#                             Trennmusterdatei.
#          pattern.[1-8].log  Log-Dateien.
#          pattern.rules      Die patgen-Parameter in kompakter Form.
#

DICT="./wortliste_extr.txt"

# Die Parameter für patgen für die Level eins bis acht.

hyph_min_max[1]='2 2'
hyph_min_max[2]='2 2'
hyph_min_max[3]='2 2'
hyph_min_max[4]='2 2'
hyph_min_max[5]='2 2'
hyph_min_max[6]='2 2'
hyph_min_max[7]='2 2'
hyph_min_max[8]='2 2'

hyph_start_finish[1]='1 1'
hyph_start_finish[2]='2 2'
hyph_start_finish[3]='3 3'
hyph_start_finish[4]='4 4'
hyph_start_finish[5]='5 5'
hyph_start_finish[6]='6 6'
hyph_start_finish[7]='7 7'
hyph_start_finish[8]='8 8'

pat_start_finish[1]='2 5'
pat_start_finish[2]='2 5'
pat_start_finish[3]='2 6'
pat_start_finish[4]='2 6'
pat_start_finish[5]='2 7'
pat_start_finish[6]='2 7'
pat_start_finish[7]='2 13'
pat_start_finish[8]='2 13'

good_bad_thres[1]='1 1 1'
good_bad_thres[2]='1 2 1'
good_bad_thres[3]='1 1 1'
good_bad_thres[4]='1 4 1'
good_bad_thres[5]='1 1 1'
good_bad_thres[6]='1 6 1'
good_bad_thres[7]='1 4 1'
good_bad_thres[8]='1 8 1'

#best parameter so far:
# pat_start_finish[1]='2 13'
# pat_start_finish[2]='2 13'
# pat_start_finish[3]='2 13'
# pat_start_finish[4]='2 13'
# pat_start_finish[5]='2 13'
# pat_start_finish[6]='2 13'
# pat_start_finish[7]='2 13'
# pat_start_finish[8]='2 13'

# good_bad_thres[1]='1 2 16'
# good_bad_thres[2]='1 2 16'
# good_bad_thres[3]='1 4 8'
# good_bad_thres[4]='1 4 8'
# good_bad_thres[5]='1 8 4'
# good_bad_thres[6]='1 8 4'
# good_bad_thres[7]='1 16 1'
# good_bad_thres[8]='1 16 1'


# Erzeuge leere Startmuster, lösche Datei mit patgen-Parametern.
rm -f pattern.0 pattern.rules
touch pattern.0

for i in 1 2 3 4 5 6 7 8; do

  #Erzeuge Muster des aktuellen Levels.  Steuereingaben werden patgen
  #mittels einer Pipe übergeben.

  printf "%s\n%s\n%s\n%s\n%s\n" "${hyph_min_max[$i]}" \
                                "${hyph_start_finish[$i]}" \
                                "${pat_start_finish[$i]}" \
                                "${good_bad_thres[$i]}" \
                                "y" \
  | node patgen.js ${DICT} pattern.$(($i-1)) pattern.$i


  # Sammle verwendete patgen-Parameter in Datei.
  printf "%%   %s | %s | %s\n" "${hyph_start_finish[$i]}" \
                               "${pat_start_finish[$i]}" \
                               "${good_bad_thres[$i]}" \
  >> pattern.rules

done

# eof
