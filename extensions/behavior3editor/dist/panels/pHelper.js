"use strict";
/*
 * @Author: xzben
 * @Date: 2022-06-01 12:16:27
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-08 18:44:35
 * @Description: file content
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pHelper = void 0;
const fs_extra_1 = require("fs-extra");
const package_json_1 = __importDefault(require("../../package.json"));
class pHelper {
    static getMutileCSS(files) {
        let css = [];
        files.forEach((file) => {
            css.push((0, fs_extra_1.readFileSync)(file, 'utf-8'));
        });
        return css.join("\r\n");
    }
    static openView(name) {
        Editor.Panel.open(package_json_1.default.name + "." + name);
    }
    static openSettingView() {
        this.openView("setting");
    }
    static setNodeValue(node, value) {
        if (node == null)
            return;
        node.value = value;
    }
    static bindNodeValueChange(node, changeCall) {
        node.onchange = () => {
            let value = this.getNodeValue(node);
            changeCall(value);
        };
    }
    static bindNodeValue(node, data, key, changeCall = null) {
        this.setNodeValue(node, data[key]);
        node.onchange = () => {
            let value = this.getNodeValue(node);
            if (changeCall) {
                let ret = changeCall(value, data[key]);
                if (ret != null) {
                    value = ret;
                }
            }
            data[key] = value;
        };
    }
    static getNodeValue(node) {
        if (node == null)
            return;
        return node.value;
    }
}
exports.pHelper = pHelper;
