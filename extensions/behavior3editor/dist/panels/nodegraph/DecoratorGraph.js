"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: xzben
 * @Date: 2022-06-02 10:35:29
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-09 14:22:17
 * @Description: file content
 */
const core_1 = require("@logicflow/core");
const b3BaseGraph_1 = require("./b3BaseGraph");
class DecoratorGraphModel extends b3BaseGraph_1.b3BaseGraphModel {
    getDefaultAnchor() {
        const { x, y, id, width, height } = this;
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
class DecoratorGraphView extends b3BaseGraph_1.b3BaseGraphNode {
    getPolygonShap() {
        const { model, graphModel } = this.props;
        const { x, y, width, height, r } = model;
        const style = model.getNodeStyle();
        return (0, core_1.h)("polygon", Object.assign(Object.assign({}, style), { x: x, y: y, points: `${x - width / 2},${y}  ${x},${y - height / 2} ${x + width / 2},${y} ${x},${y + height / 2}` }));
    }
    getShape() {
        return (0, core_1.h)("g", {}, [
            this.getLeftAnchorShap(),
            this.getRightAnchorShap(),
            this.getPolygonShap(),
        ]);
    }
}
exports.default = {
    type: "decorator",
    view: DecoratorGraphView,
    model: DecoratorGraphModel
};
