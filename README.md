# PATGEN for Node.js
Das originale patgen Programm aus der TeX-Welt ist in Pascal geschrieben und unterstützt kein utf8.
Um zu lernen wie patgen arbeitet, habe ich den originalen Quellcode nach JavaScript transkribiert und verschiedene Anpassungen gemacht.
In dieser frühen Phase der Entwicklung sind noch nicht alle Features vorhanden, aber patgen.js liefert den gleichen Output wie das originale Programm, unterstützt utf8 und läuft jetzt schon schneller.

## Benutzung
```
node patgen.js <wortliste> <pattern-in> <pattern-out> <translate> <runde>
```

## Wie geht es weiter?
* Der Quellcode von patgen.js lehnt sich noch sehr stark am Original an und ist wenig JavaScript-typisch. Hier ist ein grosses Refactoring gefragt.
* patgen.js unterstützt noch nicht alle Features des Originals (v.a. in der Benutzerinteraktion).
* Es gibt noch viele Performance-Probleme:
** Array’s starten an Position 1 statt 0 und weisen somit Lücken auf.
** Auch der Einsatz von TypedArrays ist zu prüfen.
** Evtl. lassen sich bestimmte