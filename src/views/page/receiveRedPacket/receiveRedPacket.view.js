const m = require('mithril');
require('./receiveRedPacket.scss');
const logic = require('./receiveRedPacket.logic');
const Header = require('@/views/components/common/Header/Header.view');
const FormItem = require('@/views/components/common/FormItem/FormItem.view');
const Button = require('@/views/components/common/Button/Button.view');
const Validate = require('@/views/components/validate/validate.view');
const Modal = require('@/views/components/common/Modal/Modal.view');
const redPacketTop = require('@/views/components/redPacketTop/redPacketTop.view');
const redPacketInfo = require('@/views/components/redPacketInfo/redPacketInfo.view');
const apiLines = require('@/models/network/lines.js');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-receive-red-packet` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-content has-text-centered` }, [
                // 抢红包头部
                m(redPacketTop, logic.redPacketTopOption),
                m('div', { class: `side-px` }, [
                    m(FormItem, {
                        class: "is-around mb-3",
                        content: m('input.input[type=text].has-text-centered', {
                            placeholder: "输入您的手机号/邮箱",
                            oninput: e => {
                                logic.numberOnInput(e);
                            },
                            onblur: e => {
                            },
                            value: logic.account
                        })
                    })
                ]),
                m('div.body-3.mb-3.mx-6.has-text-up', { hidden: false }, logic.errText),
                // 抢
                m('div', { class: `side-px` }, m(Button, {
                    label: "抢",
                    class: 'is-primary',
                    width: 1,
                    onclick() {
                        logic.receiveClick();
                    }
                })),
                m('div', { class: `has-text-primary mt-5` }, "已经在APP登录账号？点击前往直接抢 >>"),
                // 领取概况
                m(redPacketInfo, logic.redPacketInfoOption),
                // 领取列表
                m('div', { class: `has-text-left side-px pb-3` }, logic.redPacketList.map((item, index) => {
                    return m('div', { class: `is-between py-5 has-border-bottom-1 has-line-level-4 has-last-child-border-none`, key: index }, [
                        m('div', { class: `` }, [
                            m('div', { class: `font-weight-bold` }, item.build_rtel),
                            m('div', { class: `body-4` }, item.build_rtm)
                        ]),
                        m('div', { class: `font-weight-bold has-text-right` }, [
                            item.best * 1 === 1 ? m('i', { class: `iconfont icon-VipCrown iconfont-medium` }) : "",
                            m('span', { class: `` }, item.quota),
                            m('span', { class: `` }, item.coin)
                        ])
                    ]);
                }))
            ]),
            // 安全验证弹框
            m(Modal, {
                isShow: logic.isShowVerifyView,
                updateOption(params) {
                    logic.isShowVerifyView = params.isShow;
                },
                content: m('div', { class: `my-modal-content px-5 has-bg-level-2 has-text-centered pb-7` }, [
                    m('div', { class: `title-small mb-3 mt-7` }, "安全验证"),
                    m('div', { class: `mb-3` }, "如未使用手机号注册平台账号，请在注册后查收红包"),
                    m(Validate) // 安全验证组件
                ])
            }),
            // 线路切换弹窗
            m('div.modal' + (logic.isShowSwitchLinesView ? '.is-active' : ''), {}, [
                m('div.modal-background'),
                m('div.modal-card.w80.border-radius-small', {}, [
                    m('header.modal-card-head.border-radius-small-top.has-bg-level-2.border-0.side-pa', {}, [
                        m('p.modal-card-title.body-5.has-text-title.font-weight-medium', {}, [
                            `线路切换(${apiLines.netLines.length})`
                        ]),
                        m('button.button.is-light.pa-3', {
                            onclick: function() {
                                // logic.closeSwitchLineView();
                            }
                        }, [
                            m('i.iconfont.icon-Order')
                        ]),
                        m('button.button.is-light.pa-3', {
                            onclick: function() {
                                logic.closeSwitchLineView();
                            }
                        }, [
                            m('span.delete')
                        ])
                    ]),
                    m('div.modal-card-body.side-px', {}, [
                        apiLines.netLines.map((item, i) => {
                            return m('div', {
                                class: ``
                            }, [
                                m('a', {
                                    class: `ma-0 py-4 body-5 has-text-level-2 is-flex`,
                                    onclick: function() {
                                        apiLines.setLinesActive(item.Id);
                                    }
                                }, [
                                    m('i.iconfont.icon-dot' + (item.Id !== apiLines.activeLine.Id ? '.opacity-0' : '.has-text-primary')),
                                    m('span', {}, [
                                        item.Name
                                    ]),
                                    m('span.pl-2' + (item.Id !== apiLines.activeLine.Id ? '.opacity-0' : '.has-text-primary'), {}, [
                                        '当前'
                                    ]),
                                    m('span.spacer'),
                                    m('span.has-text-left' + (item.Id !== apiLines.activeLine.Id ? '' : '.has-text-primary'), {}, [
                                        '延迟 ' + apiLines.wsResponseSpeed[i] + '/' + apiLines.apiResponseSpeed[i] + 'ms'
                                        // I18n.$t('10155') + ' ' + (apiLines.wsResponseSpeed[i] || '--') + '/' + (apiLines.apiResponseSpeed[i] || '--') + 'ms'
                                    ])
                                ]),
                                m('hr.ma-0.has-bg-level-1')
                            ]);
                        })
                    ])
                ])
            ])
        ]);
    }
};