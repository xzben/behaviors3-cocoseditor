"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: xzben
 * @Date: 2022-06-02 10:35:29
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-09 14:21:14
 * @Description: file content
 */
const b3BaseGraph_1 = require("./b3BaseGraph");
const core_1 = require("@logicflow/core");
class ActionGraphModel extends b3BaseGraph_1.b3BaseGraphModel {
    getDefaultAnchor() {
        let anchor = [];
        anchor.push(this.getLeftAnchorPoint());
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
        this.radius = 10;
    }
}
class ActionGraphView extends b3BaseGraph_1.b3BaseGraphNode {
    getShape() {
        return (0, core_1.h)("g", {}, [
            this.getLeftAnchorShap(),
            this.getRectShap(),
        ]);
    }
}
exports.default = {
    type: "action",
    view: ActionGraphView,
    model: ActionGraphModel
};
