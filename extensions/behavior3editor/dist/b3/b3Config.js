"use strict";
/*
 * @Author: xzben
 * @Date: 2022-06-01 10:52:55
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-09 11:13:02
 * @Description: file content
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.b3InsertNodeUUID = exports.b3FreeNodeUUID = exports.b3ClearAllUUID = exports.b3GetNodeUUID = void 0;
const b3Constants_1 = require("./b3Constants");
let cache_uuid = new Map();
function b3GetNodeUUID() {
    let uuid = (0, b3Constants_1.CreateUUID)();
    while (cache_uuid.get(uuid) != null) {
        uuid = (0, b3Constants_1.CreateUUID)();
    }
    cache_uuid.set(uuid, true);
    return uuid;
}
exports.b3GetNodeUUID = b3GetNodeUUID;
function b3ClearAllUUID() {
    cache_uuid.clear();
}
exports.b3ClearAllUUID = b3ClearAllUUID;
function b3FreeNodeUUID(uuid) {
    cache_uuid.delete(uuid);
}
exports.b3FreeNodeUUID = b3FreeNodeUUID;
function b3InsertNodeUUID(uuid) {
    cache_uuid.set(uuid, true);
}
exports.b3InsertNodeUUID = b3InsertNodeUUID;
