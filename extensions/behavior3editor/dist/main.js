"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
/*
 * @Author: xzben
 * @Date: 2022-05-30 19:51:31
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-01 15:03:36
 * @Description: file content
 */
//@ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const ProjectManager_1 = require("./project/ProjectManager");
function openSelfPanel(name) {
    Editor.Panel.open(package_json_1.default.name + "." + name);
}
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    openMainPanel() {
        openSelfPanel("main");
    },
    openSettingPanel() {
        openSelfPanel("setting");
    },
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
async function load() {
    await ProjectManager_1.ProjectManager.getInstance().init();
}
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() {
    ProjectManager_1.ProjectManager.clearInstance();
}
exports.unload = unload;
