/*jslint browser: false, node:true, es6:true*/
"use strict";

const fs = require("fs");

const File = function (path) {
    this.read_ptr = 0;
    this.content = fs.readFileSync(path, 'utf8');
};

File.prototype = {
    eof: function () {
        return this.read_ptr === this.content.length;
    },
    reset: function () {
        this.read_ptr = 0;
    },
    read: function () {
        let r = this.content.charAt(this.read_ptr);
        this.read_ptr += 1;
        return r;
    }
};

module.exports = function makeFileProxy(path) {
    return new File(path);
};