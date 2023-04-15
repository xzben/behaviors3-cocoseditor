"use strict";
/*
 * @Author: xzben
 * @Date: 2022-05-31 20:20:31
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-10 16:45:11
 * @Description: file content
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.b3Node = void 0;
const ProjectManager_1 = require("../project/ProjectManager");
const b3Config_1 = require("./b3Config");
const b3Constants_1 = require("./b3Constants");
class b3Node {
    constructor(name, category, id) {
        this.childrens = [];
        this.define = null;
        this.display = { x: 0, y: 0 };
        this.description = "";
        this.tree = null;
        this.subTree = null;
        this.parent = null;
        this.name = name;
        this.define = ProjectManager_1.ProjectManager.getInstance().getNodeDefineByName(name);
        if (category == null) {
            category = this.define.category;
        }
        this.category = category;
        this.properties = {};
        console.log("Node", this.name, this.define);
        if (this.define && this.define.properties) {
            this.define.properties.forEach((item) => {
                this.properties[item.name] = item.default;
            });
        }
        if (id == null) {
            id = (0, b3Config_1.b3GetNodeUUID)();
        }
        else {
            (0, b3Config_1.b3InsertNodeUUID)(id);
        }
        this.id = id;
        this.title = name;
    }
    static createTreeNodeTemp(data) {
        let node = new b3Node(data.name, b3Constants_1.Category.Tree);
        node.title = data.title;
        node.description = data.description;
        node.properties = data.properties;
        node.display = data.display;
        return node;
    }
    static createTreeNode(tree) {
        let node = new b3Node(tree.name, b3Constants_1.Category.Tree);
        node.title = tree.title;
        node.description = tree.description;
        node.properties = tree.properties;
        node.subTree = tree.id;
        return node;
    }
    static createByJsonData(json) {
        let node = new b3Node(json.name, json.category, json.id);
        node.title = json.title || node.name;
        node.properties = json.properties || {};
        node.display = json.display || { x: 0, y: 0 };
        return node;
    }
    static createByName(name) {
        let node = new b3Node(name);
        return node;
    }
    getPropertyItem(key) {
        for (let i = 0; i < this.define.properties.length; i++) {
            if (this.define.properties[i].name == key) {
                return this.define.properties[i];
            }
        }
    }
    getAllChildId(childrenId) {
        this.childrens.forEach((node) => {
            childrenId.push(node.id);
            node.getAllChildId(childrenId);
        });
    }
    getSaveData() {
        let data = {
            id: this.id,
            name: this.name,
            title: this.title,
            properties: this.properties || {},
            display: this.display,
            description: this.description,
            children: [],
        };
        this.childrens.forEach((chid) => {
            data.children.push(chid.id);
        });
        return data;
    }
    addChild(child) {
        this.childrens.push(child);
        child.parent = this;
        this.sortChild();
    }
    removeChild(child) {
        let idx = this.childrens.indexOf(child);
        if (idx == -1)
            return;
        this.childrens.splice(idx, 1);
    }
    updatePos(x, y) {
        this.display.x = x;
        this.display.y = y;
        if (this.parent)
            this.parent.sortChild();
    }
    sortChild() {
        this.childrens.sort((a, b) => {
            return a.display.y - b.display.y;
        });
    }
}
exports.b3Node = b3Node;
