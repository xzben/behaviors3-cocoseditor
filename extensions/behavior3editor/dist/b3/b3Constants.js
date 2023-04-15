"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUUID = exports.Status = exports.Category = void 0;
/*
 * @Author: xzben
 * @Date: 2022-05-31 20:33:30
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-01 10:51:55
 * @Description: file content
 */
var Category;
(function (Category) {
    Category["Tree"] = "tree";
    Category["COMPOSITE"] = "composite";
    Category["DECORATOR"] = "decorator";
    Category["ACTION"] = "action";
    Category["CONDITION"] = "condition";
})(Category = exports.Category || (exports.Category = {}));
var Status;
(function (Status) {
    Status[Status["SUCCESS"] = 1] = "SUCCESS";
    Status[Status["FAILURE"] = 2] = "FAILURE";
    Status[Status["RUNNING"] = 3] = "RUNNING";
    Status[Status["ERROR"] = 4] = "ERROR";
})(Status = exports.Status || (exports.Status = {}));
function CreateUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = "4";
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[19] = hexDigits.substr((parseInt(s[19]) & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
exports.CreateUUID = CreateUUID;
