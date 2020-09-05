var m = require("mithril");
require('./transfer.scss');
const I18n = require('@/languages/I18n').default;
// const Modal = require('@/views/components/common/Modal');
const Dropdown = require('@/views/components/common/Dropdown');
// const newDropdown = require('@/views/components/common/DropdownNew/Dropdown.view');
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
            // m('div', { class: `` }, "newDropdown"),
            // m(newDropdown),
            // 币种 (下拉)
            m('div', { class: `form-item` }, [
                m('div', { class: `form-item-title` }, [
                    I18n.$t('10063') // '币种'
                ]),
                m('div', { class: `form-item-content` }, [
                    m('div', { class: `my-dropdown dropdown ${model.showCurrencyMenu ? " is-active" : ''}` }, [
                        // btn
                        m('div', { class: "dropdown-trigger has-text-1" }, [
                            m('button', {
                                class: `button`,
                                onclick: (e) => {
                                    // 进入下一次事件队列，先让body事件关闭所有下拉，再开启自己
                                    const type = model.showCurrencyMenu;
                                    setTimeout(() => {
                                        model.showCurrencyMenu = !type;
                                    }, 0);
                                }
                            }, [
                                m('p', { class: `my-trigger-text` }, [
                                    m('span', { class: `mr-2` }, model.curItem.label),
                                    m('span', { class: `has-text-level-4` }, model.curItem.coinName)
                                ]), // btnText
                                m('i', { class: "my-trigger-icon iconfont icon-xiala has-text-primary" }) // icon
                            ])
                        ]),
                        // menu
                        m('div', { class: "dropdown-menu " }, [
                            m('div', { class: "dropdown-content", style: "max-height: 400px; overflow: auto;" },
                                model.canTransferCoin.map((item, index) => {
                                    return m('a', {
                                        class: `dropdown-item has-hover ${model.form.coin === item.id ? 'has-active' : ''}`,
                                        key: item.id + index,
                                        onclick () {
                                            model.form.coin = item.id; // 修改选中id
                                            model.curItem = item;
                                            model.setMaxTransfer(); // 设置 最大划转
                                            model.showCurrencyMenu = false; // 关闭菜单
                                        }
                                    }, [
                                        m('span', { class: `my-menu-label` }, [
                                            m('span', { class: `mr-2` }, item.label),
                                            m('span', { class: `has-text-level-4` }, item.coinName)
                                        ]),
                                        m('i', { class: `my-menu-icon iconfont icon-fabijiaoyiwancheng ${model.form.coin === item.id ? '' : 'is-hidden'}` }) // icon
                                    ]);
                                })
                            )
                        ])
                    ])
                ])
            ]),
            // 账户划转
            m('div', { class: `columns` }, [
                // 从 (下拉)
                m('div', { class: `form-item column is-5` }, [
                    m('div', { class: `form-item-title has-text-level-4` }, [
                        I18n.$t('10130') // '从'
                    ]),
                    m('div', { class: `form-item-content` }, [
                        m(Dropdown, model.getFromMenuOption())
                    ])
                ]),
                // 切换
                m('div', { class: `column is-align-items-center` }, [
                    m('i', {
                        class: `iconfont icon-Conversion has-text-level-4 cursor-pointer iconfont-large pt-2`,
                        onclick() {
                            model.handlerSwitchBtnClick();
                        }
                    })
                ]),
                // 到 (下拉)
                m('div', { class: `form-item column is-5` }, [
                    m('div', { class: `form-item-title has-text-level-4` }, [
                        I18n.$t('10131') // '到'
                    ]),
                    m('div', { class: `form-item-content` }, [
                        m(Dropdown, model.getToMenuOption())
                    ])
                ])
            ]),
            // 数量
            m('div', { class: `form-item` }, [
                m('div', { class: `form-item-title` }, [
                    I18n.$t('10089') // '数量'
                ]),
                m('div', { class: `form-item-content form-item-content-btns` }, [
                    m('input', {
                        class: `input`,
                        placeholder: I18n.$t('10408'), // '请输入划转数量',
                        value: model.form.num,
                        oninput(e) {
                            model.handlerNumOnInput(e);
                        }
                    }),
                    m('div', { class: `btns-box pr-3` }, [
                        m('span', { class: `pr-2` }, model.form.coin),
                        m('span', {
                            class: `cursor-pointer has-text-primary`,
                            onclick() {
                                model.handlerSetAllNumClick();
                            }
                        }, I18n.$t('10106') // '全部'
                        )
                    ])
                ]),
                m('div', { class: `has-text-level-4 pt-2` }, [
                    `${I18n.$t('10065' /** 可用 */)}: ${model.form.maxTransfer} ${model.form.coin}`
                ])
            ])
        ]);
        return [
            // 资金划转 弹框
            m(Modal, {
                isShow: model.isShowTransferModal, // 弹框显示/隐藏
                // 弹框确认
                onOk() {
                    model.submit(); // 提交
                },
                // 弹框关闭
                onClose () {
                    model.handlerCloseTransferModal();
                },
                // 插槽
                slot: {
                    header: I18n.$t('10059'), // "资金划转",
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
                    header: m('div', { class: `` }, [
                        I18n.$t('10132') // "法币审核提示"
                    ]),
                    body: m('div', { class: `` }, [
                        I18n.$t('10409', { value: model.form.num + model.form.coin }) // `为防止大额资金流动,您划转至法币账户的${model.form.num + model.form.coin}需进行人工审核,请耐心等候.`
                    ]),
                    footer: [
                        m('.spacer'),
                        m("button", {
                            class: "button is-primary font-size-2 has-text-white modal-default-btn button-large",
                            onclick () {
                                model.handlerLegalTenderModalClick();
                            }
                        }, [
                            I18n.$t('10134') // "我知道了"
                        ])
                    ]
                }
            })
        ];
    }
};