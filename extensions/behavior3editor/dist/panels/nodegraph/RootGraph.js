"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: xzben
 * @Date: 2022-06-02 10:35:29
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-09 14:22:29
 * @Description: file content
 */
const core_1 = require("@logicflow/core");
const b3BaseGraph_1 = require("./b3BaseGraph");
class RootGraphModel extends b3BaseGraph_1.b3BaseGraphModel {
    getDefaultAnchor() {
        let anchor = [];
        anchor.push(this.getRightAnchorPoint());
        return anchor;
    }
    initNodeData(data) {
        super.initNodeData(data);
        this.width = 30;
        this.height = 30;
        this.r = 15;
    }
}
class RootGraphView extends b3BaseGraph_1.b3BaseGraphNode {
    getCircleShap() {
        const { model, graphModel } = this.props;
        const { x, y, width, height, r } = model;
        const style = model.getNodeStyle();
        return (0, core_1.h)("circle", Object.assign(Object.assign({}, style), { cx: x, cy: y, r: r }));
    }
    getShape() {
        return (0, core_1.h)("g", {}, [
            this.getRightAnchorShap(),
            this.getCircleShap(),
        ]);
    }
}
exports.default = {
    type: "root",
    view: RootGraphView,
    model: RootGraphModel
};
