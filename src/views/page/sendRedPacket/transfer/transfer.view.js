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
            ok: {
                disabled: !logic.verifyForm(),
                onclick() {
                    logic.onOk();
                }
            },
            // 取消按钮事件
            cancel: {
                onclick() {
                    logic.onClose();
                }
            },
            slot: {
                header: "资金划转",
                body: [
                    // 下拉钱包
                    m('div', { class: `is-between is-align-center` }, [
                        m(Dropdown, logic.fromDropdown),
                        m('i', { class: `iconfont icon-arrow-right mx-2 iconfont-min` }),
                        m(Dropdown, logic.toDropdown)
                    ]),
                    m('div', { class: `mt-5 font-weight-bold body-6 mb-2` }, ["划转数量"]),
                    // 数量input
                    m('div', { class: `columns is-mobile is-align-center has-border-bottom-1 has-line-level-4 mb-2` }, [
                        m('input', {
                            class: `input column is-8 has-border-none`,
                            placeholder: "请输入划转数量",
                            value: logic.transferMoney,
                            oninput(e) {
                                logic.transferMoney = e.target.value;
                            }
                        }),
                        m('span', { class: `column is-4 has-text-right` }, [
                            m('span', { class: `` }, logic.coin), // 币种
                            m('span', { class: `px-2` }, "|"),
                            m('span', { class: `has-text-primary`, onclick() { logic.transferMoney = logic.usableMoney; } }, "全部")
                        ])
                    ]),
                    // 可用
                    m('div', { class: `is-between` }, [
                        m('span', { class: `` }, "可用"),
                        m('span', { class: `` }, `${logic.usableMoney} ${logic.coin}`)
                    ])
                ]
            }
        });
    }
};