"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: xzben
 * @Date: 2022-05-30 19:51:31
 * @LastEditors: xzben
 * @LastEditTime: 2022-05-31 14:23:52
 * @Description: file content
 */
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const defaultNode_1 = require("./main/defaultNode");
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
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
        compositeList: "#compositeList",
        DecoratorList: "#DecoratorList",
        ActionList: "#ActionList",
        ConditionList: "#ConditionList",
        drag_view: "#drag_view",
    },
    methods: {
        getListItems(type) {
            let content = [];
            let list = defaultNode_1.DefaultNodeList[type];
            for (let i = 0; i < list.length; i++) {
                let node = list[i];
                let valuestr = JSON.stringify(node.value);
                content.push('<ui-drag-item class="treenode" ondragstart="handleDragStart(...arguments);" type="' + type + '" value=\'' + valuestr + '\'>' + node.name + '</ui-drag-item>');
            }
            return content.join("\r\n");
        },
        handleDragStart(ev) {
            var _a;
            let target = ev.target;
            console.log("value", target.getAttribute("value"));
            (_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("value", target.getAttribute("value"));
        },
        initListNode() {
            let lists = {
                compositeList: { type: "Composite" },
                DecoratorList: { type: "Decorator" },
                ActionList: { type: "Action" },
                ConditionList: { type: "Condition" },
            };
            for (let key in lists) {
                let config = lists[key];
                let node = this.$[key];
                node.innerHTML = this.getListItems(config.type);
            }
        },
        handleDropNode(ev) {
            console.log("dragenter 1111", ev.target, ev.dataTransfer);
            console.log("Editor.UI.DragArea.currentDragInfo", Editor.UI.DragArea.currentDragInfo);
        },
        initGlobalFunc() {
            let bindGlobalFunc = ["handleDropNode", "handleDragStart"];
            let globalMap = globalThis;
            let thisMap = this;
            for (let i = 0; i < bindGlobalFunc.length; i++) {
                let funcname = bindGlobalFunc[i];
                globalMap[funcname] = (...params) => {
                    thisMap[funcname](...params);
                };
            }
        }
    },
    ready() {
        this.initListNode();
        this.initGlobalFunc();
    },
    beforeClose() { },
    close() { },
});
