"use strict";
/*
 * @Author: xzben
 * @Date: 2022-06-01 09:33:56
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-09 09:43:46
 * @Description: file content
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.b3Utils = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class b3Utils {
    static getFilesList(dir, ext, list) {
        let files = fs.readdirSync(dir);
        files.forEach((file) => {
            let fullpath = dir + "/" + file;
            let states = fs.statSync(fullpath);
            if (states.isDirectory()) {
                this.getFilesList(fullpath, ext, list);
            }
            else {
                let extname = path.extname(file);
                if (ext == "*" || ext == extname) {
                    list.push(fullpath);
                }
            }
        });
    }
    static getFilesFromDir(dir, ext = "*") {
        let list = [];
        this.getFilesList(dir, ext, list);
        return list;
    }
    static cloneObject(from, dest) {
        for (let key in from) {
            dest[key] = from[key];
        }
    }
}
exports.b3Utils = b3Utils;
