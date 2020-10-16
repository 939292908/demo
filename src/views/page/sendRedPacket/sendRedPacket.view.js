const m = require('mithril');
require('./sendRedPacket.scss');
const logic = require('./sendRedPacket.logic');
const Header = require('@/views/components/common/Header/Header.view');
const FormItem = require('@/views/components/common/FormItem/FormItem.view');
const Button = require('@/views/components/common/Button/Button.view');
const Modal = require('@/views/components/common/Modal/Modal.view');
const transfer = require('@/views/page/sendRedPacket/transfer/transfer.view');
const I18n = require('@/languages/I18n').default;

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-give-red-packet` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-content side-px` }, [
                // title
                m('div', { class: `views-give-red-packet-title pt-7 mb-0 columns is-mobile` }, [
                    m('div', { class: `column is-7` }, [
                        m('p', { class: `title-large has-text-primary mt-2` }, I18n.$t('20050')/* 分享红包 */),
                        m('p', { class: `mt-1 has-text-level-3` }, I18n.$t('20051')/* 红包资产可用来提现，交易 */)
                    ]),
                    // 图片
                    m('div', { class: `column is-5 has-text-right` }, [
                        m('iframe', { src: require("@/assets/img/people.svg").default, width: "106", height: "106" })
                    ])
                ]),
                // 币种
                m('div', { class: `px-3 has-border-bottom-1 py-3 has-line-level-4` }, [
                    m('span', { class: `body-3 mr-2 has-text-level-4 body-5` }, I18n.$t('20090')/* 币种 */),
                    m('span', { class: `title-small has-text-level-1` }, logic.currentCoin)
                ]),
                // 币种btnList 列表
                m('div', { class: `views-give-red-packet-btn-list mt-7` }, [
                    // logic.coinBtnList.map((item) => m('div', { class: `` }, [item.wType]))
                    logic.coinBtnList.map((btnOption) => m(Button, btnOption))
                ]),
                // 划转
                m('div', { class: `has-text-right mt-7 mb-2` }, [
                    m('span', { class: `has-text-level-4` }, `${I18n.$t('20091')/* 钱包可用 */}：${logic.wltMoney}${logic.currentCoin} `),
                    m('span', { class: `has-text-primary font-weight-bold`, onclick() { logic.transferBtnClick(); } }, ` ${I18n.$t('20092')/* 划转 */}`)
                ]),
                // 单个金额/总金额
                m(FormItem, {
                    label: logic.redPacketType > 0 ? I18n.$t('20093')/* 单个金额 */ : I18n.$t('20094')/* 总金额 */,
                    unit: logic.currentCoin,
                    placeholder: I18n.$t('20095')/* 输入红包金额 */,
                    type: 'number',
                    inputId: 'moneyFormItem',
                    value: logic.moneyFormItem.value,
                    onblur: value => {
                        const isPass = logic.formModel.verifyMoney(); // 校验金额
                        if (isPass) logic.formModel.verifyNumber(); // 校验个数
                    },
                    updateOption(params) {
                        logic.moneyFormItem.updateOption(params); // 更新数据
                        // const isPass = logic.formModel.verifyMoney(); // 校验金额
                        // if (isPass) logic.formModel.verifyNumber(); // 校验个数
                    }
                }),
                // 切换 普通/拼手气红包
                m('div', { class: `mt-2 mb-7 has-text-level-4` }, [
                    m('span', { class: `` }, [
                        // 英文不显示
                        vnode.state.getSendRedpacketText() + (I18n.$t('20097')/* 改为 */ + ' ')
                    ]),
                    m('span', { class: `has-text-primary font-weight-bold`, onclick() { logic.switchRedPacketType(); } }, [logic.redPacketType > 0 ? I18n.$t('20011'/* 拼手气红包 */) : I18n.$t('20010'/* 普通红包 */)])
                ]),
                // 红包个数
                m(FormItem, {
                    class: "mb-5",
                    label: I18n.$t('20098')/* 红包个数 */,
                    unit: I18n.$t('20104')/* 个 */,
                    placeholder: I18n.$t('20099')/* 输入红包个数 */,
                    inputId: 'numberFormItem',
                    value: logic.numberFormItem.value,
                    onblur: value => {
                        // const isPass = logic.formModel.verifyNumber(); // 校验个数
                        // if (isPass) logic.formModel.verifyMoney(); // 校验金额
                    },
                    updateOption: params => {
                        logic.numberFormItem.updateOption(params); // 更新数据
                        const isPass = logic.formModel.verifyNumber(); // 校验个数
                        if (isPass) logic.formModel.verifyMoney(); // 校验金额
                    }
                }),
                // 祝福信息
                m(FormItem, {
                    content: m('input', {
                        class: `input has-text-level-1 px-0`,
                        value: logic.infoFormItem.value,
                        placeholder: I18n.$t('20089')/* 大吉大利，全天盈利 */,
                        oninput(e) {
                            logic.infoFormItem.updateOption({ value: e.target.value });
                        }
                    })
                }),
                // // 表单错误提示
                // m('div', { class: `has-text-up has-text-centered mt-5` }, logic.formModel.errMsg),
                // 划转 Modal
                m(transfer),
                // 发红包输入密码 弹框
                m(Modal, {
                    isShow: logic.sendRedPModal.isShow,
                    class: "bottom-sheet",
                    updateOption(params) {
                        logic.sendRedPModal.updateOption(params);
                    },
                    slot: {
                        body: [
                            // 红包币种
                            m('div', { class: `columns is-mobile mb-3 mt-7` }, [
                                m('div', { class: `column is-4` }, I18n.$t('20100')/* 红包币种 */),
                                m('div', { class: `column is-8 font-weight-bold` }, logic.currentCoin)
                            ]),
                            // 红包类型
                            m('div', { class: `columns is-mobile mb-3` }, [
                                m('div', { class: `column is-4` }, I18n.$t('20101')/* 红包类型 */),
                                m('div', { class: `column is-8 font-weight-bold` }, logic.redPacketType > 0 ? I18n.$t('20010'/* 普通红包 */) : I18n.$t('20011'/* 拼手气红包 */))
                            ]),
                            // 红包金额
                            m('div', { class: `columns is-mobile mb-3` }, [
                                m('div', { class: `column is-4` }, I18n.$t('20102')/* 红包金额 */),
                                m('div', { class: `column is-8 font-weight-bold` }, (logic.moneyFormItem.value || "0") + " " + logic.currentCoin)
                            ]),
                            // 红包个数
                            m('div', { class: `columns is-mobile mb-3` }, [
                                m('div', { class: `column is-4` }, I18n.$t('20098')/* 红包个数 */),
                                m('div', { class: `column is-8 font-weight-bold` }, (logic.numberFormItem.value || "0") + ` ${I18n.$t('20104')/* 个 */}`)
                            ]),
                            // 资金密码 input
                            m('div', { class: `has-border-1 is-flex is-align-center has-line-level-4 px-3 mt-7` }, [
                                m('div', { class: `no-wrap` }, I18n.$t('20103')/* 资金密码 */),
                                m('input', {
                                    class: `input has-border-none`,
                                    type: logic.isShowPassWord ? "text" : "password",
                                    placeholder: I18n.$t('20105')/* 请输入资金密码 */,
                                    value: logic.passwordModel.value,
                                    oninput(e) {
                                        logic.passwordModel.updateValue(e.target.value); // 更新密码
                                    }
                                }),
                                m('i', {
                                    class: `iconfont ${logic.isShowPassWord ? 'icon-xianshimima' : 'icon-buxianshimima'}`,
                                    onclick() {
                                        logic.isShowPassWord = !logic.isShowPassWord;
                                    }
                                })
                            ])
                            // // 密码错误提示
                            // m('div', { class: `has-text-up mt-3` }, logic.passwordModel.errMsg)
                        ]
                    },
                    ok: {
                        loading: logic.shareLoading,
                        onclick() {
                            logic.sendRedPModal.onOk();
                        }
                    }
                }),
                // 取消分享红包 提示弹框
                m(Modal, {
                    isShow: logic.isShowNotShareModal,
                    updateOption(params) {
                        logic.isShowNotShareModal = params.isShow;
                    },
                    content: m('div', { class: `my-modal-content px-5 has-bg-level-2 has-text-centered` }, [
                        m('div', { class: `my-5 is-content-center` }, [
                            m('i', { class: `iconfont icon-about-us has-text-primary` })
                        ]),
                        m('div', { class: `title-small mb-3` }, I18n.$t('20106')/* 您还未分享红包 */),
                        m('div', { class: `mb-5` }, I18n.$t('20107')/* 退出后可在我的红包-已发送  中选中目标红包继续发送 */),
                        // 按钮
                        m('div', { class: `is-content-center is-align-center mb-7` }, [
                            m('div', {
                                class: `font-weight-bold mr-4 px-3 py-2`,
                                onclick() {
                                    logic.notShareModalCancel();
                                }
                            }, I18n.$t('10415')/* 知道了 */),
                            m(Button, {
                                class: 'is-primary',
                                size: "size-2",
                                label: I18n.$t('20108')/* 继续分享 */,
                                onclick() {
                                    logic.notShareModalToShareClick();
                                }
                            })
                        ])
                    ])
                }),
                // 发红包 必须的权限 弹框 (实名认证/资金密码)
                m(Modal, {
                    isShow: logic.isShowVerifyAuthModal,
                    updateOption(params) {
                        logic.isShowVerifyAuthModal = params.isShow;
                    },
                    content: m('div', { class: `my-modal-content px-5 has-bg-level-2 has-text-centered` }, [
                        m('div', { class: `my-5 is-content-center` }, [
                            m('i', { class: `iconfont icon-about-us has-text-primary` })
                        ]),
                        m('div', { class: `title-small mb-3` }, I18n.$t('20109')/* 需要完成以下设置 */),
                        // app和浏览器打开 内容不同
                        vnode.state.getShowVerifyAuthModalContent(),
                        m(Button, {
                            class: 'is-primary font-weight-bold my-5',
                            width: 1,
                            label: I18n.$t('10415')/* 知道了 */,
                            onclick() {
                                logic.verifyAuthModalOkBtnClick();
                            }
                        })
                    ])
                })
            ]),
            // 塞币进红包 btn
            m('div', { class: `pub-footer side-px` }, [
                // 显示总金额
                m('div', { class: `has-text-centered ${!logic.formModel.verifyAll(false) ? 'is-hidden' : ''}` }, [
                    m('p', { class: `title-medium has-text-level-1` }, `${I18n.$t('20008'/* 共 */)} ${logic.formModel.getTotalCoin()} ${logic.currentCoin}`),
                    m('p', { class: `has-text-level-3` }, ` ≈¥${logic.getRMBByCoinMoney()}`)
                ]),
                m(Button, {
                    label: I18n.$t('20115')/* 塞币进红包 */,
                    class: 'is-primary mt-3 mb-3',
                    width: 1,
                    disabled: !logic.formModel.verifyAll(false),
                    onclick() {
                        logic.coinToRedPacketBtnClick();
                    }
                })
            ])
        ]);
    },
    // 验证权限弹框内容
    getShowVerifyAuthModalContent() {
        if (window.plus) {
            // app中打开
            return m('', { class: `` }, [
                // 实名认证
                m('div', { class: `is-between mb-2` }, [
                    m('div', { class: `` }, I18n.$t('20110')/* 实名认证 */),
                    m('div', { class: `` }, [
                        logic.mustAuth.authentication ? m('span', { class: `` }, I18n.$t('20111')/* 已认证 */) : m('span', {
                            class: `has-text-primary`,
                            onclick() {
                                // alert("去认证");
                            }
                        }, I18n.$t('20112')/* 去认证 */)
                    ])
                ]),
                // 资金密码
                m('div', { class: `is-between` }, [
                    m('div', { class: `` }, I18n.$t('20103')/* 资金密码 */),
                    m('div', { class: `` }, [
                        logic.mustAuth.moneyPassword ? m('span', { class: `` }, I18n.$t('20113')/* 已设置 */) : m('span', {
                            class: `has-text-primary`,
                            onclick() {
                                // alert("去设置");
                            }
                        }, I18n.$t('20114')/* 去设置 */)
                    ])
                ])
            ]);
        } else {
            // 浏览器中打开
            const getText = () => {
                if (!logic.mustAuth.authentication && !logic.mustAuth.moneyPassword) {
                    return I18n.$t('20135')/* 请至个人中心完成身份验证并设置资金密码 */;
                }
                if (!logic.mustAuth.authentication) {
                    return I18n.$t('20136')/* 请至个人中心-身份验证处完成实名认证 */;
                }
                if (!logic.mustAuth.moneyPassword) {
                    return I18n.$t('20137')/* 请至个人中心-安全设置处设置资金密码 */;
                }
            };
            return m('div', { class: `` }, getText());
        }
    },
    // 切换 普通/拼手气红包
    getSendRedpacketText() {
        if (I18n.getLocale() !== 'en') {
            return I18n.$t('20096')/* 当前为 */ + (logic.redPacketType > 0 ? I18n.$t('20010'/* 普通红包 */) : I18n.$t('20011'/* 拼手气红包 */)) + '，';
        }
    }
};