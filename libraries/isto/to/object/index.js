/*This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
  This Source Code Form is "Incompatible With Secondary Licenses", as
  defined by the Mozilla Public License, v. 2.0.*/
import is_object from "../../is/object/index.js";
import is_string from "../../is/string/index.js";
export default function(value) {
    try {
        if (is_object(value) == true) return is_string(value) == true ? JSON.parse(value) : value;
        else if (this?.default != false) return {};
    } catch (error) {
        if (this?.default != false) return {};
    };
};