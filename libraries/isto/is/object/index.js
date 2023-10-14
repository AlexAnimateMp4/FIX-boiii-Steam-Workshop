/*This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
  This Source Code Form is "Incompatible With Secondary Licenses", as
  defined by the Mozilla Public License, v. 2.0.*/
import to_string from "../../to/string/index.js";
export default function(value) {
    try {
        if (typeof (value) == "object" && value != null && value?.constructor == Object) return this?.notEmpty != false ? Object.keys(value).length > 0 : true;
        else if (this?.stringify != false) {
            value = JSON.parse(to_string(value));
            return typeof (value) == "object" && value != null && value?.constructor == Object ? this?.notEmpty != false ? Object.keys(value).length > 0 : true : false;
        } else return false;
    } catch (error) {
        return false;
    };
};