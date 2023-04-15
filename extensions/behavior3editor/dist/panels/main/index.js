"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: xzben
 * @Date: 2022-05-30 19:51:31
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-10 16:54:42
 * @Description: file content
 */
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const b3Constants_1 = require("../../b3/b3Constants");
const b3Node_1 = require("../../b3/b3Node");
const b3Tree_1 = require("../../b3/b3Tree");
const ProjectManager_1 = require("../../project/ProjectManager");
const pHelper_1 = require("../pHelper");
const NodeGraphView_1 = require("../nodegraph/NodeGraphView");
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
let globalStatus = {
    isResizing: false,
};
let INIT_LEFT_WIDTH = 300;
let INIT_RIGHT_WIDTH = 400;
let CONTENT_PADDING = 2;
let MINI_CONENT_WIDTH = 100;
let csssfiles = [
    (0, path_1.join)(__dirname, '../../../static/style/main/index.css'),
    (0, path_1.join)(__dirname, '../../../static/style/common/menu.css'),
    (0, path_1.join)(__dirname, '../../../static/style/main/left_list.css'),
    (0, path_1.join)(__dirname, '../../../static/style/main/right_info.css'),
    (0, path_1.join)(__dirname, '../../../static/style/logicflow/logicflow.css'),
    (0, path_1.join)(__dirname, '../../../static/style/logicflow/extension.css'),
];
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/main/index.html'), 'utf-8'),
    style: pHelper_1.pHelper.getMutileCSS(csssfiles),
    $: {
        app: '#app',
        compositeList: "#compositeList",
        DecoratorList: "#DecoratorList",
        ActionList: "#ActionList",
        ConditionList: "#ConditionList",
        TreeList: "#TreeList",
        drag_view: "#drag_view",
        graph_view: "#graph_view",
        left_list: "#left_list",
        center_content: "#center_content",
        right_info: "#right_info",
        newTree: "#newTree",
        btn_setting: "#btn_setting",
        propertiesView: "#propertiesView"
    },
    methods: {
        getListItems(listNode, category) {
            let arr = ProjectManager_1.ProjectManager.getInstance().getCategoryNodeDefineList(category);
            if (arr == null)
                return "";
            for (let i = 0; i < arr.length; i++) {
                let node = arr[i];
                let valuestr = JSON.stringify({ name: node.name, category: node.category });
                let itemNode = document.createElement("ui-drag-item");
                itemNode.className = "treenode";
                itemNode.ondragstart = (ev) => {
                    this.handleDragStart(ev);
                };
                itemNode.setAttribute("type", category);
                itemNode.setAttribute("value", valuestr);
                itemNode.textContent = node.title;
                listNode.appendChild(itemNode);
            }
        },
        addTreeNode(tree) {
            if (!this.$.TreeList)
                return;
            let valuestr = JSON.stringify({ name: tree.name, category: b3Constants_1.Category.Tree, id: tree.id });
            let node = document.createElement("ui-drag-item");
            let uuid = tree.id;
            node.setAttribute("uuid", uuid);
            node.setAttribute("type", "tree");
            node.setAttribute("value", valuestr);
            node.onclick = (ev) => {
                this.selectTreeNode(ev);
            };
            node.ondragstart = (ev) => {
                this.handleDragStart(ev);
            };
            node.textContent = tree.title;
            let nodeprop = document.createElement("p");
            nodeprop.className = "treenode";
            let nodeBtnDelete = document.createElement("ui-button");
            nodeBtnDelete.className = "tree_delete_btn";
            nodeBtnDelete.onclick = () => {
                ProjectManager_1.ProjectManager.getInstance().removeTreebyId(uuid);
                nodeprop.remove();
                tree.deleteFile();
                let activetree = ProjectManager_1.ProjectManager.getInstance().getActiveTree();
                if (activetree && activetree.id == tree.id) {
                    this.activeEditorTree(null);
                }
            };
            nodeBtnDelete.textContent = "Delete";
            tree.htmlNode = node;
            nodeprop.appendChild(nodeBtnDelete);
            nodeprop.appendChild(node);
            this.$.TreeList.appendChild(nodeprop);
        },
        handleDragStart(ev) {
            var _a;
            let target = ev.target;
            (_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("value", target.getAttribute("value"));
        },
        handleDropNode(ev) {
            let curtree = ProjectManager_1.ProjectManager.getInstance().getActiveTree();
            if (curtree == null) {
                console.error("please active tree first");
                return;
            }
            let info = Editor.UI.DragArea.currentDragInfo;
            let value = JSON.parse(info.value);
            let pos = NodeGraphView_1.NodeGraphView.getInstance().getViewPos(ev.clientX, ev.clientY);
            console.log("handleDropNode", info, pos);
            let name = value.name;
            let category = value.category;
            if (name == null) {
                console.error("error for drag name");
                return;
            }
            if (category == b3Constants_1.Category.Tree) {
                let tree = ProjectManager_1.ProjectManager.getInstance().getTreeById(value.id);
                let node = b3Node_1.b3Node.createTreeNode(tree);
                node.display.x = pos.x;
                node.display.y = pos.y;
                curtree.addNode(node);
            }
            else {
                let node = b3Node_1.b3Node.createByName(name);
                node.display.x = pos.x;
                node.display.y = pos.y;
                curtree.addNode(node);
            }
            this.updateNodeView();
        },
        initListNode() {
            let lists = {
                TreeList: { category: "tree" },
                compositeList: { category: "composite" },
                DecoratorList: { category: "decorator" },
                ActionList: { category: "action" },
                ConditionList: { category: "condition" },
            };
            for (let key in lists) {
                let config = lists[key];
                let node = this.$[key];
                this.getListItems(node, config.category);
            }
            let trees = ProjectManager_1.ProjectManager.getInstance().trees;
            trees.forEach((tree) => {
                this.addTreeNode(tree);
            });
        },
        initGlobalFunc() {
            let globalMap = globalThis;
            globalMap.view = this;
        },
        initResize() {
            if (this.$.app && this.$.center_content && this.$.left_list && this.$.right_info) {
                globalStatus.isResizing = false;
                let content = this.$.center_content;
                let leftList = this.$.left_list;
                let rightInfo = this.$.right_info;
                let app = this.$.app;
                let totalWidth = window.innerWidth;
                let totalHeight = window.innerHeight;
                window.onresize = (ev) => {
                    totalWidth = window.innerWidth;
                    totalHeight = window.innerHeight;
                    let leftWidth = leftList.offsetWidth;
                    let rightWidth = rightInfo.offsetWidth;
                    content.style.width = `${totalWidth - leftWidth - rightWidth - 2 * CONTENT_PADDING - 2}px`;
                };
                // 鼠标按下时的坐标，并在修改尺寸时保存上一个鼠标的位置
                let clientX = 0, clientY = 0;
                // 鼠标按下时的位置，使用n、s、w、e表示
                let direc = '';
                leftList.style.width = `${INIT_LEFT_WIDTH}px`;
                content.style.width = `${totalWidth - INIT_LEFT_WIDTH - INIT_RIGHT_WIDTH - 2 * CONTENT_PADDING - 2}px`;
                rightInfo.style.width = `${INIT_RIGHT_WIDTH}px`;
                let getMoveDirection = (ev) => {
                    let dir = '';
                    let xP = ev.clientX;
                    let yP = ev.clientY;
                    let cx = content.offsetLeft;
                    let cy = content.offsetTop;
                    let offset = 10;
                    if (yP < cy + offset)
                        dir += 'n';
                    else if (yP > cy + content.offsetHeight - offset)
                        dir += 's';
                    if (xP < cx + offset)
                        dir += 'w';
                    else if (xP > cx + content.offsetWidth - offset)
                        dir += 'e';
                    return dir;
                };
                this.$.app.onmousemove = (ev) => {
                    // console.log("app mouse move", ev.offsetX, ev.offsetY)
                    let d = getMoveDirection(ev);
                    let cursor = 'default';
                    // console.log("this.$.app.onmousemove", d)
                    if (d !== '') {
                        cursor = d + "-resize";
                    }
                    content.style.cursor = cursor;
                    if (globalStatus.isResizing) {
                        let borderwidht = CONTENT_PADDING * 2;
                        // // 鼠标按下的位置在上部，修改高度
                        // if (direc.indexOf('n') !== -1) {
                        //     content.style.height = Math.max(minH, content.offsetHeight + (clientY - ev.clientY)) + 'px'
                        //     clientY = ev.clientY
                        // }
                        // // 鼠标按下的位置在底部，修改高度
                        // if (direc.indexOf('s') !== -1) {
                        //     content.style.height = Math.max(minH, content.offsetHeight + (ev.clientY - clientY)) + 'px'
                        //     clientY = ev.clientY
                        // }
                        // 鼠标按下的位置在左边，修改宽度
                        if (direc.indexOf('w') !== -1) {
                            let offetWidth = ev.clientX - clientX; //变化的宽度
                            let contentWidth = content.offsetWidth - borderwidht;
                            let newLeftWidth = leftList.offsetWidth + offetWidth;
                            let newContentWidth = contentWidth - offetWidth;
                            if (newLeftWidth >= INIT_LEFT_WIDTH && newContentWidth >= MINI_CONENT_WIDTH) {
                                content.style.width = `${newContentWidth}px`;
                                content.style.marginLeft = `${Math.max(0, content.clientLeft - leftList.offsetWidth + offetWidth)}px`;
                                leftList.style.width = `${newLeftWidth}px`;
                                clientX = ev.clientX;
                            }
                        }
                        // // 鼠标按下的位置在右边，修改宽度
                        if (direc.indexOf('e') !== -1) {
                            let offetWidth = ev.clientX - clientX; //变化的宽度
                            let contentWidth = content.offsetWidth - borderwidht;
                            let newRightWidth = rightInfo.offsetWidth - offetWidth;
                            let newContentWidth = contentWidth + offetWidth;
                            let leftWidth = leftList.offsetWidth + content.offsetWidth;
                            if (newRightWidth >= INIT_RIGHT_WIDTH && newContentWidth >= MINI_CONENT_WIDTH) {
                                content.style.width = `${newContentWidth}px`;
                                rightInfo.style.width = `${newRightWidth}px`;
                                rightInfo.style.marginLeft = `${Math.max(0, rightInfo.clientLeft - leftWidth + offetWidth)}px`;
                                clientX = ev.clientX;
                            }
                        }
                    }
                };
                this.$.app.onmouseup = (ev) => {
                    globalStatus.isResizing = false;
                };
                this.$.center_content.onmousedown = (ev) => {
                    let d = getMoveDirection(ev);
                    // 当位置为四个边和四个角时才开启尺寸修改
                    if (d !== '') {
                        globalStatus.isResizing = true;
                        direc = d;
                        clientX = ev.clientX;
                        clientY = ev.clientY;
                    }
                };
            }
        },
        setDivDragMove(node) {
            let isMoving = false;
            let isValid = false;
            let clientX = 0, clientY = 0;
            node.classList.add("drap_move_node");
            node.onmouseenter = () => {
                if (globalStatus.isResizing)
                    return;
                isValid = true;
            };
            node.onmouseleave = () => {
                isValid = false;
                isMoving = false;
            };
            node.onmousedown = (ev) => {
                if (globalStatus.isResizing)
                    return;
                if (!isValid)
                    return;
                isMoving = true;
                clientX = ev.clientX;
                clientY = ev.clientY;
            };
            node.onmousemove = (ev) => {
                if (!isValid)
                    return;
                if (isMoving) {
                    let offX = ev.clientX - clientX;
                    let offy = ev.clientY - clientY;
                    let parent = node.parentElement;
                    let parentWidth = parent.clientWidth;
                    let parentHeight = parent.clientHeight;
                    let parentOffsetx = parent.offsetLeft;
                    let parentOffsettop = parent.offsetTop;
                    let left = node.offsetLeft - parentOffsetx;
                    let top = node.offsetTop - parentOffsettop;
                    left = left + offX;
                    top = top + offy;
                    console.log(" offset", left, top, node.offsetWidth, node.offsetHeight, parentWidth, parentHeight);
                    if (left < -1 * (node.offsetWidth - 10))
                        left = -1 * (node.offsetWidth - 10);
                    if (left > parentWidth - 10)
                        left = parentWidth - 10;
                    if (top < -1 * (node.offsetHeight - 10))
                        top = -1 * (node.offsetHeight - 10);
                    if (top > parentHeight - 10)
                        top = parentHeight - 10;
                    node.style.left = `${left}px`;
                    node.style.top = `${top}px`;
                    console.log(" offset", left, top, offX, offy, parentWidth, parentHeight);
                    console.log("node.style.left", node.style.left, node.style.top);
                }
                clientX = ev.clientX;
                clientY = ev.clientY;
            };
            node.onmouseup = (ev) => {
                isMoving = false;
            };
        },
        initScaleContent() {
            if (this.$.center_content && this.$.drag_view) {
                let dragView = this.$.drag_view;
                let content = this.$.center_content;
                this.setDivDragMove(dragView);
                let step = 100;
                content.onwheel = (ev) => {
                    let change = ev.wheelDelta > 0 ? step : -step;
                    let oldWidth = dragView.clientWidth;
                    let oldHeight = dragView.clientHeight;
                    let newWidth = oldWidth + change;
                    let newHeight = oldHeight + change;
                    // if(newWidth < content.offsetWidth || newHeight < content.offsetHeight)return;
                    dragView.style.width = `${newWidth}px`;
                    dragView.style.height = `${newHeight}px`;
                    let parent = content;
                    let parentOffsetx = parent.offsetLeft;
                    let parentOffsettop = parent.offsetTop;
                    let left = dragView.offsetLeft - parentOffsetx;
                    let top = dragView.offsetTop - parentOffsettop;
                    left -= change / 2;
                    top -= change / 2;
                    dragView.style.left = `${left}px`;
                    dragView.style.top = `${top}px`;
                };
            }
        },
        clickSetting() {
            pHelper_1.pHelper.openSettingView();
        },
        checkSaveTree() {
            ProjectManager_1.ProjectManager.getInstance().saveActiveTree();
        },
        activeEditorTree(uuid) {
            let tree = null;
            if (uuid)
                tree = ProjectManager_1.ProjectManager.getInstance().getTreeById(uuid);
            let childrens = this.$.TreeList.getElementsByTagName("ui-drag-item");
            for (let i = 0; i < childrens.length; i++) {
                let curnode = childrens[i];
                curnode.className = "treenode";
            }
            if (tree) {
                tree.htmlNode.className = "treenode_check";
                ProjectManager_1.ProjectManager.getInstance().setActiveTree(tree);
                ProjectManager_1.ProjectManager.getInstance().setEditorNode(tree);
                this.updatePropertiesView();
                NodeGraphView_1.NodeGraphView.getInstance().setTree(tree);
                NodeGraphView_1.NodeGraphView.getInstance().setClickNodeCallback((uuid) => {
                    if (uuid == tree.id) {
                        ProjectManager_1.ProjectManager.getInstance().setEditorNode(tree);
                    }
                    else {
                        let node = tree.getNodeById(uuid);
                        ProjectManager_1.ProjectManager.getInstance().setEditorNode(node);
                    }
                    this.updatePropertiesView();
                });
            }
            else {
                ProjectManager_1.ProjectManager.getInstance().setActiveTree(null);
                ProjectManager_1.ProjectManager.getInstance().setEditorNode(null);
                this.updatePropertiesView();
                NodeGraphView_1.NodeGraphView.getInstance().setTree(null);
            }
        },
        selectTreeNode(ev) {
            let node = ev.target;
            let uuid = node.getAttribute("uuid");
            this.activeEditorTree(uuid);
        },
        getPropertyItem(property, needDelete, type, data = null, keyEdit = true) {
            let node = document.createElement("div");
            node.className = "property_item";
            let nodekey = null;
            nodekey = document.createElement("ui-input");
            nodekey.classList.add("propkey");
            nodekey.setAttribute("placeholder", "key");
            if (data)
                pHelper_1.pHelper.setNodeValue(nodekey, data.key);
            if (!keyEdit)
                nodekey.setAttribute("disabled", "");
            let nodevalue = null;
            if (type == "boolean") {
                nodevalue = document.createElement("ui-checkbox");
                nodevalue.classList.add("propvalue");
            }
            else if (type == "number") {
                nodevalue = document.createElement("ui-num-input");
                nodevalue.classList.add("propvalue");
                if (data.propertyItem && data.propertyItem.config) {
                    let config = data.propertyItem.config;
                    if (config.step) {
                        nodevalue.setAttribute("step", config.step.toString());
                    }
                    if (config.preci) {
                        nodevalue.setAttribute("preci", config.preci.toString());
                    }
                    if (config.min) {
                        nodevalue.setAttribute("min", config.min.toString());
                    }
                    if (config.max) {
                        nodevalue.setAttribute("max", config.max.toString());
                    }
                }
            }
            else {
                nodevalue = document.createElement("ui-input");
                nodevalue.classList.add("propvalue");
                nodevalue.setAttribute("placeholder", "value");
            }
            node.appendChild(nodekey);
            node.appendChild(nodevalue);
            let lastKey = data == null ? "" : data.key;
            let lastValue = data == null ? "" : data.value;
            if (needDelete) {
                let nodedelete = document.createElement("ui-button");
                nodedelete.classList.add("propDel");
                nodedelete.textContent = "-";
                nodedelete.onclick = () => {
                    delete property[lastKey];
                    node.remove();
                };
                node.appendChild(nodedelete);
            }
            if (data != null) {
                pHelper_1.pHelper.setNodeValue(nodevalue, data.value);
            }
            if (keyEdit) {
                pHelper_1.pHelper.bindNodeValueChange(nodekey, (value) => {
                    delete property[lastKey];
                    property[value] = lastValue;
                    lastKey = value;
                });
            }
            pHelper_1.pHelper.bindNodeValueChange(nodevalue, (value) => {
                if (type == "number") {
                    value = parseFloat(value);
                }
                property[lastKey] = value;
                lastValue = value;
            });
            return node;
        },
        updatePropertiesView() {
            let node = ProjectManager_1.ProjectManager.getInstance().getEditorNode();
            let view = this.$.propertiesView;
            if (node instanceof b3Tree_1.b3Tree) {
                let tree = node;
                view.innerHTML = (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/main/properties.html'), 'utf-8');
                pHelper_1.pHelper.bindNodeValue(view.querySelector(".editorTitle"), tree, "title", (newvalue, oldvalue) => {
                    newvalue = newvalue.trim();
                    if (newvalue == "") {
                        newvalue = oldvalue;
                        return oldvalue;
                    }
                    tree.htmlNode.textContent = newvalue;
                });
                pHelper_1.pHelper.bindNodeValue(view.querySelector(".editorDescription"), tree, "description");
                pHelper_1.pHelper.setNodeValue(view.querySelector(".propName"), "Tree");
                let divAdd = view.querySelector("#propAdd");
                let divType = divAdd.querySelector(".dropdown-content");
                let typeList = ["string", "boolean", "number"];
                let divproperties = view.querySelector(".properties");
                for (let i = 0; i < typeList.length; i++) {
                    let item = typeList[i];
                    let a = document.createElement("a");
                    a.setAttribute("href", "#");
                    a.textContent = item;
                    divType.appendChild(a);
                    a.onclick = () => {
                        console.log("aaa");
                        divproperties.appendChild(this.getPropertyItem(tree.properties, true, item));
                    };
                }
                for (let key in tree.properties) {
                    let value = tree.properties[key];
                    let data = { key: key, value: value };
                    divproperties.appendChild(this.getPropertyItem(tree.properties, true, typeof (value), data));
                }
            }
            else if (node instanceof b3Node_1.b3Node) {
                let curnode = node;
                view.innerHTML = (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/main/properties.html'), 'utf-8');
                pHelper_1.pHelper.setNodeValue(view.querySelector(".propName"), curnode.name);
                pHelper_1.pHelper.bindNodeValue(view.querySelector(".editorTitle"), curnode, "title", (newvalue, oldvalue) => {
                    NodeGraphView_1.NodeGraphView.getInstance().updateNodeText(curnode.id, newvalue);
                    return newvalue;
                });
                pHelper_1.pHelper.bindNodeValue(view.querySelector(".editorDescription"), curnode, "description");
                let divproperties = view.querySelector(".properties");
                let btnAdd = view.querySelector("#propAdd");
                btnAdd.remove();
                for (let key in curnode.properties) {
                    let propertyItem = curnode.getPropertyItem(key);
                    let data = { key: key, value: curnode.properties[key], propertyItem: propertyItem };
                    divproperties.appendChild(this.getPropertyItem(curnode.properties, false, propertyItem.type, data, false));
                }
            }
            else {
                view.innerHTML = (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/main/empty_properties.html'), 'utf-8');
            }
        },
        clickNewTree() {
            let tree = ProjectManager_1.ProjectManager.getInstance().createNewTree();
            this.addTreeNode(tree);
        },
        updateNodeView() {
            NodeGraphView_1.NodeGraphView.getInstance().updateRender();
        },
        initViewSize() {
            let content = this.$.center_content;
            let leftList = this.$.left_list;
            let rightInfo = this.$.right_info;
            let app = this.$.app;
            let totalWidth = window.innerWidth;
            let totalHeight = window.innerHeight;
            window.onresize = (ev) => {
                totalWidth = window.innerWidth;
                totalHeight = window.innerHeight;
                let contentWidth = totalWidth - INIT_LEFT_WIDTH - INIT_RIGHT_WIDTH - 2 * CONTENT_PADDING - 2;
                content.style.width = `${contentWidth}px`;
                content.style.height = `${totalHeight}px`;
                NodeGraphView_1.NodeGraphView.getInstance().updateViewSize(contentWidth, totalHeight);
            };
            leftList.style.width = `${INIT_LEFT_WIDTH}px`;
            content.style.width = `${totalWidth - INIT_LEFT_WIDTH - INIT_RIGHT_WIDTH - 2 * CONTENT_PADDING - 2}px`;
            content.style.height = `${totalHeight}px`;
            rightInfo.style.width = `${INIT_RIGHT_WIDTH}px`;
        },
    },
    async ready() {
        await ProjectManager_1.ProjectManager.getInstance().init();
        this.initListNode();
        this.initGlobalFunc();
        this.initViewSize();
        // this.initResize();
        // this.initScaleContent();
        NodeGraphView_1.NodeGraphView.getInstance().setView(this.$.graph_view);
        this.updateNodeView();
        let tree = ProjectManager_1.ProjectManager.getInstance().checkGetLastEditorTree();
        if (tree)
            this.activeEditorTree(tree.id);
    },
    async beforeClose() {
        let isHaveNotSave = ProjectManager_1.ProjectManager.getInstance().checkSaveTree();
        if (isHaveNotSave) {
            let ret = await Editor.Dialog.warn("还有未保存的Tree,是否关闭", {
                buttons: ["Yes", "Cancel"]
            });
            if (ret.response == 0) {
                return true;
            }
            return false;
        }
        return true;
    },
    close() { },
});
