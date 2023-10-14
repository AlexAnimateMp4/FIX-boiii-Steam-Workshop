/*This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
  This Source Code Form is "Incompatible With Secondary Licenses", as
  defined by the Mozilla Public License, v. 2.0.*/
import is_string from "./isto/is/string/index.js";
/*
^R = Reset
^B = Bright
^D = Dim
^U = Underscore
^F = Blink
^V = Reverse
^H = Hidden

^0 = FG Black
^1 = FG Red
^2 = FG Green
^3 = FG Yellow
^4 = FG Blue
^5 = FG Cyan
^6 = FG Magenta
^7 = FG White
^8 = FG Crimson
^9 = FG Gray

^B0 = BG Black
^B1 = BG Red
^B2 = BG Green
^B3 = BG Yellow
^B4 = BG Blue
^B5 = BG Cyan
^B6 = BG Magenta
^B7 = BG White
^B8 = BG Crimson
^B9 = BG Gray
*/
const colors = {
    R: "\x1b[0m",
    B: "\x1b[1m",
    D: "\x1b[2m",
    U: "\x1b[4m",
    F: "\x1b[5m",
    V: "\x1b[7m",
    H: "\x1b[8m",
    0: "\x1b[30m",
    1: "\x1b[31m",
    2: "\x1b[32m",
    3: "\x1b[33m",
    4: "\x1b[34m",
    5: "\x1b[36m",
    6: "\x1b[35m",
    7: "\x1b[37m",
    8: "\x1b[38m",
    9: "\x1b[90m",
    B0: "\x1b[40m",
    B1: "\x1b[41m",
    B2: "\x1b[42m",
    B3: "\x1b[43m",
    B4: "\x1b[44m",
    B5: "\x1b[46m",
    B6: "\x1b[45m",
    B7: "\x1b[47m",
    B8: "\x1b[48m",
    B9: "\x1b[100m"
};
for (const method of ["log", "info", "warn", "error"]) {
    const original = console[method];
    console[method] = function () {
        let args = Array.prototype.slice.call(arguments);
        if (args.length > 0) {
            const stringArgs = args.map((arg, index) => [is_string(arg) == true, index]).filter(([stringArg]) => stringArg == true);
            if (stringArgs.length > 0) {
                for (let index = 0; index < stringArgs.length; index++) {
                    const argIndex = stringArgs[index][1];
                    args[argIndex] = args[argIndex].replace(new RegExp(Object.keys(colors).map(key => `\\^${key}`).join("|"), "gmi"), match => colors[match.replace(/\^/gmi, "")]);
                    if (index == stringArgs.length - 1) {
                        const reset = colors["R"];
                        if (args[argIndex].endsWith(reset) != true) args[argIndex] = args[argIndex] + reset;
                        original.apply(null, args);
                    };
                };
            } else original.apply(null, args);
        } else original.apply(null, args);
    };
};