/**
 * orthos.js - Pattern Generator for hyphenation patterns in node.js
 *
 * USAGE
 * (install node version 5.1.0 or newer)
 * node orthos.js <wortliste> <pattern-in> <pattern-out>
 *
 * HISTORY
 * patgen (PATtern GENeration program for the TEX82 hyphenator) was originally
 * written by Frank Liang in PASCAL in 1983 and had revisions in 1991, 1992
 * and 1996 by Peter Breitenloher and in 1996 by Karl Berry. It was originally
 * ported to UNIX by Howard Trickey.
 * patgen is a piece of very well documented and mature software and it is
 * still used to produce new patterns for Frank Liangs hyphenation algorithm.
 *
 * Further reading about patgen and Liangs hyphenation algorithm:
 * - patgen.web: the original patgen
 *   https://www.ctan.org/pkg/patgen
 *   (use weave and tangle to translate the literal programming WEB
 *   to TEX and PASCAL respectively)
 * - Frank  Liang,  Word hy-phen-a-tion by com-puter, STAN-CS-83-977,
 *   Stanford University Ph.D. thesis, 1983
 *   http://tug.org/docs/liang
 *
 * A program called opatgen (with Unicode support and other improvements, by
 * David Antos and Petr Sojka) is also mentioned on http://tug.org/docs/liang
 * put the link is broken and I can't find this software anymore.
 *
 * So why a port of patgen to node.js? (and why JavaScript and not just C?)
 *
 * When patgen was originally written computers were very limited: the PDP-10
 * mainframe computer used by Liang had 256 Kilowords – about 1MB – of memory
 * and could average about 450 kilo instructions per second.
 * Saving memory was critical, characters were encoded in ASCII, students where
 * teached in structured programming using PASCAL.
 *
 * A lot has changed eversince – and many things haven't. Porting patgen to
 * JavaScript/ES6/node.js is aimed at:
 * - learning how patgen works
 * - providing software that runs acceptably fast on current computers
 * - providing a program that can be easily used to produce patterns
 *
 * But why JavaScript?
 * - JavaScript runs on every computer that has at least a browser installed
 * - JavaScript has native Unicode support
 * - It's the language I know best
 *
 * Why the name orthos.js?
 * There's no licence available for patgen. If there would it would most probably
 * be LPPL (https://www.latex-project.org/lppl/). So just to make sure I had to
 * give this another name than "patgen".
 * Then, there is "hydra" (https://github.com/hyphenation/hydra) a Ruby port of
 * patgen. Orthos was the brother of Hydra.
 * And may be some day there will be a hero that kills both…
 *
 * CODING STANDARDS
 * The first version of orthos.js was a more or less 1:1 port from PASCAL to JavaScript.
 * The source is now in a refactoring process where it is step-by-step made
 * more JavaScript-alike.
 * Identifiers copied from the original typically have under_scores in their
 * names, while refactored code uses camelCase.
 * The source is continuously linted by JSLint.
 * The API may change and is not intended to be the same as of the original.
 * Resulting patterns have to be identical to the patterns computed by patgen
 * given the same input (except for their ordering and encoding).
 *
 * ERRORS
 * Please report errors on [githublink]
 *
 * LICENCE
 * Copyright (c) <year> <copyright holders>
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */