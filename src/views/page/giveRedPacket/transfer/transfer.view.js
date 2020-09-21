var m = require("mithril");
require('./transfer.scss');
const Modal = require('@/views/components/common/Modal/Modal.view');
const Dropdown = require('@/views/components/common/Dropdown/Dropdown.view');

const logic = require('./transfer.logic.js');

module.exports = {
    view (vnode) {
        return m(Modal, {
            class: "pub-transfer",
            isShow: logic.isShow,
            updateOption(type) {
                logic.updateOption(type);
            },
            // 确认按钮事件
            onOk() {
                logic.onOk();
            },
            // 取消按钮事件
            onClose() {
                logic.onClose();
            },
            slot: {
                header: "资金划转",
                body: [
                    // 下拉钱包
                    m('div', { class: `is-between is-align-center` }, [
                        m(Dropdown, logic.fromDropdown),
                        // m('div', { class: `mx-2` }, [">"]),
                        m('i', { class: `iconfont icon-arrow-right mx-2` }),
                        m(Dropdown, logic.toDropdown)
                    ]),
                    m('div', { class: `mt-5 font-weight-bold body-6 mb-2` }, ["划转数量"]),
                    // 数量input
                    m('div', { class: `pub-transfer-num columns is-mobile is-align-center has-line-level-4 mb-2` }, [
                        m('input', {
                            class: `input column is-6 border-none`,
                            placeholder: "请输入划转数量"
                        }),
                        m('span', { class: `column is-6 has-text-right` }, [
                            m('span', { class: `` }, "USDT"),
                            m('span', { class: `px-2` }, "|"),
                            m('span', { class: `has-text-primary` }, "全部")
                        ])
                    ]),
                    // 可用
                    m('div', { class: `is-between` }, [
                        m('span', { class: `` }, "可用"),
                        m('span', { class: `` }, "1000.0000 USDT")
                    ])
                ]
            }
        });
    }
};
