"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: xzben
 * @Date: 2022-06-07 14:55:28
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-07 17:38:13
 * @Description: file content
 */
const core_1 = require("@logicflow/core");
class ConnectEdgeModel extends core_1.LineEdgeModel {
    setAttributes() {
        this.offset = 20;
    }
    getEdgeStyle() {
        const style = super.getEdgeStyle();
        style.stroke = "orange";
        style.strokeWidth = 2;
        return style;
    }
}
exports.default = {
    type: "connect",
    view: core_1.LineEdge,
    model: ConnectEdgeModel
};
