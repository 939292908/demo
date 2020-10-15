var m = require("mithril");
require('./transfer.scss');
const Modal = require('@/views/components/common/Modal/Modal.view');
const Dropdown = require('@/views/components/common/Dropdown/Dropdown.view');
const I18n = require('@/languages/I18n').default;
const logic = require('@/views/page/sendRedPacket/transfer/transfer.logic');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    onremove: vnode => logic.onremove(vnode),
    view (vnode) {
        return m(Modal, {
            class: "pub-transfer bottom-sheet",
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
                header: I18n.$t('20078')/* 资金划转 */,
                body: [
                    // 下拉钱包
                    m('div', { class: `is-between is-align-center` }, [
                        m(Dropdown, logic.fromDropdown),
                        m('i', { class: `iconfont icon-arrow-right mx-2 iconfont-min has-text-level-4` }),
                        m(Dropdown, logic.toDropdown)
                    ]),
                    m('div', { class: `mt-5 font-weight-bold body-6 mb-2 has-text-level-1` }, [I18n.$t('20079')/* 划转数量 */]),
                    // 数量input
                    m('div', { class: `columns is-mobile is-align-center has-border-bottom-1 has-line-level-4 mb-2` }, [
                        m('input', {
                            class: `input column is-8 has-border-none`,
                            placeholder: I18n.$t('20080')/* 请输入划转数量 */,
                            value: logic.transferMoney,
                            oninput(e) {
                                logic.transferMoney = e.target.value;
                            }
                        }),
                        m('span', { class: `column is-4 has-text-right` }, [
                            m('span', { class: `has-text-level-3` }, logic.coin), // 币种
                            m('span', { class: `px-2 has-text-level-4` }, "|"),
                            m('span', { class: `has-text-primary`, onclick() { logic.transferMoney = logic.maxMoney; } }, I18n.$t('20081')/* 全部 */)
                        ])
                    ]),
                    // 可用
                    m('div', { class: `is-between has-text-level-1` }, [
                        m('span', { class: `` }, I18n.$t('20082')/* 可用 */),
                        m('span', { class: `` }, `${logic.maxMoney} ${logic.coin}`)
                    ])
                ]
            }
        });
    }
};
