"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeGraphView = void 0;
/*
 * @Author: xzben
 * @Date: 2022-06-02 10:39:40
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-10 17:35:09
 * @Description: file content
 */
const TreeGraph_1 = __importDefault(require("./TreeGraph"));
const core_1 = __importDefault(require("@logicflow/core"));
const ActionGraph_1 = __importDefault(require("./ActionGraph"));
const CompositeGraph_1 = __importDefault(require("./CompositeGraph"));
const ConditionGraph_1 = __importDefault(require("./ConditionGraph"));
const DecoratorGraph_1 = __importDefault(require("./DecoratorGraph"));
const RootGraph_1 = __importDefault(require("./RootGraph"));
const ProjectManager_1 = require("../../project/ProjectManager");
const ConnectEdge_1 = __importDefault(require("./ConnectEdge"));
let backgroundConfig = {
    backgroundColor: "#3d3838"
};
class NodeGraphView {
    constructor() {
        this.m_graphview = null;
        this.m_logicflow = null;
        this.m_b3tree = null;
        this.m_clickNodeCallback = null;
    }
    static getInstance() {
        if (this.s_instance == null) {
            this.s_instance = new NodeGraphView();
        }
        return this.s_instance;
    }
    setClickNodeCallback(callback) {
        this.m_clickNodeCallback = callback;
    }
    getViewPos(clientx, clienty, selfPos = false) {
        let x = clientx;
        let y = clienty;
        if (!selfPos) {
            x -= this.m_graphview.parentElement.offsetLeft;
            y -= this.m_graphview.parentElement.offsetTop;
        }
        let info = this.m_logicflow.getTransform();
        x = (x - info.TRANSLATE_X) / info.SCALE_X;
        y = (y - info.TRANSLATE_Y) / info.SCALE_Y;
        return { x: x, y: y };
    }
    addEventListener(event, func) {
        this.m_logicflow.on(event, (info) => {
            func.call(this, info);
        });
    }
    updateViewSize(width, height) {
        this.m_logicflow.resize(width, height);
    }
    setView(node) {
        this.m_graphview = node;
        this.m_logicflow = new core_1.default({
            container: this.m_graphview,
            grid: {
                visible: true,
                type: 'mesh',
                config: {
                    color: "#ababab"
                }
            },
            background: backgroundConfig,
            keyboard: {
                enabled: true,
                shortcuts: [
                    {
                        keys: ["backspace", "delete"],
                        callback: () => {
                            const elements = this.m_logicflow.getSelectElements(true);
                            if (elements.nodes.length > 0) {
                                let haveroot = false;
                                for (let i = 0; i < elements.nodes.length; i++) {
                                    let node = elements.nodes[i];
                                    if (node.type == "root") {
                                        window.alert("Root 节点无法删除");
                                        haveroot = true;
                                        return;
                                    }
                                }
                            }
                            let result = true;
                            console.log("ProjectManager.getInstance().deleteTips", ProjectManager_1.ProjectManager.getInstance().deleteTips);
                            if (ProjectManager_1.ProjectManager.getInstance().deleteTips) {
                                result = window.confirm("确定要删除吗？");
                            }
                            if (result) {
                                console.log("delete", elements);
                                this.m_logicflow.clearSelectElements();
                                elements.edges.forEach((edge) => this.m_logicflow.deleteEdge(edge.id));
                                elements.nodes.forEach((node) => this.m_logicflow.deleteNode(node.id));
                            }
                        }
                    }
                ]
            },
            edgeType: "connect",
            stopScrollGraph: true,
            adjustNodePosition: true,
            adjustEdgeStartAndEnd: true,
            metaKeyMultipleSelected: true,
            stopMoveGraph: false,
            snapline: false, //对齐线
        });
        this.m_logicflow.register(ConnectEdge_1.default);
        this.m_logicflow.register(ActionGraph_1.default);
        this.m_logicflow.register(CompositeGraph_1.default);
        this.m_logicflow.register(ConditionGraph_1.default);
        this.m_logicflow.register(DecoratorGraph_1.default);
        this.m_logicflow.register(TreeGraph_1.default);
        this.m_logicflow.register(RootGraph_1.default);
        this.addEventListener("node:drop", this.handleNodeMove);
        this.addEventListener("node:delete", this.handleNodeDelete);
        this.addEventListener("edge:add", this.handleEdgeAdd);
        this.addEventListener("edge:delete", this.handleEdgeDelete);
        this.addEventListener("edge:exchange-node", this.handleEdgeChangeNode);
        this.addEventListener("node:click", this.handleNodeClick);
        this.addEventListener("node:drag", this.handleDraging);
        this.addEventListener("node:dragstart", this.handleDragStart);
        this.addEventListener("anchor:dragstart", this.handleAnchorDragStart);
        this.addEventListener("anchor:drop", this.handleAnchorDrop);
    }
    handleAnchorDragStart() {
        // this.m_logicflow.updateEditConfig({
        //     stopMoveGraph: false
        //   })
    }
    handleAnchorDrop() {
        // this.m_logicflow.updateEditConfig({
        //     stopMoveGraph: true
        //   })
    }
    handleDragStart(info) {
        // this.m_logicflow.updateEditConfig({
        //     stopMoveGraph: false
        //   })
    }
    handleDraging(info) {
        console.log("handleDraging", info);
    }
    handleNodeClick(info) {
        let uuid = info.data.id;
        console.log("handleNodeClick", info);
        if (this.m_clickNodeCallback)
            this.m_clickNodeCallback(uuid);
    }
    handleEdgeAdd(info) {
        let data = info.data;
        console.log("handleEdgeAdd", data);
        const { sourceNodeId, targetNodeId } = data;
        if (this.m_b3tree == null)
            return;
        let child = this.m_b3tree.getNodeById(targetNodeId);
        if (sourceNodeId == this.m_b3tree.id) {
            this.m_b3tree.root = child;
        }
        else {
            let parent = this.m_b3tree.getNodeById(sourceNodeId);
            parent === null || parent === void 0 ? void 0 : parent.addChild(child);
        }
    }
    handleEdgeDelete(info) {
        let data = info.data;
        console.log("handleEdgeDelete", data);
        const { sourceNodeId, targetNodeId } = data;
        if (this.m_b3tree == null)
            return;
        let child = this.m_b3tree.getNodeById(targetNodeId);
        if (sourceNodeId == this.m_b3tree.id) {
            this.m_b3tree.root = null;
        }
        else {
            let parent = this.m_b3tree.getNodeById(sourceNodeId);
            parent === null || parent === void 0 ? void 0 : parent.removeChild(child);
        }
    }
    handleEdgeChangeNode(info) {
        console.log("handleEdgeChangeNode", info.data);
    }
    handleNodeMove(info) {
        // console.log("node.drop", info.e.clientX, info.e.clientY, this.m_logicflow.getTransform());
        console.log("node.drop pos", info.data.x, info.data.y);
        // console.log("node.drop getViewPos", this.getViewPos(info.e.clientX, info.e.clientY, false));
        // console.log("node.drop  getPointByClient", this.m_logicflow.graphModel.getPointByClient({ x : info.e.clientX, y : info.e.clientY}))
        let data = info.data;
        let uuid = data.properties.uuid;
        if (this.m_b3tree) {
            if (uuid == this.m_b3tree.id) {
                this.m_b3tree.updatePos(data.x, data.y);
            }
            else {
                let b3Node = this.m_b3tree.getNodeById(uuid);
                b3Node === null || b3Node === void 0 ? void 0 : b3Node.updatePos(data.x, data.y);
            }
        }
    }
    handleNodeDelete(info) {
        console.log("handleNodeDelete", info.data);
        let uuid = info.data.properties.uuid;
        if (this.m_b3tree) {
            this.m_b3tree.deleteNodeById(uuid);
        }
    }
    getGraphNode() {
        let graphData = {};
        graphData.nodes = [];
        graphData.edges = [];
        if (this.m_b3tree == null)
            return graphData;
        graphData.nodes.push({
            id: this.m_b3tree.id,
            type: "root",
            text: "Root",
            x: this.m_b3tree.display.x,
            y: this.m_b3tree.display.y,
            properties: {
                uuid: this.m_b3tree.id,
                isTree: true,
            }
        });
        if (this.m_b3tree.root) {
            let root = this.m_b3tree.root;
            let tree = this.m_b3tree;
            graphData.edges.push({
                id: tree.id + "_" + root.id,
                type: "connect",
                sourceAnchorId: tree.id + "_right",
                targetAnchorId: root.id + "_left",
                sourceNodeId: tree.id,
                targetNodeId: root.id,
            });
        }
        this.m_b3tree.nodes.forEach((node, uuid) => {
            graphData.nodes.push({
                id: node.id,
                type: node.category,
                text: node.title,
                x: node.display.x,
                y: node.display.y,
                properties: {
                    uuid: uuid,
                    isTree: false,
                }
            });
            node.childrens.forEach((child) => {
                graphData.edges.push({
                    id: node.id + "_" + child.id,
                    type: "connect",
                    sourceAnchorId: node.id + "_right",
                    targetAnchorId: child.id + "_left",
                    sourceNodeId: node.id,
                    targetNodeId: child.id,
                });
            });
        });
        return graphData;
    }
    setTree(tree) {
        this.m_b3tree = tree;
        this.m_logicflow.resetTranslate();
        this.m_logicflow.resetZoom();
        this.m_logicflow.render(this.getGraphNode());
        if (tree) {
            this.m_logicflow.focusOn({
                id: tree.id
            });
        }
    }
    updateNodeText(uuid, title) {
        let node = this.m_logicflow.getNodeModelById(uuid);
        if (node) {
            node.updateText(title);
        }
    }
    updateRender() {
        let { nodes, edges } = this.getGraphNode();
        let graphmodel = this.m_logicflow.graphModel;
        let nodemap = graphmodel.nodesMap;
        let edgemap = graphmodel.edgesMap;
        nodes.forEach((node) => {
            if (nodemap[node.id] == null) {
                graphmodel.addNode(node);
            }
        });
        edges.forEach((edge) => {
            if (edgemap[edge.id] == null) {
                graphmodel.addEdge(edge);
            }
        });
    }
}
exports.NodeGraphView = NodeGraphView;
NodeGraphView.s_instance = null;
