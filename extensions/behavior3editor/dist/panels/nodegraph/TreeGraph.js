"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: xzben
 * @Date: 2022-06-02 10:35:29
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-10 16:41:11
 * @Description: file content
 */
const b3BaseGraph_1 = require("./b3BaseGraph");
const core_1 = require("@logicflow/core");
class TreeGraphModel extends b3BaseGraph_1.b3BaseGraphModel {
    getDefaultAnchor() {
        let anchor = [];
        anchor.push(this.getLeftAnchorPoint());
        return anchor;
    }
    getTextStyle() {
        const style = super.getTextStyle();
        style.gap = 15;
        style.fontSize = 10;
        style.mini_width = 50;
        return style;
    }
    initNodeData(data) {
        super.initNodeData(data);
        this.height = 30;
    }
}
class TreeGraphView extends b3BaseGraph_1.b3BaseGraphNode {
    getPolygonShap() {
        const { model, graphModel } = this.props;
        const { x, y, width, height, r } = model;
        const style = model.getNodeStyle();
        let offset = 10;
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        return (0, core_1.h)("polygon", Object.assign(Object.assign({}, style), { x: x, y: y, points: `${x - halfWidth},${y} ${x - halfWidth + offset},${y - halfHeight} ${x + halfWidth - offset},${y - halfHeight} ${x + halfWidth},${y} ${x + halfWidth - offset},${y + halfHeight} ${x - halfWidth + offset},${y + halfHeight}` }));
    }
    getShape() {
        return (0, core_1.h)("g", {}, [
            this.getLeftAnchorShap(),
            this.getPolygonShap(),
        ]);
    }
}
exports.default = {
    type: "tree",
    view: TreeGraphView,
    model: TreeGraphModel
};
