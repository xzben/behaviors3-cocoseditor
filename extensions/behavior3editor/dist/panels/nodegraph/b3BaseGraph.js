"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.b3BaseGraphNode = exports.b3BaseGraphModel = exports.getSvgTextWidthHeight = exports.getBytesLength = void 0;
/*
 * @Author: xzben
 * @Date: 2022-06-02 10:35:29
 * @LastEditors: xzben
 * @LastEditTime: 2022-06-09 14:23:25
 * @Description: file content
 */
const core_1 = require("@logicflow/core");
const getBytesLength = (word) => {
    if (!word) {
        return 0;
    }
    let totalLength = 0;
    for (let i = 0; i < word.length; i++) {
        const c = word.charCodeAt(i);
        if ((word.match(/[A-Z]/))) {
            totalLength += 1.5;
        }
        else if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
            totalLength += 1;
        }
        else {
            totalLength += 2;
        }
    }
    return totalLength;
};
exports.getBytesLength = getBytesLength;
// 获取文案高度，自动换行，利用dom计算高度
const getSvgTextWidthHeight = (data) => {
    let longestBytes = 0;
    const { rows, rowsLength, fontSize } = data;
    rows && rows.forEach(item => {
        const rowByteLength = (0, exports.getBytesLength)(item);
        longestBytes = rowByteLength > longestBytes ? rowByteLength : longestBytes;
    });
    // 背景框宽度，最长一行字节数/2 * fontsize + 2
    // 背景框宽度， 行数 * fontsize + 2
    return {
        width: Math.ceil(longestBytes / 2) * fontSize + fontSize / 4,
        height: rowsLength * (fontSize + 2) + fontSize / 4,
    };
};
exports.getSvgTextWidthHeight = getSvgTextWidthHeight;
class b3BaseGraphModel extends core_1.BaseNodeModel {
    getNodeWidth() {
        const rows = String(this.text.value).split(/[\r\n]/g);
        const textstyle = this.getTextStyle();
        const fontSize = textstyle.fontSize;
        const gap = textstyle.gap;
        const mini_width = textstyle.mini_width;
        const { width } = (0, exports.getSvgTextWidthHeight)({
            rows,
            fontSize,
            rowsLength: rows.length,
        });
        let get_width = width + 2 * gap;
        return get_width < mini_width ? mini_width : get_width;
    }
    updateText(value) {
        super.updateText(value);
        this.width = this.getNodeWidth();
    }
    getLeftAnchorPoint() {
        const { x, y, id, width, height } = this;
        return { x: x - width / 2, y: y, type: "left", id: `${id}_left` };
    }
    getRightAnchorPoint() {
        const { x, y, id, width, height } = this;
        return { x: x + width / 2, y: y, type: "right", id: `${id}_right` };
    }
    getAnchorLineStyle() {
        const style = super.getAnchorLineStyle();
        style.stroke = "orange";
        style.strokeWidth = 2;
        return style;
    }
    getNodeStyle() {
        const style = super.getNodeStyle();
        style.r = 10;
        style.stroke = "blue";
        style.fill = "white";
        style.strokeWidth = 1;
        return style;
    }
    initNodeData(data) {
        super.initNodeData(data);
        this.width = this.getNodeWidth();
        this.height = 80;
        this.radius = 10;
        this.text.draggable = false;
        this.text.editable = false;
        const edgeRule = {
            message: "节点顶部锚点只能和底部锚点连接",
            validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
                console.log("sourceNode:", sourceNode, "targetNode:", targetNode, "sourceAnchor:", sourceAnchor, "targetAnchor:", targetAnchor);
                console.log("targetAnchor", targetNode.incoming);
                //根节点只能指向一个节点
                if (sourceNode.type == "root" && sourceNode.outgoing.nodes.length > 0) {
                    return false;
                }
                //每个目标节点只能被一个父节点指向
                if (targetNode.incoming.nodes.length > 0) {
                    return false;
                }
                // 只能由父节点的 bottom 锚点指向子节点的 top 锚点
                if (sourceAnchor.type == "right" && targetAnchor.type == "left") {
                    return true;
                }
                return false;
            }
        };
        this.sourceRules.push(edgeRule);
    }
    getTextStyle() {
        const style = super.getTextStyle();
        style.gap = 10;
        style.fontSize = 10;
        style.mini_width = 100;
        return style;
    }
}
exports.b3BaseGraphModel = b3BaseGraphModel;
class b3BaseGraphNode extends core_1.BaseNode {
    getLabelShap() {
        const { model } = this.props;
        const { x, y, width, height } = model;
        const style = model.getNodeStyle();
        return (0, core_1.h)("svg", {
            x: x - width / 2 + 5,
            y: y - height / 2 + 5,
            width: 25,
            height: 25,
            viewBox: "0 0 1274 1024"
        }, (0, core_1.h)("path", {
            fill: style.stroke,
            d: "M655.807326 287.35973m-223.989415 0a218.879 218.879 0 1 0 447.978829 0 218.879 218.879 0 1 0-447.978829 0ZM1039.955839 895.482975c-0.490184-212.177424-172.287821-384.030443-384.148513-384.030443-211.862739 0-383.660376 171.85302-384.15056 384.030443L1039.955839 895.482975z"
        }));
    }
    getLeftAnchorShap() {
        const { model } = this.props;
        const { x, y, width, height } = model;
        const style = model.getNodeStyle();
        return (0, core_1.h)("circle", {
            cx: x - width / 2,
            cy: y,
            r: 5,
            fill: "white",
            stroke: "blue",
            strokeWidth: 1,
        });
    }
    getRightAnchorShap() {
        const { model } = this.props;
        const { x, y, width, height } = model;
        const style = model.getNodeStyle();
        return (0, core_1.h)("circle", {
            cx: x + width / 2,
            cy: y,
            r: 5,
            fill: "white",
            stroke: "blue",
            strokeWidth: 1,
        });
    }
    getRectShap() {
        const { model } = this.props;
        const { x, y, width, height, radius } = model;
        const style = model.getNodeStyle();
        return (0, core_1.h)("rect", Object.assign(Object.assign({}, style), { x: x - width / 2, y: y - height / 2, rx: radius, ry: radius, width,
            height }));
    }
    getShape() {
        return (0, core_1.h)("g", {}, [
            this.getRectShap(),
        ]);
    }
}
exports.b3BaseGraphNode = b3BaseGraphNode;
