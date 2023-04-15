"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: xzben
 * @Date: 2022-05-30 19:51:31
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-07 20:39:54
 * @Description: file content
 */
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const ProjectManager_1 = require("../../project/ProjectManager");
const pHelper_1 = require("../pHelper");
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/setting/setting.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/style/setting/setting.css'), 'utf-8'),
    $: {
        storepath: "#storepath",
        deletenodetips: "#deletenodetips",
    },
    methods: {
        initView() {
            console.log("initview", ProjectManager_1.ProjectManager.getInstance().storepath);
            pHelper_1.pHelper.setNodeValue(this.$.storepath, ProjectManager_1.ProjectManager.getInstance().storepath);
            pHelper_1.pHelper.setNodeValue(this.$.deletenodetips, ProjectManager_1.ProjectManager.getInstance().deleteTips);
            this.$.storepath.onchange = (ev) => {
                let newpath = pHelper_1.pHelper.getNodeValue(this.$.storepath);
                ProjectManager_1.ProjectManager.getInstance().setStorePath(newpath);
                console.log("onchange", newpath);
            };
            this.$.deletenodetips.onchange = () => {
                let value = pHelper_1.pHelper.getNodeValue(this.$.deletenodetips);
                ProjectManager_1.ProjectManager.getInstance().setDeleteNodeTips(value);
                console.log("onchange", value, typeof (value));
            };
        }
    },
    async ready() {
        await ProjectManager_1.ProjectManager.getInstance().init();
        this.initView();
    },
    beforeClose() { },
    close() { },
});
