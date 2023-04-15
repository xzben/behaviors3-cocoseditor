"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
/*
 * @Author: xzben
 * @Date: 2022-05-31 20:49:00
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-10 16:52:23
 * @Description: file content
 */
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const b3Config_1 = require("../b3/b3Config");
const b3Tree_1 = require("../b3/b3Tree");
const b3Utill_1 = require("../utils/b3Utill");
const package_json_1 = __importDefault(require("../../package.json"));
let defaultStorePath = path.join(Editor.Project.path, "assets");
class ProjectManager {
    constructor() {
        this.m_inited = false;
        this.m_storePath = defaultStorePath;
        this.m_deleteTips = true;
        this.m_lastEditorTree = "";
        this.m_trees = [];
        this.m_configCagegotry2eNode = new Map();
        this.m_configName2Node = new Map();
        this.m_activeTree = null;
        this.m_editorNode = null;
    }
    static getInstance() {
        if (this.s_instance == null) {
            this.s_instance = new ProjectManager();
        }
        return this.s_instance;
    }
    static clearInstance() {
        this.s_instance = null;
    }
    get trees() {
        return this.m_trees;
    }
    get storepath() {
        return this.m_storePath;
    }
    get deleteTips() {
        return this.m_deleteTips;
    }
    setDeleteNodeTips(enable) {
        this.m_deleteTips = enable;
        this.saveSettingConfig();
    }
    setStorePath(path) {
        this.m_storePath = path;
        this.saveSettingConfig();
    }
    loadNodeDefineConfg() {
        let nodedefine = JSON.parse(fs.readFileSync(path.join(__dirname, "../../config/nodedefine.json")).toString());
        let customdefine = JSON.parse(fs.readFileSync(path.join(__dirname, "../../config/customndoe.json")).toString());
        let defaultNode = nodedefine;
        let customNode = customdefine;
        this.m_configCagegotry2eNode.clear();
        this.m_configName2Node.clear();
        for (let i = 0; i < defaultNode.length; i++) {
            let node = defaultNode[i];
            let category = node.category;
            let arr = this.m_configCagegotry2eNode.get(category);
            if (arr == null) {
                arr = new Array();
                this.m_configCagegotry2eNode.set(category, arr);
            }
            arr.push(node);
            this.m_configName2Node.set(node.name, node);
        }
        for (let i = 0; i < customNode.length; i++) {
            let node = customNode[i];
            let category = node.category;
            let arr = this.m_configCagegotry2eNode.get(category);
            if (arr == null) {
                arr = new Array();
                this.m_configCagegotry2eNode.set(category, arr);
            }
            arr.push(node);
            this.m_configName2Node.set(node.name, node);
        }
    }
    getNodeDefineByName(name) {
        return this.m_configName2Node.get(name);
    }
    getCategoryNodeDefineList(category) {
        let arr = this.m_configCagegotry2eNode.get(category) || [];
        return arr;
    }
    removeTreebyId(id) {
        for (let i = this.m_trees.length - 1; i >= 0; i--) {
            let tree = this.m_trees[i];
            if (tree.id == id) {
                this.m_trees.splice(i, 1);
                return tree;
            }
        }
    }
    addTree(tree) {
        this.m_trees.push(tree);
    }
    loadAllTree() {
        let files = b3Utill_1.b3Utils.getFilesFromDir(this.m_storePath, ".json");
        console.log("files", files);
        this.m_trees.length = 0;
        files.forEach((file) => {
            let tree = b3Tree_1.b3Tree.createbyJsonFile(file);
            if (tree)
                this.addTree(tree);
        });
    }
    async loadSettingConfig() {
        let content = await Editor.Profile.getConfig(package_json_1.default.name, "b3Setting", "local");
        if (content) {
            let data = JSON.parse(content);
            this.m_storePath = (data.storePath || defaultStorePath).replace("project://", Editor.Project.path);
            this.m_lastEditorTree = (data.lastTree);
            this.m_deleteTips = (data.deleteTips == null ? true : data.deleteTips);
        }
        console.log("load setting", content);
    }
    saveSettingConfig() {
        let data = {
            storePath: this.m_storePath.replace(Editor.Project.path, "project://"),
            lastTree: this.m_lastEditorTree,
            deleteTips: this.m_deleteTips,
        };
        Editor.Profile.setConfig(package_json_1.default.name, "b3Setting", JSON.stringify(data), "local");
        console.log("saveSetting", data);
    }
    createNewTree() {
        let tree = new b3Tree_1.b3Tree("new_behavior_tree");
        this.addTree(tree);
        return tree;
    }
    getTreeById(id) {
        for (let i = 0; i < this.m_trees.length; i++) {
            let tree = this.trees[i];
            if (tree.id == id) {
                return tree;
            }
        }
        return null;
    }
    getEditorNode() {
        return this.m_editorNode;
    }
    setEditorNode(node) {
        this.m_editorNode = node;
    }
    setActiveTree(tree) {
        this.m_activeTree = tree;
        this.m_lastEditorTree = tree ? tree.id : "";
        this.saveSettingConfig();
    }
    getActiveTree() {
        return this.m_activeTree;
    }
    saveActiveTree() {
        if (this.m_activeTree) {
            this.m_activeTree.save(this.m_storePath);
            return true;
        }
        return false;
    }
    checkSaveTree() {
        let isNotSaveTree = false;
        for (let i = 0; i < this.trees.length; i++) {
            let tree = this.trees[i];
            if (tree.filepath != null) {
                tree.save(this.m_storePath);
            }
            else {
                isNotSaveTree = true;
            }
        }
        return isNotSaveTree;
    }
    checkGetLastEditorTree() {
        if (this.m_lastEditorTree != null) {
            for (let i = 0; i < this.m_trees.length; i++) {
                if (this.m_trees[i].id == this.m_lastEditorTree) {
                    this.m_activeTree = this.trees[i];
                    break;
                }
            }
        }
        return this.m_activeTree;
    }
    async init() {
        if (this.m_inited)
            return;
        this.m_inited = true;
        await this.loadSettingConfig();
        (0, b3Config_1.b3ClearAllUUID)();
        this.loadNodeDefineConfg();
        this.loadAllTree();
    }
}
exports.ProjectManager = ProjectManager;
ProjectManager.s_instance = null;
