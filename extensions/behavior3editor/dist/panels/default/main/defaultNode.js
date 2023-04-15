"use strict";
/*
 * @Author: xzben
 * @Date: 2022-05-31 10:16:06
 * @LastEditors: xzben
 * @LastEditTime: 2022-05-31 11:39:56
 * @Description: file content
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultNodeList = void 0;
exports.DefaultNodeList = {
    Composite: [
        { name: "Sequence", value: { cls: "Sequence", } },
        { name: "Priority", value: { cls: "Priority", } },
        { name: "MemSequence", value: { cls: "MemSequence", } },
        { name: "MemPriority", value: { cls: "MemPriority", } },
    ],
    Decorator: [
        { name: "Repeat @x", value: { cls: "MemPriority", } },
        { name: "Repeat Until Failure", value: { cls: "MemPriority", } },
        { name: "Repeat Until Success", value: { cls: "MemPriority", } },
        { name: "Max @ms", value: { cls: "MemPriority", } },
        { name: "Inverter", value: { cls: "MemPriority", } },
        { name: "Limit @ Activations", value: { cls: "MemPriority", } },
    ],
    Action: [
        { name: "Failer", value: { cls: "MemPriority", } },
        { name: "Succeeder", value: { cls: "MemPriority", } },
        { name: "Runner", value: { cls: "MemPriority", } },
        { name: "Error", value: { cls: "MemPriority", } },
        { name: "Wait @ms", value: { cls: "MemPriority", } },
    ],
    Condition: []
};
