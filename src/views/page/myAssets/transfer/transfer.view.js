var m = require("mithril");
require('./transfer.scss');
// const I18n = require('@/languages/I18n').default;
// const Modal = require('@/views/components/common/Modal');
const Dropdown = require('@/views/components/common/Dropdown');
const Modal = require('@/views/components/common/Modal');

const model = require('./transfer.logic.js');

module.exports = {
    oninit: vnode => model.oninit(vnode),
    oncreate: vnode => model.oncreate(vnode),
    onremove: vnode => model.onremove(vnode),
    onupdate: vnode => model.onupdate(vnode),
    view (vnode) {
        // 资金划转 内容
        const body = m('div', { class: `my-form my-transfer` }, [
            // 币种 (下拉)
            m('div', { class: `form-item` }, [
                m('div', { class: `form-item-title` }, ['币种']),
                m('div', { class: `form-item-content` }, [
                    m(Dropdown, model.getCurrencyMenuOption())
                ])
            ]),
            // 账户划转
            m('div', { class: `columns` }, [
                // 从 (下拉)
                m('div', { class: `form-item column is-5` }, [
                    m('div', { class: `form-item-title has-text-level-4` }, [
                        '从'
                    ]),
                    m('div', { class: `form-item-content` }, [
                        m(Dropdown, model.getFromMenuOption())
                    ])
                ]),
                // 切换
                m('div', { class: `column is-align-items-center` }, [
                    m('span', {
                        class: `has-text-level-4 cursor-pointer`,
                        onclick() {
                            model.handlerSwitchBtnClick();
                        }
                    }, "切换")
                ]),
                // 到 (下拉)
                m('div', { class: `form-item column is-5` }, [
                    m('div', { class: `form-item-title has-text-level-4` }, [
                        '到'
                    ]),
                    m('div', { class: `form-item-content` }, [
                        m(Dropdown, model.getToMenuOption())
                    ])
                ])
            ]),
            // 数量
            m('div', { class: `form-item` }, [
                m('div', { class: `form-item-title` }, [
                    '数量'
                ]),
                m('div', { class: `form-item-content form-item-content-btns` }, [
                    m('input', {
                        class: `input`,
                        placeholder: '请输入划转数量',
                        value: model.form.num,
                        oninput(e) {
                            model.handlerNumOnInput(e);
                        }
                    }),
                    m('div', { class: `btns-box pr-3` }, [
                        m('span', { class: `pr-2` }, 'BTC'),
                        m('span', {
                            class: `cursor-pointer has-text-primary`,
                            onclick() {
                                model.handlerSetAllNumClick();
                            }
                        }, '全部')
                    ])
                ]),
                m('div', { class: `has-text-level-4 pt-2` }, [
                    `可用: ${model.form.maxTransfer} ${model.form.coin}`
                ])
            ])
        ]);
        return [
            // 资金划转 弹框
            m(Modal, {
                isShow: vnode.attrs.isShow, // 弹框显示/隐藏
                // 弹框确认
                onOk() {
                    model.submit(); // 提交
                    vnode.attrs.setTransferModalOption({
                        isShow: false // 弹框隐藏
                    });
                },
                // 弹框关闭
                onClose () {
                    vnode.attrs.setTransferModalOption({
                        isShow: false // 弹框隐藏
                    }); // 弹框隐藏
                },
                // 插槽
                slot: {
                    header: "资金划转",
                    body
                }
            }),
            // 法币提示 弹框
            m(Modal, {
                isShow: model.showlegalTenderModal,
                onClose () {
                    model.showlegalTenderModal = false;
                }, // 关闭事件
                slot: {
                    header: m('div', { class: `` }, ["法币审核提示"]),
                    body: m('div', { class: `` }, [`为防止大额资金流动,您划转至法币账户的${model.form.num + model.form.coin}需进行人工审核,请耐心等候.`]),
                    footer: [
                        m('.spacer'),
                        m("button", {
                            class: "button is-primary font-size-2 has-text-white modal-default-btn button-large",
                            onclick () {
                                model.showlegalTenderModal = false;
                            }
                        }, [
                            "我知道了"
                        ])
                    ]
                }
            })
        ];
    }
};