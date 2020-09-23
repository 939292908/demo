const m = require('mithril');
require('./giveRedPacket.scss');
const logic = require('./giveRedPacket.logic');
const Header = require('@/views/components/common/Header/Header.view');
const FormItem = require('@/views/components/common/FormItem/FormItem.view');
const Button = require('@/views/components/common/Button/Button.view');
const Modal = require('@/views/components/common/Modal/Modal.view');
const transfer = require('@/views/page/giveRedPacket/transfer/transfer.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-give-red-packet px-6` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-layout` }, [
                // title
                m('div', { class: `views-give-red-packet-title pt-7 mb-0 columns is-mobile` }, [
                    m('div', { class: `column is-7` }, [
                        m('p', { class: `title-large has-text-primary mt-2` }, '分享红包'),
                        m('p', { class: `mt-1` }, '红包资产可用来提现，交易')
                    ]),
                    // 图片
                    m('div', { class: `column is-5 has-text-right` }, [
                        m('iframe', { src: require("@/assets/img/people.svg").default, width: "106", height: "106" })
                    ])
                ]),
                // 币种
                m('div', { class: `has-border-bottom-1 py-3 has-line-level-4` }, [
                    m('span', { class: `body-3 mr-2` }, '币种'),
                    m('span', { class: `title-small` }, logic.currentCoin)
                ]),
                // 币种btnList 列表
                m('div', { class: `views-give-red-packet-btn-list mt-7` }, [
                    logic.coinBtnList.map(btnOption => m(Button, btnOption))
                ]),
                // 划转
                m('div', { class: `has-text-right mt-7 mb-2` }, [
                    m('span', { class: `` }, `钱包可用：${logic.wltMoney}USDT `),
                    m('span', { class: `has-text-primary`, onclick() { logic.transferBtnClick(); } }, ' 划转')
                ]),
                // 单个金额/总金额
                m(FormItem, {
                    label: logic.redPacketType === 1 ? '单个金额' : '总金额',
                    unit: 'USDT',
                    placeholder: '输入红包金额',
                    type: 'number',
                    value: logic.moneyFormItem.value,
                    updateOption(params) {
                        logic.moneyFormItem.updateOption(params); // 更新数据
                        logic.formModel.verifyMoney(); // 校验表单
                    }
                }),
                // 切换 普通/拼手气红包
                m('div', { class: `mt-2 mb-7` }, [
                    m('span', { class: `` }, [`当前为${logic.redPacketType === 1 ? '普通红包' : '拼手气红包'}，改为 `]),
                    m('span', { class: `has-text-primary`, onclick() { logic.switchRedPacketType(); } }, [logic.redPacketType === 1 ? '拼手气红包' : '普通红包'])
                ]),
                // 红包个数
                m(FormItem, {
                    class: "mb-5",
                    label: '红包个数',
                    unit: '个',
                    placeholder: '输入红包个数',
                    type: 'number',
                    value: logic.numberFormItem.value,
                    updateOption: params => {
                        logic.numberFormItem.updateOption(params); // 更新数据
                        logic.formModel.verifyNumber(); // 校验表单
                    }
                }),
                // 祝福信息
                m(FormItem, {
                    content: m('input', {
                        class: `input`,
                        value: logic.infoFormItem.value,
                        placeholder: "请输入祝福语",
                        oninput(e) {
                            logic.infoFormItem.updateOption({ value: e.target.value });
                        }
                    })
                }),
                // 表单错误提示
                m('div', { class: `has-text-up has-text-centered mt-5` }, logic.formModel.errMsg),
                // 显示总金额
                m('div', { class: `has-text-centered mt-7 ${!logic.formModel.verifyFormData(false) ? 'is-hidden' : ''}` }, [
                    m('p', { class: `title-medium` }, `共 ${logic.formModel.getTotalCoin()} ${logic.currentCoin}`),
                    m('p', { class: `` }, ` ≈¥${logic.getRMBByCoinMoney()}`)
                ]),
                // 塞币进红包 btn
                m(Button, {
                    label: "塞币进红包",
                    class: 'pub-layout-bottom-btn is-primary mb-3',
                    width: 1,
                    disabled: !logic.formModel.verifyFormData(false),
                    onclick() {
                        // console.log(logic.formModel.getFormData(), 666);
                        logic.formModel.verifyFormData() && logic.giveRedPModal.updateOption({ isShow: true });
                    }
                }),
                // 划转 Modal
                m(transfer),
                // 发红包确认框
                m(Modal, {
                    isShow: logic.giveRedPModal.isShow,
                    updateOption(params) {
                        logic.giveRedPModal.updateOption(params);
                    },
                    ok: {
                        onclick() {
                            logic.giveRedPModal.onOk();
                        }
                    },
                    slot: {
                        body: [
                            // 红包币种
                            m('div', { class: `columns is-mobile mb-3 mt-7` }, [
                                m('div', { class: `column is-4` }, "红包币种"),
                                m('div', { class: `column is-8 font-weight-bold` }, logic.currentCoin)
                            ]),
                            // 红包类型
                            m('div', { class: `columns is-mobile mb-3` }, [
                                m('div', { class: `column is-4` }, "红包类型"),
                                m('div', { class: `column is-8 font-weight-bold` }, logic.redPacketType === 1 ? "普通红包" : "拼手气红包")
                            ]),
                            // 红包金额
                            m('div', { class: `columns is-mobile mb-3` }, [
                                m('div', { class: `column is-4` }, "红包金额"),
                                m('div', { class: `column is-8 font-weight-bold` }, (logic.moneyFormItem.value || "0") + " " + logic.currentCoin)
                            ]),
                            // 红包个数
                            m('div', { class: `columns is-mobile mb-3` }, [
                                m('div', { class: `column is-4` }, "红包个数"),
                                m('div', { class: `column is-8 font-weight-bold` }, (logic.numberFormItem.value || "0") + " 个")
                            ]),
                            // 资金密码 input
                            m('div', { class: `has-border-1 is-flex is-align-center has-line-level-4 px-3 mt-7` }, [
                                m('div', { class: `no-wrap` }, "资金密码"),
                                m('input', {
                                    class: `input has-border-none`,
                                    type: "password",
                                    placeholder: "资金密码",
                                    value: logic.passwordModel.value,
                                    oninput(e) {
                                        logic.passwordModel.updateValue(e.target.value); // 更新密码
                                        logic.passwordModel.verifyPassword(); // 校验
                                    }
                                })
                            ]),
                            // 密码错误提示
                            m('div', { class: `has-text-up mt-3` }, logic.passwordModel.errMsg)
                        ]
                    }
                }),
                // 未分析红包提示
                m(Modal, {
                    isShow: logic.isShowNotShareModal,
                    updateOption(params) {
                        logic.isShowNotShareModal = params.isShow;
                    },
                    content: m('div', { class: `my-modal-content px-5 has-bg-level-2 has-text-centered` }, [
                        m('div', { class: `my-5 is-content-center` }, [
                            m('i', { class: `iconfont icon-about-us has-text-primary` })
                        ]),
                        m('div', { class: `title-small mb-3` }, "您还未分享红包"),
                        m('div', { class: `mb-7` }, "退出后可在我的红包-已发送  中选中目标红包继续发送"),
                        m('div', { class: `mb-7 has-text-primary font-weight-bold`, onclick() { logic.isShowNotShareModal = false; } }, "知道了")
                    ])
                })
            ])
        ]);
    }
};