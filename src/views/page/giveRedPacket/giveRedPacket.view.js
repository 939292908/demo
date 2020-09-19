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
        return m('div', { class: `pub-view views-give-red-packet` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-layout` }, [
                // title
                m('div', { class: `views-give-red-packet-title columns is-mobile` }, [
                    m('div', { class: `column is-7` }, [
                        m('p', { class: `` }, '分享红包'),
                        m('p', { class: `mt-2` }, '红包资产可用来提现，交易')
                    ]),
                    m('div', { class: `column is-5` }, [
                        '图片'
                    ])
                ]),
                // 币种
                m('div', { class: `views-give-red-packet-coin py-3 has-line-level-4` }, [
                    m('span', { class: `body-3 mr-2` }, '币种'),
                    m('span', { class: `title-small` }, logic.currentCoin)
                ]),
                // 币种btn 列表
                m('div', { class: `views-give-red-packet-btn-list mt-7` }, [
                    logic.coinBtnList.map(btnOption => m(Button, btnOption))
                ]),
                // 划转
                m('div', { class: `has-text-right mt-7 mb-2` }, [
                    m('span', { class: `` }, '钱包可用：0.00USDT '),
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
                        logic.moneyFormItem.updateOption(params);
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
                    updateOption: params => logic.numberFormItem.updateOption(params)
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
                // 错误消息
                m('div', { class: `has-text-up has-text-centered mt-5` }, "单个红包金额不可超过 ?"),
                // 显示总金额
                m('div', { class: `has-text-centered mt-7` }, [
                    m('p', { class: `title-medium` }, "共 1 BTC"),
                    m('p', { class: `` }, " ≈¥78009.7")
                ]),
                // 塞币进红包 btn
                m(Button, {
                    label: "塞币进红包",
                    class: 'pub-layout-bottom-btn is-primary mb-3',
                    width: 1,
                    disabled: logic.redPacketType === 2,
                    onclick() {
                        logic.giveRedPModal.updateOption({ isShow: true });
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
                    onOk() {
                        logic.giveRedPModal.onOk();
                    },
                    slot: {
                        body: [
                            m('div', { class: `columns is-mobile` }, [
                                m('div', { class: `column is-4` }, "红包币种"),
                                m('div', { class: `column is-8` }, "USDT")
                            ]),
                            m('div', { class: `columns is-mobile` }, [
                                m('div', { class: `column is-4` }, "红包类型"),
                                m('div', { class: `column is-8` }, "拼手气红包")
                            ]),
                            m('div', { class: `columns is-mobile` }, [
                                m('div', { class: `column is-4` }, "红包金额"),
                                m('div', { class: `column is-8` }, "5 USDT")
                            ]),
                            m('div', { class: `columns is-mobile` }, [
                                m('div', { class: `column is-4` }, "红包个数"),
                                m('div', { class: `column is-8` }, "5 个")
                            ]),
                            // 资金密码 input
                            m('div', { class: `is-flex is-align-center` }, [
                                m('div', { class: `no-wrap` }, "资金密码"),
                                m('input', {
                                    class: `input`,
                                    type: "password",
                                    placeholder: "资金密码",
                                    value: logic.password,
                                    oninput(e) { logic.passwordInput(e); }
                                })
                            ]),
                            m('div', { class: `has-text-up mt-3` }, logic.passwordErrMsg)
                        ]
                    }
                })
            ])
        ]);
    }
};