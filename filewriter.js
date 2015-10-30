/*jslint browser: false, node:true, es6:true*/
"use strict";

const fs = require("fs");

let File = function (path) {
    let file = {
        path: path,
        write_ptr: 0,
        d: fs.openSync(path, "a")
    };
    return file;
};

let files = {};


exports.rewrite = function (path) {
    if (files.hasOwnProperty(path)) {
        files[path].write_ptr = 0;
    } else {
        files[path] = new File(path);
    }
};

exports.close = function (path) {
    let file;
    if (files.hasOwnProperty(path)) {
        file = files[path];
        fs.closeSync(file.d);
    }
    delete files[path];
};

exports.write = function (path, data) {
    //console.log("write", path, "|" + data + "|");
    let file;
    if (files.hasOwnProperty(path)) {
        file = files[path];
        fs.writeSync(file.d, data);
    }
};

exports.write_ln = function (path, data) {
    let file;
    if (files.hasOwnProperty(path)) {
        file = files[path];
        fs.writeSync(file.d, data + "\n");
    }
};
