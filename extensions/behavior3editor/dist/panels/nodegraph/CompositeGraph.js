"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: xzben
 * @Date: 2022-06-02 10:35:29
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-09 14:21:55
 * @Description: file content
 */
const core_1 = require("@logicflow/core");
const b3BaseGraph_1 = require("./b3BaseGraph");
class CompositeGraphModel extends b3BaseGraph_1.b3BaseGraphModel {
    getDefaultAnchor() {
        let anchor = [];
        anchor.push(this.getLeftAnchorPoint());
        anchor.push(this.getRightAnchorPoint());
        return anchor;
    }
    getTextStyle() {
        const style = super.getTextStyle();
        style.gap = 10;
        style.fontSize = 10;
        style.mini_width = 50;
        return style;
    }
    initNodeData(data) {
        super.initNodeData(data);
        this.height = 30;
        this.r = 25;
    }
}
class CompositeGraphView extends b3BaseGraph_1.b3BaseGraphNode {
    getShape() {
        return (0, core_1.h)("g", {}, [
            this.getLeftAnchorShap(),
            this.getRightAnchorShap(),
            this.getRectShap(),
        ]);
    }
}
exports.default = {
    type: "composite",
    view: CompositeGraphView,
    model: CompositeGraphModel
};
