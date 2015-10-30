/*jslint browser: false, node: true, es6: true, for: true, fudge: true*/
"use strict";

//const r = require("./filereader2.js");
const w = require("./filewriter.js");

const makeFileProxy = require("./makeFileProxy.js");

const
    dictionary = makeFileProxy(process.argv[2]),
    patterns = makeFileProxy(process.argv[3]),
    patout = process.argv[4],
    translate = makeFileProxy(process.argv[5]),
    run_count = parseInt(process.argv[6], 10);

//block 1
const banner = "This is patgen.js for node.js, Version 1.0b";

//block 3
function print(s) {
    process.stdout.write(s);
}

//block 10
function jump_out() {
    //terminate
    process.exit();
}
function error(msg1, msg2) {
    console.log(msg1 + msg2);
    jump_out();

}
function overflow(msg1) {
    error("PATGEN capacity exceeded, sorry [" + msg1 + "].", "");
}

//Constants of the outer block 27
const
    trie_size = 55000 * 8,
    triec_size = 26000 * 8,
    max_ops = 4080,
    max_val = 10,
    max_dot = 15,
    max_len = 50;
var max_buf_len = 80;

//block 12
const
    first_text_char = 0,
    last_text_char = 255,
    last_ASCII_code = 255;

//block 13
const min_packed = 0;
function si(c) {
    return c;
}


//block 3
var pat_start,
    pat_finish,
    hyph_start,
    hyph_finish,
    good_wt,
    bad_wt,
    thresh;

//block 16
var xord = {},
    xchr = [];

//block 18
const invalid_code = 0;
const tab_char = 11;

//block 20
const edge_of_word = 1;

//block 22
const
    space_class = 0,
    digit_class = 1,
    hyf_class = 2,
    varter_class = 3,
    escape_class = 4,
    invalid_class = 5,
    no_hyf = 0,
    err_hyf = 1,
    is_hyf = 2,
    found_hyf = 3;


//block 23
var xclass = {},
    xint = {},
    xdig = [],
    xext = [],
    xhyf = [];

//block 25
const cmin = edge_of_word;
var cmax;

//block 3
function initialize() {
    //begin block 15
    var bad,
        i,
        j;
    //end block 15
    console.log(banner);
    //begin block 14
    bad = 0;
    if (last_ASCII_code < 127) {
        bad = 1;
    }
    if (si(0) !== min_packed || min_packed !== 0) {
        bad = 2;
    }
    //begin block 28
    if (triec_size < 4096 || trie_size < triec_size) {
        bad = 3;
    }
    if (max_ops > trie_size) {
        bad = 4;
    }
    if (max_val > 10) {
        bad = 5;
    }
    if (max_buf_len < max_len) {
        bad = 6;
    }
    //end block 28
    if (bad > 0) {
        error("Bad constants---case ", bad);
    }
    //begin block 17
    for (j = 0; j <= last_ASCII_code; j += 1) {
        xchr[j] = " ";
    }
    xchr[46] = ".";
    xchr[30] = "0";
    xchr[31] = "1";
    xchr[32] = "2";
    xchr[33] = "3";
    xchr[34] = "4";
    xchr[35] = "5";
    xchr[36] = "6";
    xchr[37] = "7";
    xchr[38] = "8";
    xchr[39] = "9";
    xchr[65] = "A";
    xchr[66] = "B";
    xchr[67] = "C";
    xchr[68] = "D";
    xchr[69] = "E";
    xchr[70] = "F";
    xchr[71] = "G";
    xchr[72] = "H";
    xchr[73] = "I";
    xchr[74] = "J";
    xchr[75] = "K";
    xchr[76] = "L";
    xchr[77] = "M";
    xchr[78] = "N";
    xchr[79] = "O";
    xchr[80] = "P";
    xchr[81] = "Q";
    xchr[82] = "R";
    xchr[83] = "S";
    xchr[84] = "T";
    xchr[85] = "U";
    xchr[86] = "V";
    xchr[87] = "W";
    xchr[88] = "X";
    xchr[89] = "Y";
    xchr[90] = "Z";
    xchr[97] = "a";
    xchr[98] = "b";
    xchr[99] = "c";
    xchr[100] = "d";
    xchr[101] = "e";
    xchr[102] = "f";
    xchr[103] = "g";
    xchr[104] = "h";
    xchr[105] = "i";
    xchr[106] = "j";
    xchr[107] = "k";
    xchr[108] = "l";
    xchr[109] = "m";
    xchr[110] = "n";
    xchr[111] = "o";
    xchr[112] = "p";
    xchr[113] = "q";
    xchr[114] = "r";
    xchr[115] = "s";
    xchr[116] = "t";
    xchr[117] = "u";
    xchr[118] = "v";
    xchr[119] = "w";
    xchr[120] = "x";
    xchr[121] = "y";
    xchr[122] = "z";
    //end block 17
    //begin block 18
    for (i = first_text_char; i <= last_text_char; i += 1) {
        xord[String.fromCharCode(i)] = invalid_code;
    }
    for (j = 0; j <= last_ASCII_code; j += 1) {
        xord[xchr[j]] = j;
    }
    xord[" "] = " ";
    xord[String.fromCharCode(tab_char)] = " ";
    //end block 18
    //begin block 24
    for (i = first_text_char; i <= last_text_char; i += 1) {
        xclass[String.fromCharCode(i)] = invalid_class;
        xint[String.fromCharCode(i)] = 0;
    }
    xclass[" "] = space_class;
    for (j = 0; j <= last_ASCII_code; j += 1) {
        xext[j] = " ";
    }
    xext[edge_of_word] = ".";
    for (j = 0; j <= 9; j += 1) {
        xdig[j] = xchr[j + 30]; //30 = "0"
        xclass[xdig[j]] = digit_class;
        xint[xdig[j]] = j;
    }
    xhyf[err_hyf] = ".";
    xhyf[is_hyf] = "-";
    xhyf[found_hyf] = "*";
    //end block 24
    //end block 14
}


//block 19
const num_ASCII_codes = last_ASCII_code + 1;
function get_ASCII(c) {
    var i;
    i = xord[c];
    if (i === invalid_code || i === undefined) {
        i = 0;
        while (i < last_ASCII_code) {
            i += 1;
            if (xchr[i] === " " && i !== 32) { //32 = " "
                xord[c] = i;
                xchr[i] = c;
                return i;
            }
        }
        overflow(num_ASCII_codes + " characters");
        xord[c] = i;
        xchr[i] = c;
    }
    return i;
}



//block 30
var trie_c = [],
    trie_l = [],
    trie_r = [],
    trie_taken = [],
    triec_c = [],
    triec_l = [],
    triec_r = [],
    triec_taken = [],
    ops = [];

//block 31
var trieq_c = [],
    trieq_l = [],
    trieq_r = [],
    qmax,
    qmax_thresh;

//block 32
/*
define trie char (#) ≡ trie c [#]
define trie link (#) ≡ trie l [#]
define trie back (#) ≡ trie r [#]
define trie outp (#) ≡ trie r [#]
define trie base used (#) ≡ trie taken [#]

define triec char (#) ≡ triec c [#]
define triec link (#) ≡ triec l [#]
define triec back (#) ≡ triec r [#]
define triec good (#) ≡ triec l [#]
define triec bad (#) ≡ triec r [#]
define triec base used (#) ≡ triec taken [#]

define q char (#) ≡ trieq c [#]
define q link (#) ≡ trieq l [#]
define q back (#) ≡ trieq r [#]
define q outp (#) ≡ trieq r [#]

define hyf val (#) ≡ ops [#].val
define hyf dot (#) ≡ ops [#].dot
define hyf nxt (#) ≡ ops [#].op
*/

//block 33
var trie_max,
    trie_bmax,
    trie_count,
    op_count;

//block 34
const trie_root = 1;

//block 35
function first_fit() {
    var s,
        t,
        q,
        doSearchLoop = true,
        continueLoop = false;
    //block 36
    if (qmax > qmax_thresh) {
        t = trie_r[trie_max + 1];
    } else {
        t = 0;
    }

    while (doSearchLoop) {
        continueLoop = false;
        t = trie_l[t];
        s = t - trieq_c[1];
        //block 37
        if (s > trie_size - num_ASCII_codes) {
            overflow(trie_size + " pattern trie nodes");
        }
        while (trie_bmax < s) {
            trie_bmax += 1;
            trie_taken[trie_bmax] = false;
            trie_c[trie_bmax + last_ASCII_code] = min_packed;
            trie_l[trie_bmax + last_ASCII_code] = trie_bmax + num_ASCII_codes;
            trie_r[trie_bmax + num_ASCII_codes] = trie_bmax + last_ASCII_code;
        }
        // end block 37
        if (!trie_taken[s]) {
            for (q = qmax; q >= 2; q -= 1) {
                if (trie_c[s + trieq_c[q]] !== min_packed) {
                    continueLoop = true;
                }
            }
        } else {
            continueLoop = true;
        }
        doSearchLoop = continueLoop;
    }
    //end block 36
    for (q = 1; q <= qmax; q += 1) {
        t = s + trieq_c[q];
        trie_l[trie_r[t]] = trie_l[t];
        trie_r[trie_l[t]] = trie_r[t];
        trie_c[t] = si(trieq_c[q]);
        trie_l[t] = trieq_l[q];
        trie_r[t] = trieq_r[q];
        if (t > trie_max) {
            trie_max = t;
        }
    }
    trie_taken[s] = true;
    return s;
}

//block 38
function unpack(s) {
    var c,
        t;
    qmax = 1;
    for (c = cmin; c < cmax; c += 1) {
        t = s + c;
        if (trie_c[t] === c) {
            trieq_c[qmax] = c;
            trieq_l[qmax] = trie_l[t];
            trieq_r[qmax] = trie_r[t];
            qmax += 1;
            trie_r[trie_l[0]] = t;
            trie_l[t] = trie_l[0];
            trie_l[0] = t;
            trie_r[t] = 0;
            trie_c[t] = min_packed;
        }
    }
    trie_taken[s] = false;
}
//block 34
function init_pattern_trie() {
    var c, //internal_code
        h; //opt_type
    for (c = 0; c <= last_ASCII_code; c += 1) {
        trie_c[trie_root + c] = si(c);
        trie_l[trie_root + c] = 0;
        trie_r[trie_root + c] = 0;
        trie_taken[trie_root + c] = false;
    }
    trie_taken[trie_root] = true;
    trie_bmax = trie_root;
    trie_max = trie_root + last_ASCII_code;
    trie_count = num_ASCII_codes;
    qmax_thresh = 5;
    trie_l[0] = trie_max + 1;
    trie_r[trie_max + 1] = 0;
    for (h = 1; h <= max_ops; h += 1) {
        ops[h] = {val: 0};
    }
    op_count = 0;
}

//block 39
function new_trie_op(v, d, n) {
    var h;
    h = ((n + 313 * d + 361 * v) % max_ops) + 1;
    while (true) {
        if (ops[h].val === 0) {
            op_count += 1;
            if (op_count === max_ops) {
                overflow(max_ops + " outputs");
            }
            ops[h].val = v;
            ops[h].dot = d;
            ops[h].op = n;
            return h;
        }
        if (ops[h].val === v && ops[h].dot === d && ops[h].op === n) {
            return h;
        }
        if (h > 1) {
            h -= 1;
        } else {
            h = max_ops;
        }
    }
}

//block 40
var pat = [],
    pat_len;

//block 41
function insert_pattern(val, dot) {
    var i,
        s,
        t;
    i = 1;
    s = trie_root + pat[i];
    t = trie_l[s];
    while (t > 0 && i < pat_len) {
        i += 1;
        t += pat[i];
        if (trie_c[t] !== pat[i]) {
            //begin block 42
            if (trie_c[t] === min_packed) {
                trie_l[trie_r[t]] = trie_l[t];
                trie_r[trie_l[t]] = trie_r[t];
                trie_c[t] = si(pat[i]);
                trie_l[t] = 0;
                trie_r[t] = 0;
                if (t > trie_max) {
                    trie_max = t;
                }
            } else {
                unpack(t - pat[i]);
                trieq_c[qmax] = pat[i];
                trieq_l[qmax] = 0;
                trieq_r[qmax] = 0;
                t = first_fit();
                trie_l[s] = t;
                t += pat[i];
            }
            trie_count += 1;
            //end block 42
        }
        s = t;
        t = trie_l[s];
    }
    trieq_l[1] = 0;
    trieq_r[1] = 0;
    qmax = 1;
    while (i < pat_len) {
        i += 1;
        trieq_c[1] = pat[i];
        t = first_fit();
        trie_l[s] = t;
        s = t + pat[i];
        trie_count += 1;
    }
    trie_r[s] = new_trie_op(val, dot, trie_r[s]);
}

//block 43
var triec_max,
    triec_bmax,
    triec_count,
    triec_kmax,
    pat_count;

//block 44
const triec_root = 1;
function init_count_trie() {
    var c;
    for (c = 0; c <= last_ASCII_code; c += 1) {
        triec_c[triec_root + c] = si(c);
        triec_l[triec_root + c] = 0;
        triec_r[triec_root + c] = 0;
        triec_taken[triec_root + c] = false;
    }
    triec_taken[triec_root] = true;
    triec_bmax = triec_root;
    triec_max = triec_root + last_ASCII_code;
    triec_count = num_ASCII_codes;
    triec_kmax = 4096;
    triec_l[0] = triec_max + 1;
    triec_r[triec_max + 1] = 0;
    pat_count = 0;
}

//block 45
function firstc_fit() {
    var a,
        b,
        q,
        doSearchLoop = true,
        continueLoop = false;
    //begin block 46
    if (qmax > 3) {
        a = triec_r[triec_max + 1];
    } else {
        a = 0;
    }
    while (doSearchLoop) {
        continueLoop = false;
        a = triec_l[a];
        b = a - trieq_c[1];
        //begin block 47
        if (b > (triec_kmax - num_ASCII_codes)) {
            if (triec_kmax === triec_size) {
                overflow(triec_size + " count trie nodes (fcf)");
            }
            print(~~(triec_kmax / 1024) + "K ");
            if (triec_kmax > (triec_size - 4096)) {
                triec_kmax = triec_size;
            } else {
                triec_kmax += 4096;
            }
        }
        while (triec_bmax < b) {
            triec_bmax += 1;
            triec_taken[triec_bmax] = false;
            triec_c[triec_bmax + last_ASCII_code] = min_packed;
            triec_l[triec_bmax + last_ASCII_code] = triec_bmax + num_ASCII_codes;
            triec_r[triec_bmax + num_ASCII_codes] = triec_bmax + last_ASCII_code;
        }
        //end block 47
        if (!triec_taken[b]) {
            for (q = qmax; q >= 2; q -= 1) {
                if (triec_c[b + trieq_c[q]] !== min_packed) {
                    continueLoop = true;
                }
            }
        } else {
            continueLoop = true;
        }
        doSearchLoop = continueLoop;
    }
    //end block 46
    for (q = 1; q <= qmax; q += 1) {
        a = b + trieq_c[q];
        triec_l[triec_r[a]] = triec_l[a];
        triec_r[triec_l[a]] = triec_r[a];
        triec_c[a] = si(trieq_c[q]);
        triec_l[a] = trieq_l[q];
        triec_r[a] = trieq_r[q];
        if (a > triec_max) {
            triec_max = a;
        }
    }
    triec_taken[b] = true;
    return b;
}

//block 48
function unpackc(b) {
    var c,
        a;
    qmax = 1;
    for (c = cmin; c <= cmax; c += 1) {
        a = b + c;
        if (triec_c[a] === c) {
            trieq_c[qmax] = c;
            trieq_l[qmax] = triec_l[a];
            trieq_r[qmax] = triec_r[a];
            qmax += 1;
            triec_r[triec_l[0]] = a;
            triec_l[a] = triec_l[0];
            triec_l[0] = a;
            triec_r[a] = 0;
            triec_c[a] = min_packed;
        }
    }
    triec_taken[b] = false;
}

//block 74
var word = [],
    dots = [],
    dotw = [],
    hval = [],
    no_more = [],
    wlen,
    word_wt,
    wt_chg;

//block 49
function insertc_pat(fpos) {
    var spos,
        a,
        b;
    spos = fpos - pat_len;
    spos += 1;
    b = triec_root + word[spos];
    a = triec_l[b];
    while (a > 0 && spos < fpos) {
        spos += 1;
        a += word[spos];
        if (triec_c[a] !== word[spos]) {
            //begin block 50
            if (triec_c[a] === min_packed) {
                triec_l[triec_r[a]] = triec_l[a];
                triec_r[triec_l[a]] = triec_r[a];
                triec_c[a] = si(word[spos]);
                triec_l[a] = 0;
                triec_r[a] = 0;
                if (a > triec_max) {
                    triec_max = a;
                }
            } else {
                unpackc(a - word[spos]);
                trieq_c[qmax] = word[spos];
                trieq_l[qmax] = 0;
                trieq_r[qmax] = 0;
                a = firstc_fit();
                triec_l[b] = a;
                a += word[spos];
            }
            triec_count += 1;
            //end block 50
        }
        b = a;
        a = triec_l[a];
    }
    trieq_l[1] = 0;
    trieq_r[1] = 0;
    qmax = 1;
    while (spos < fpos) {
        spos += 1;
        trieq_c[1] = word[spos];
        a = firstc_fit();
        triec_l[b] = a;
        b = a + word[spos];
        triec_count += 1;
    }
    pat_count += 1;
    return b;
}

//block 51
var pattmp;

//block 52
var buf = [],
    buf_ptr;

//block 53
function print_buf() {
    console.log(buf.join(""));
}

function bad_input(msg) {
    print_buf();
    error(msg, "");
}

//block 52
function read_buf(file) { //read line from file to buf
    var from = file.read_ptr,
        to = file.content.indexOf("\n", from);
    buf = file.content.substring(from, to).split("");
    buf.push(" ");
    max_buf_len = buf.length;
    buf_ptr = buf.length - 1;
    file.read_ptr = to + 1;
}

//block 55
var imax,
    left_hyphen_min,
    right_hyphen_min;

//block 56
function setupDefaultCharTable() {
    var c,
        j;
    left_hyphen_min = 2;
    right_hyphen_min = 3;
    for (j = 65; j <= 90; j += 1) { //A: 65, Z: 90 in ASCII
        imax += 1;
        c = xchr[j + 97 - 65]; //j + "a" - "A"
        xint[c] = imax;
        xext[imax] = c;
        c = xchr[j]; //j + "a" - "A"
        xint[c] = imax;
        xext[imax] = c;
    }
}

function isDigit(c) {
    return (c.charCodeAt() <= 57 && c.charCodeAt() >= 48);
}

//block 57
function setupHyphenationData() {
    var bad = 0,
        n,
        j;
    //left_hyphen_min
    if (buf[0] === " ") {
        n = 0;
    } else if (isDigit(buf[0])) {
        n = xint[buf[0]];
    } else {
        bad = 1;
    }
    if (isDigit(buf[1])) {
        n = 10 * n + xint[parseInt(buf[1], 10)];
    } else {
        bad = 2;
    }
    if (n >= 1 && n < max_dot) {
        left_hyphen_min = n;
    } else {
        bad = 3;
    }
    //right_hyphen_min
    if (buf[2] === " ") {
        n = 0;
    } else if (isDigit(buf[2])) {
        n = xint[buf[2]];
    } else {
        bad = 4;
    }
    if (isDigit(buf[3])) {
        n = 10 * n + xint[buf[3]];
    } else {
        bad = 5;
    }
    if (n >= 1 && n < max_dot) {
        right_hyphen_min = n;
    } else {
        bad = 6;
    }
    /*if (bad) {
        bad = false;
        //get data from user
    }*/
    for (j = err_hyf; j <= found_hyf; j += 1) {
        if (buf[j + 4] !== undefined && buf[j + 4] !== " ") {
            xhyf[j] = buf[j + 4];
        }
    }
    if (bad !== 0) {
        bad_input("Bad hyphenation data: " + bad);
    }

}


//block 58
function setupRepresentationForvarter() {
    var c,
        bad = 0,
        lower = true,
        i,
        s,
        t;
    read_buf(translate);
    buf_ptr = 0;
outer:
    while (bad === 0) {
        pat_len = 0;
        do {
            if (buf_ptr < max_buf_len) {
                buf_ptr += 1;
            } else {
                break outer;
            }
            if (buf[buf_ptr] === buf[0]) {
                if (pat_len === 0) {
                    break outer;
                }
                if (lower) {
                    if (imax === last_ASCII_code) {
                        print_buf();
                        overflow(num_ASCII_codes + " varters");
                    }
                    imax += 1;
                    xext[imax] = xchr[pat[pat_len]];
                }
                c = xchr[pat[1]];
                if (pat_len === 1) {
                    if (xclass[c] !== invalid_class && xclass[c] !== undefined) {
                        bad = 2;
                    }
                    xclass[c] = varter_class;
                    xint[c] = imax;
                } else {
                    //block 59
                    if (xclass[c] === invalid_class) {
                        xclass[c] = escape_class;
                    }
                    if (xclass[c] !== escape_class) {
                        bad = 3;
                    }
                    i = 0;
                    s = trie_root;
                    t = trie_l[s];
                    while (t > trie_root && i < pat_len) {
                        //follow existing trie
                        i += 1;
                        t += pat[i];
                        if (trie_c[t] !== pat[i]) {
                            //begin block 42
                            if (trie_c[t] === min_packed) {
                                trie_l[trie_r[t]] = trie_l[t];
                                trie_r[trie_l[t]] = trie_r[t];
                                trie_c[t] = si(pat[i]);
                                trie_l[t] = 0;
                                trie_r[t] = 0;
                                if (t > trie_max) {
                                    trie_max = t;
                                }
                            } else {
                                unpack(t - pat[i]);
                                trieq_c[qmax] = pat[i];
                                trieq_l[qmax] = 0;
                                trieq_r[qmax] = 0;
                                t = first_fit();
                                trie_l[s] = t;
                                t += pat[i];
                            }
                            trie_count += 1;
                            //end block 42
                        } else {
                            if (trie_r(t) > 0) {
                                bad = 4;
                            }
                        }
                        s = t;
                        t = trie_l[s];
                    }
                    if (t > trie_root) {
                        bad = 5;
                    }
                    trieq_l[1] = 0;
                    trieq_r[1] = 0;
                    qmax = 1;
                    while (i < pat_len) {
                        //insert rest of pattern
                        i += 1;
                        trieq_c[1] = pat[i];
                        t = first_fit();
                        trie_l[s] = t;
                        s = t + pat[i];
                        trie_count += 1;
                    }
                    trie_r[s] = imax;
                    if (!lower) {
                        trie_l[s] = trie_root;
                    }
                }
                //end block 59
            } else {
                if (pat_len === max_dot) {
                    bad = 6;
                } else {
                    pat_len += 1;
                    pat[pat_len] = get_ASCII(buf[buf_ptr]);
                }
            }
        } while ((buf[buf_ptr] !== buf[0]) && bad === 0);
        lower = false;
    }
    if (bad) {
        bad_input("Bad represenation " + bad);
    }
}

//block 54
function read_translate() {
    imax = edge_of_word;
    translate.reset();
    if (translate.eof()) {
        setupDefaultCharTable();
    } else {
        read_buf(translate);
        setupHyphenationData();
        cmax = last_ASCII_code - 1;
        while (!translate.eof()) {
            setupRepresentationForvarter();
        }
        //r.close(translate);
        console.log("left_hyphen_min = " + left_hyphen_min + ", right_hyphen_min = " + right_hyphen_min + ", " + (imax - edge_of_word) + " varters");
        cmax = imax;
    }

}

//block 61
function find_varters(b, i) {
    var c,
        a,
        j,
        l;
    if (i === 0) {
        init_count_trie();
    }
    for (c = cmin; c <= last_ASCII_code; c += 1) {
        a = b + c;
        if (trie_c[a] === c) {
            pat[i] = c;
            if (trie_r[a] === 0) {
                find_varters(trie_l[a], i + 1);
            } else if (trie_l[a] === 0) {
                //begin block 62
                l = triec_root + trie_r[a];
                for (j = 1; j <= i - 1; j += 1) {
                    if (triec_max === triec_size) {
                        overflow(triec_size + " count trie nodes (fl)");
                    }
                    triec_max += 1;
                    triec_l[l] = triec_max;
                    l = triec_max;
                    triec_c[l] = si(pat[j]);
                }
                triec_l[l] = 0;
                //end block 62
            }
        }
    }
}

//block 66
var good_pat_count,
    bad_pat_count,
    good_count,
    bad_count,
    miss_count,
    level_pattern_count,
    more_to_come;

//block 87
var procesp,
    hyphp,
    pat_dot,
    hyph_level,
    filnam = [];

//block 64
function traverse_count_trie(b, i) {
    var c,
        a;
    for (c = cmin; c <= cmax; c += 1) {
        a = b + c;
        if (triec_c[a] === c) {
            pat[i] = c;
            if (i < pat_len) {
                traverse_count_trie(triec_l[a], i + 1);
            } else {
                //begin block 65
                if ((good_wt * triec_l[a]) < thresh) {
                    insert_pattern(max_val, pat_dot);
                    bad_pat_count += 1;
                } else if ((good_wt * triec_l[a] - bad_wt * triec_r[a]) >= thresh) {
                    insert_pattern(hyph_level, pat_dot);
                    good_pat_count += 1;
                    good_count += triec_l[a];
                    bad_count += triec_r[a];
                } else {
                    more_to_come = true;
                }
                //end block 65
            }
        }
    }
}

//block 67
function collect_count_trie() {
    good_pat_count = 0;
    bad_pat_count = 0;
    good_count = 0;
    bad_count = 0;
    more_to_come = false;
    traverse_count_trie(triec_root, 1);
    print(good_pat_count + " good and " + bad_pat_count + " bad patterns added");
    level_pattern_count += good_pat_count;
    if (more_to_come) {
        console.log(" (more to come)");
    } else {
        console.log(" ");
    }
    print("finding " + good_count + " good and " + bad_count + " bad hyphens");
    if (good_pat_count > 0) {
        console.log(" efficiency = " + Number(good_count / (good_pat_count + bad_count / (thresh / good_wt))).toFixed(2));
    } else {
        console.log(" ");
    }
    console.log("pattern trie has " + trie_count + " nodes, trie_max = " + trie_max + ", " + op_count + " outputs");
}

//block 68
function devare_patterns(s) {
    var c,
        t,
        all_freed,
        h,
        n;
    all_freed = true;
    for (c = cmin; c <= cmax; c += 1) {
        t = s + c;
        if (trie_c[t] === c) {
            //begin block 69
            h = 0;
            ops[0] = {op: trie_r[t]};
            n = ops[0].op;
            while (n > 0) {
                if (ops[n].val === max_val) {
                    ops[h].op = ops[n].op;
                } else {
                    h = n;
                }
                n = ops[h].op;
            }
            trie_r[t] = ops[0].op;
            //end block 69
            if (trie_l[t] > 0) {
                trie_l[t] = devare_patterns(trie_l[t]);
            }
            if (trie_l[t] > 0 || trie_r[t] > 0 || s === trie_root) {
                all_freed = false;
            } else {
                //begin block 70
                trie_l[trie_r[trie_max + 1]] = t;
                trie_r[t] = trie_r[trie_max + 1];
                trie_l[t] = trie_max + 1;
                trie_r[trie_max + 1] = t;
                trie_c[t] = min_packed;
                trie_count -= 1;
                //end block 70
            }
        }
    }
    if (all_freed) {
        trie_taken[s] = false;
        s = 0;
    }
    return s;
}

//block 71
function devare_bad_patterns() {
    var old_op_count,
        old_trie_count,
        h;
    old_op_count = op_count;
    old_trie_count = trie_count;
    devare_patterns(trie_root);
    for (h = 1; h <= max_ops; h += 1) {
        if (ops[h].val === max_val) {
            ops[h].val = 0;
            op_count -= 1;
        }
    }
    console.log((old_trie_count - trie_count) + " nodes and " + (old_op_count - op_count) + " outputs devared");
    qmax_thresh = 7;
}

//block 72
function output_patterns(s, pat_len, indent) {
    indent = indent || 0;
    var c,
        t,
        h,
        d;
    for (c = cmin; c <= cmax; c += 1) {
        t = s + c;
        if (trie_c[t] === c) {
            pat[pat_len] = c;
            h = trie_r[t];
            if (h > 0) {
                //begin block 73
                for (d = 0; d <= pat_len; d += 1) {
                    hval[d] = 0;
                }
                do {
                    d = ops[h].dot;
                    if (hval[d] < ops[h].val) {
                        hval[d] = ops[h].val;
                    }
                    h = ops[h].op;
                } while (h !== 0);
                if (hval[0] > 0) {
                    w.write(patout, xdig[hval[0]]);
                }
                for (d = 1; d <= pat_len; d += 1) {
                    w.write(patout, xext[pat[d]]);
                    if (hval[d] > 0) {
                        w.write(patout, xdig[hval[d]]);
                    }
                }
                w.write_ln(patout, "");
                 //end block 73
            }
            if (trie_l[t] > 0) {
                output_patterns(trie_l[t], pat_len + 1, indent + 4);
            }
        }
    }
}

//block 76
function read_word() {
    var c,
        t;
    read_buf(dictionary);
    word[1] = edge_of_word;
    wlen = 1;
    buf_ptr = 0;
found:
    do {
        c = buf[buf_ptr];
        switch (xclass[c]) {
        case space_class:
            break found;
        case digit_class:
            if (wlen === 1) {
                if (xint[c] !== word_wt) {
                    wt_chg = true;
                    word_wt = xint[c];
                }
            } else {
                dotw[wlen] = xint[c];
            }
            break;
        case hyf_class:
            dots[wlen] = xint[c];
            break;
        case varter_class:
            wlen += 1;
            if (wlen === max_len) {
                print_buf();
                overflow("word length=" + max_len);
            }
            word[wlen] = xint[c];
            dots[wlen] = no_hyf;
            dotw[wlen] = word_wt;
            break;
        case escape_class:
            wlen += 1;
            if (wlen === max_len) {
                print_buf();
                overflow("word length=" + max_len);
            }
            //begin block 60: # = word[wlen]
            t = trie_root;
done:
            while (true) {
                t = trie_l[t] + xord[c];
                if (trie_c[t] !== xord[c]) {
                    bad_input("Bad represenation");
                }
                if (trie_r[t] !== 0) {
                    word[wlen] = trie_r[t];
                    break done;
                }
                if (buf_ptr === max_buf_len) {
                    c = " ";
                } else {
                    buf_ptr += 1;
                    c = buf[buf_ptr];
                }
            }
            //end block 60
            dots[wlen] = no_hyf;
            dotw[wlen] = word_wt;
            break;
        case invalid_class:
            bad_input("Bad character");
            break;
        }
        buf_ptr += 1;
    } while (buf_ptr !== max_buf_len);
    wlen += 1;
    word[wlen] = edge_of_word;
    console.log(word, dots, dotw);
}

//block 78
var hyf_min,
    hyf_max,
    hyf_len;


//block 77
function hyphenate() {
    var spos = 0,
        dpos = 0,
        fpos= 0,
        t,
        h,
        v;

    for (spos = wlen - hyf_max; spos >= 0; spos -= 1) {
        no_more[spos] = false;
        hval[spos] = 0;
        fpos = spos + 1;
        t = trie_root + word[fpos];
        do {
            h = trie_r[t];
            while (h > 0) {
                //begin block 80
                dpos = spos + ops[h].dot;
                v = ops[h].val;
                if (v < max_val && hval[dpos] < v) {
                    hval[dpos] = v;
                }
                if (v >= hyph_level) {
                    if ((fpos - pat_len) <= (dpos - pat_dot) && (dpos - pat_dot) <= spos) {
                        no_more[dpos] = true;
                    }
                }
                h = ops[h].op;
                //end block 80
            }
            t = trie_l[t];
            if (t === 0) {
                break;
            }
            fpos += 1;
            t += word[fpos];
        } while (trie_c[t] === word[fpos]);
    }
}

//block 81
function change_dots() {
    var dpos;
    for (dpos = wlen - hyf_max; dpos >= hyf_min; dpos -= 1) {
        if ((hval[dpos] % 2) === 1) {
            dots[dpos] += 1;
        }
        if (dots[dpos] === found_hyf) {
            good_count += dotw[dpos];
        } else if (dots[dpos] === err_hyf) {
            bad_count += dotw[dpos];
        } else if (dots[dpos] === is_hyf) {
            miss_count += dotw[dpos];
        }
    }
}

//block 84
var good_dot,
    bad_dot,
    dot_min,
    dot_max,
    dot_len;

//bloch 82
function output_hyphenated_word() {
    var dpos,
        w2w = "";
    if (wt_chg) {
        w2w += xdig[word_wt];
        wt_chg = false;
    }
    for (dpos = 2; dpos <= wlen - 2; dpos += 1) {
        w2w += xext[word[dpos]];
        if (dots[dpos] !== no_hyf) {
            w2w += xhyf[dots[dpos]];
        }
        if (dotw[dpos] !== word_wt) {
            w2w += xdig[dotw[dpos]];
        }
    }
    w2w += xext[word[wlen - 1]];
    w.write_ln(pattmp, w2w);
}

//block 83
function do_word() {
    var spos,
        dpos,
        fpos,
        a,
        goodp;
    for (dpos = wlen - dot_max; dpos >= dot_min; dpos -= 1) {
        spos = dpos - pat_dot;
        fpos = spos + pat_len;
        //begin block 86
        if (!no_more[dpos]) {
            if (dots[dpos] === good_dot) {
                goodp = true;
                spos += 1;
                a = triec_root + word[spos];
                while (spos < fpos) {
                    spos += 1;
                    a = triec_l[a] + word[spos];
                    if (triec_c[a] !== word[spos]) {
                        a = insertc_pat(fpos);
                        break;
                    }
                }
                if (goodp) {
                    triec_l[a] += dotw[dpos];
                } else {
                    triec_r[a] += dotw[dpos];
                }
            } else if (dots[dpos] === bad_dot) {
                goodp = false;
                spos += 1;
                a = triec_root + word[spos];
                while (spos < fpos) {
                    spos += 1;
                    a = triec_l[a] + word[spos];
                    if (triec_c[a] !== word[spos]) {
                        a = insertc_pat(fpos);
                        break;
                    }
                }
                if (goodp) {
                    triec_l[a] += dotw[dpos];
                } else {
                    triec_r[a] += dotw[dpos];
                }
            }
            //end block 86
        }
    }
}


//block 88
function do_dictionary() {
    good_count = 0;
    bad_count = 0;
    miss_count = 0;
    word_wt = 1;
    wt_chg = false;
    dictionary.reset();
    //begin block 75
    xclass["."] = invalid_class;
    xclass[xhyf[err_hyf]] = hyf_class;
    xint[xhyf[err_hyf]] = no_hyf;
    xclass[xhyf[is_hyf]] = hyf_class;
    xint[xhyf[is_hyf]] = is_hyf;
    xclass[xhyf[found_hyf]] = hyf_class;
    xint[xhyf[found_hyf]] = is_hyf;
    //end block 75
    //begin block 79
    hyf_min = left_hyphen_min + 1;
    hyf_max = right_hyphen_min + 1;
    hyf_len = hyf_min + hyf_max;
    //end block 79
    //begin block 85
    if (procesp) {
        dot_min = pat_dot;
        dot_max = pat_len - pat_dot;
        if (dot_min < hyf_min) {
            dot_min = hyf_min;
        }
        if (dot_max < hyf_max) {
            dot_max = hyf_max;
        }
        dot_len = dot_min + dot_max;
        if ((hyph_level % 2) === 1) { //is odd
            good_dot = is_hyf;
            bad_dot = no_hyf;
        } else {
            good_dot = err_hyf;
            bad_dot = found_hyf;
        }
    }
    //end block 85
    if (procesp) {
        init_count_trie();
        console.log("processing dictionary with pat_len " + pat_len + ", pat_dot = " + pat_dot);
    }
    if (hyphp) {
        filnam = "pattmp." + xdig[hyph_level];
        w.rewrite(filnam);
        pattmp = filnam;
        console.log("writing pattmp." + xdig[hyph_level]);
    }
    //begin block 89
    while (!dictionary.eof()) {
        read_word(); //see block 76
        if (wlen >= hyf_len) {
            hyphenate();
            change_dots();
        }
        if (hyphp) {
            if (wlen > 2) {
                output_hyphenated_word();
            }
        }
        if (procesp) {
            if (wlen >= dot_len) {
                do_word();
            }
        }
    }
    //end block 89
    //r.close(dictionary);
    console.log(" ");
    console.log(good_count + " good, " + bad_count + " bad, " + miss_count + " missed");
    if ((good_count + miss_count) > 0) {
        console.log(Number(100 * good_count / (good_count + miss_count)).toFixed(2) + " %, " + Number(100 * bad_count / (good_count + miss_count)).toFixed(2) + " %, " + Number(100 * miss_count / (good_count + miss_count)).toFixed(2) + " %");
    }
    if (procesp) {
        console.log(pat_count + " patterns, " + triec_count + " nodes in count trie, " + "triec_max = " + triec_max);
    }
    if (hyphp) {
        w.close(pattmp);
    }
}

//block 91
var max_pat;

//block 90
function read_patterns() {
    var c,
        d,
        i,
        t;
    xclass["."] = varter_class;
    xint["."] = edge_of_word;
    level_pattern_count = 0;
    max_pat = 0;
    patterns.reset();
    while (!patterns.eof()) {
        read_buf(patterns);
        level_pattern_count += 1;
        //begin block 92
        pat_len = 0;
        buf_ptr = 0;
        hval[0] = 0;
found:  do {
            c = buf[buf_ptr];
            switch (xclass[c]) {
            case space_class:
                break found;
            case digit_class:
                d = xint[c];
                if (d >= max_val) {
                    bad_input("Bad hyphenation value");
                }
                if (d > max_pat) {
                    max_pat = d;
                }
                hval[pat_len] = d;
                break;
            case varter_class:
                pat_len += 1;
                hval[pat_len] = 0;
                pat[pat_len] = xint[c];
                break;
            case escape_class:
                pat_len += 1;
                hval[pat_len] = 0;
                //begin block 60: # = pat[pat_len]
                t = trie_root;
                while (true) {
                    t = trie_l[t] + xord[c];
                    if (trie_c[t] !== xord[c]) {
                        bad_input("Bad represenation");
                    }
                    if (trie_r[t] !== 0) {
                        pat[pat_len] = trie_r[t];
                        break;
                    }
                    if (buf_ptr === max_buf_len) {
                        c = " ";
                    } else {
                        buf_ptr += 1;
                        c = buf[buf_ptr];
                    }
                }
                //end block 60
                break;
            default:
                bad_input("Bad character");
            }
            buf_ptr += 1;
        } while (buf_ptr !== max_buf_len);
        //end block 92
        //block 93
        if (pat_len > 0) {
            for (i = 0; i <= pat_len; i += 1) {
                if (hval[i] !== 0) {
                    insert_pattern(hval[i], i);
                }
                if (i > 1) {
                    if (i < pat_len) {
                        if (pat[i] === edge_of_word) {
                            bad_input("Bad edge_of_word");
                        }
                    }
                }
            }
        }
    }
    //r.close(patterns);
    console.log(level_pattern_count + " patterns read in");
    console.log("pattern trie has " + trie_count + " nodes, trie_max = " + trie_max + ", " + op_count + " outputs");
}

//block 95
var i,
    j,
    k,
    dot1,
    more_this_level = [];


//block 94
function main() {
    initialize();
    init_pattern_trie();
    read_translate();
    read_patterns();
    procesp = true;
    hyphp = false;
    //instead of user inputs we use a settings file
    const sets = require("./settings.js");
    if (sets.run[run_count].hyph_start >= 1 && sets.run[run_count].hyph_start < max_val && sets.run[run_count].hyph_finish >= 1 && sets.run[run_count].hyph_finish < max_val) {
        hyph_start = sets.run[run_count].hyph_start;
        hyph_finish = sets.run[run_count].hyph_finish;
    } else {
        console.log("Specifiy 1<=hyph_start,hyph_finish<=" + (max_val - 1) + " !");
    }
    hyph_level = max_pat;
    for (i = hyph_start; i <= hyph_finish; i += 1) {
        hyph_level = i;
        level_pattern_count = 0;
        if (hyph_level > hyph_start) {
            console.log(" ");
        } else {
            if (hyph_start <= max_pat) {
                console.log("Largest hyphenation value " + max_pat + " in patterns should be less than hyphen_start");
            }
        }
        if (sets.run[run_count].pat_start >= 1 && sets.run[run_count].pat_start <= sets.run[run_count].pat_finish && sets.run[run_count].pat_finish <= max_dot) {
            pat_start = sets.run[run_count].pat_start;
            pat_finish = sets.run[run_count].pat_finish;
        } else {
            console.log("Specifiy 1<=pat_start<=pat_finish<=" + max_dot + " !");
        }
        if (sets.run[run_count].good >= 1 && sets.run[run_count].bad >= 1 && sets.run[run_count].thresh >= 1) {
            good_wt = sets.run[run_count].good;
            bad_wt = sets.run[run_count].bad;
            thresh = sets.run[run_count].thresh;
        } else {
            console.log("Specifiy good weight, bad weight, threshold>=1 !");
        }
        console.log("hyph_start, hyph_finish: " + hyph_start + " " + hyph_finish);
        console.log("pat_start, pat_finish: " + pat_start + " " + pat_finish);
        console.log("good weight, bad weight, threshold: " + good_wt + " " + bad_wt + " " + thresh);
        //generate a level 96
        for (k = 0; k <= max_dot; k += 1) {
            more_this_level[k] = true;
        }
        for (j = pat_start; j <= pat_finish; j += 1) {
            pat_len = j;
            pat_dot = ~~(pat_len / 2); //integer division
            dot1 = pat_dot * 2;
            do {
                pat_dot = dot1 - pat_dot;
                dot1 = pat_len * 2 - dot1 - 1;
                if (more_this_level[pat_dot]) {
                    console.time("do_dictionary");
                    do_dictionary();
                    console.timeEnd("do_dictionary");
                    collect_count_trie();
                    more_this_level[pat_dot] = more_to_come;
                }
            } while (pat_dot !== pat_len);
            for (k = max_dot; k <= 1; k -= 1) {
                if (!more_this_level[k - 1]) {
                    more_this_level[k] = false;
                }
            }
        }
        //end block 96
        devare_bad_patterns();
        console.log("total of " + level_pattern_count + " patterns at hyph_level " + hyph_level);
    }
    find_varters(trie_l[trie_root], 1);
    w.rewrite(patout);
    output_patterns(trie_root, 1);
    w.close(patout);
    //block 97
    procesp = false;
    hyphp = true;
    console.log("hyphenate word list? Y");
    do_dictionary();
}

main();



