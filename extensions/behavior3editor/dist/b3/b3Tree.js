"use strict";
/*
 * @Author: xzben
 * @Date: 2022-05-31 20:20:38
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-10 17:41:14
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
exports.b3Tree = void 0;
const fs = __importStar(require("fs"));
const b3Node_1 = require("./b3Node");
const b3Config_1 = require("./b3Config");
const ProjectManager_1 = require("../project/ProjectManager");
class b3Tree {
    constructor(title, uuid = undefined) {
        this.filepath = null;
        this.root = null;
        this.version = "0.3.0";
        this.nodes = new Map();
        this.description = "";
        this.properties = {};
        this.display = { x: 100, y: 100 };
        this.name = "tree";
        this.title = title;
        if (uuid == null) {
            uuid = (0, b3Config_1.b3GetNodeUUID)();
        }
        else {
            (0, b3Config_1.b3InsertNodeUUID)(uuid);
        }
        this.id = uuid;
    }
    static createbyJsonFile(file) {
        let content = JSON.parse(fs.readFileSync(file).toString());
        if (!(content["scope"] && content["scope"] == "tree" && typeof (content["nodes"]) == "object" && content["title"] && content["id"])) {
            console.error("load json tree failed", content["scope"], typeof (content["nodes"]));
            return null;
        }
        let uuid = content["id"];
        let newtree = new b3Tree(content["title"], uuid);
        let rootid = content["root"];
        let allnodes = new Map();
        let nodesdata = content["nodes"];
        let treeRoot = (content["treeRoot"] || {});
        for (let key in nodesdata) {
            let info = nodesdata[key];
            let node = b3Node_1.b3Node.createByJsonData(info);
            allnodes.set(node.id, node);
        }
        for (let key in nodesdata) {
            let info = nodesdata[key];
            let id = info.id;
            let node = allnodes.get(id);
            let childrens = info.children || [];
            childrens.forEach((chid) => {
                let childnode = allnodes.get(chid);
                node.addChild(childnode);
            });
        }
        for (let key in nodesdata) {
            let info = nodesdata[key];
            let id = info.id;
            let node = allnodes.get(id);
            if (treeRoot[id] != null) {
                let parent = node.parent;
                allnodes.delete(id);
                let treenode = b3Node_1.b3Node.createTreeNodeTemp(treeRoot[id]);
                treenode.subTree = treeRoot[id].treeId;
                if (rootid == id) {
                    rootid = treenode.id;
                }
                allnodes.set(treenode.id, treenode);
                if (parent) {
                    for (let i = parent.childrens.length - 1; i >= 0; i--) {
                        let ch = parent.childrens[i];
                        if (ch.id == id) {
                            parent.childrens[i] = treenode;
                        }
                    }
                }
                let allchildid = [];
                node.getAllChildId(allchildid);
                allchildid.forEach((uuid) => {
                    allnodes.delete(uuid);
                });
            }
        }
        allnodes.forEach((node) => {
            newtree.addNode(node);
        });
        let display = content["display"];
        if (display) {
            newtree.display = display;
        }
        newtree.root = allnodes.get(rootid);
        newtree.properties = content["properties"];
        newtree.filepath = file;
        return newtree;
    }
    async save(storepath) {
        if (this.filepath == "" || this.filepath == null) {
            let ret = await Editor.Dialog.save({
                path: `${storepath}/${this.title}.json`,
                filters: [{
                        name: "Json", extensions: ['json']
                    }]
            });
            if (!ret.canceled && ret.filePath) {
                this.filepath = ret.filePath;
                fs.writeFileSync(this.filepath, this.getSaveJsonData());
            }
        }
        else {
            fs.writeFileSync(this.filepath, this.getSaveJsonData());
        }
    }
    getValidNodes(nodes) {
        this.nodes.forEach((node) => {
            nodes.set(node.id, node);
            if (node.subTree) {
                let tree = ProjectManager_1.ProjectManager.getInstance().getTreeById(node.subTree);
                if (tree)
                    tree.getValidNodes(nodes);
            }
        });
    }
    getSaveJsonData() {
        let data = {
            version: this.version,
            scope: "tree",
            id: this.id,
            title: this.title,
            root: this.root ? this.root.id : "",
            properties: this.properties || {},
            nodes: {},
            display: this.display,
            description: this.description,
            treeRoot: {},
        };
        let nodes = new Map();
        this.getValidNodes(nodes);
        if (this.root && this.root.subTree != null) {
            let subtree = ProjectManager_1.ProjectManager.getInstance().getTreeById(this.root.subTree);
            if (subtree && subtree.root) {
                data.root = subtree.root.id;
                let treedata = {
                    name: this.root.name,
                    title: this.root.title,
                    description: this.root.description,
                    properties: this.root.properties,
                    display: this.root.display,
                    treeId: subtree.id,
                };
                data.treeRoot[subtree.root.id] = treedata;
            }
            else
                data.root = "";
        }
        nodes.forEach((node) => {
            if (node.subTree == null) {
                let nodedata = node.getSaveData();
                let children = nodedata.children;
                for (let i = children.length - 1; i >= 0; i--) {
                    let chid = children[i];
                    let chnode = nodes.get(chid);
                    if (chnode.subTree != null) {
                        let subtree = ProjectManager_1.ProjectManager.getInstance().getTreeById(chnode.subTree);
                        if (subtree && subtree.root) {
                            let rootnode = subtree.root;
                            children[i] = rootnode.id;
                            let treedata = {
                                name: chnode.name,
                                title: chnode.title,
                                description: chnode.description,
                                properties: chnode.properties,
                                display: chnode.display,
                                treeId: subtree.id,
                            };
                            data.treeRoot[rootnode.id] = treedata;
                        }
                        else {
                            children.splice(i, 1);
                        }
                    }
                }
                data.nodes[node.id] = nodedata;
            }
        });
        console.log("get SaveJson data", this, data);
        return JSON.stringify(data, null, 4);
    }
    addNode(node) {
        this.nodes.set(node.id, node);
        node.tree = this;
    }
    getNodeById(uuid) {
        return this.nodes.get(uuid);
    }
    deleteNodeById(uuid) {
        let node = this.nodes.get(uuid);
        if (node == null)
            return;
        if (node.parent) {
            node.parent.removeChild(node);
        }
        node.parent = null;
        this.nodes.delete(uuid);
    }
    updatePos(x, y) {
        this.display.x = x;
        this.display.y = y;
    }
    deleteFile() {
        if (this.filepath) {
            fs.unlinkSync(this.filepath);
        }
    }
}
exports.b3Tree = b3Tree;
