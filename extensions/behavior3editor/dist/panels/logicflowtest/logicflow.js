"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: xzben
 * @Date: 2022-05-30 19:51:31
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-07 20:39:54
 * @Description: file content
 */
const core_1 = __importDefault(require("@logicflow/core"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const ProjectManager_1 = require("../../project/ProjectManager");
const ActionGraph_1 = __importDefault(require("../nodegraph/ActionGraph"));
const CompositeGraph_1 = __importDefault(require("../nodegraph/CompositeGraph"));
const ConditionGraph_1 = __importDefault(require("../nodegraph/ConditionGraph"));
const ConnectEdge_1 = __importDefault(require("../nodegraph/ConnectEdge"));
const DecoratorGraph_1 = __importDefault(require("../nodegraph/DecoratorGraph"));
const RootGraph_1 = __importDefault(require("../nodegraph/RootGraph"));
const TreeGraph_1 = __importDefault(require("../nodegraph/TreeGraph"));
const pHelper_1 = require("../pHelper");
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
let csssfiles = [
    (0, path_1.join)(__dirname, '../../../static/style/main/index.css'),
    (0, path_1.join)(__dirname, '../../../static/style/common/menu.css'),
    (0, path_1.join)(__dirname, '../../../static/style/main/left_list.css'),
    (0, path_1.join)(__dirname, '../../../static/style/main/right_info.css'),
    (0, path_1.join)(__dirname, '../../../static/style/logicflow/logicflow.css'),
    (0, path_1.join)(__dirname, '../../../static/style/logicflow/extension.css'),
    (0, path_1.join)(__dirname, '../../../static/style/logicflowtest/logicflowtest.css'),
];
let backgroundConfig = {
    backgroundColor: "#3d3838"
};
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/logicflowtest/logicflow.html'), 'utf-8'),
    style: pHelper_1.pHelper.getMutileCSS(csssfiles),
    $: {
        graph_view: "#graph_view",
    },
    methods: {
        initView() {
            let lf = new core_1.default({
                container: this.$.graph_view,
                grid: {
                    visible: true,
                    type: 'mesh',
                    config: {
                        color: "#ababab"
                    }
                },
                width: 800,
                height: 800,
                background: backgroundConfig,
                keyboard: {
                    enabled: true,
                    shortcuts: [
                        {
                            keys: ["backspace", "delete"],
                            callback: () => {
                                const elements = lf.getSelectElements(true);
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
                                    lf.clearSelectElements();
                                    elements.edges.forEach((edge) => lf.deleteEdge(edge.id));
                                    elements.nodes.forEach((node) => lf.deleteNode(node.id));
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
            lf.register(ConnectEdge_1.default);
            lf.register(ActionGraph_1.default);
            lf.register(CompositeGraph_1.default);
            lf.register(ConditionGraph_1.default);
            lf.register(DecoratorGraph_1.default);
            lf.register(TreeGraph_1.default);
            lf.register(RootGraph_1.default);
            lf.render({
                nodes: [
                    {
                        id: "node_id_1",
                        type: "root",
                        x: 100,
                        y: 100,
                        text: '节点1',
                        properties: {}
                    },
                    {
                        id: "node_id_2",
                        type: "action",
                        x: 200,
                        y: 300,
                        text: '节点2',
                        properties: {}
                    }
                ],
                edges: [
                    {
                        id: "edge_id",
                        type: "polyline",
                        sourceNodeId: "node_id_1",
                        targetNodeId: "node_id_2",
                        text: { x: 139, y: 200, value: "连线" },
                        startPoint: { x: 100, y: 140 },
                        endPoint: { x: 200, y: 250 },
                        pointsList: [{ x: 100, y: 140 }, { x: 100, y: 200 }, { x: 200, y: 200 }, { x: 200, y: 250 }],
                        properties: {}
                    }
                ]
            });
        }
    },
    async ready() {
        this.initView();
    },
    beforeClose() { },
    close() { },
});
