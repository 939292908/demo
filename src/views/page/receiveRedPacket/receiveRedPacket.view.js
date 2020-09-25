const m = require('mithril');
require('./receiveRedPacket.scss');
const logic = require('./receiveRedPacket.logic');
const Header = require('@/views/components/common/Header/Header.view');
const FormItem = require('@/views/components/common/FormItem/FormItem.view');
const Button = require('@/views/components/common/Button/Button.view');
const regExp = require('@/models/validate/regExp');
const Validate = require('@/views/components/validate/validate.view');
// const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const Modal = require('@/views/components/common/Modal/Modal.view');
// const config = require('@/config.js');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-receive-red-packet` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-layout has-text-centered` }, [
                m('div', { class: `has-border-bottom-1 px-6 pb-7 has-line-level-4` }, [
                    m('div', { class: `pt-7` }, [
                        m('span', { class: `` }, "来自"),
                        m('span', { class: `has-text-primary` }, "178****0000"),
                        m('span', { class: `` }, "的")
                    ]),
                    m('div', { class: `title-large mb-3` }, "拼手气红包"),
                    m('div', { class: `` }, "“我们都活在暮光之城，黄昏之后我送你10USDT”"),
                    m('iframe', { src: require("@/assets/img/people.svg").default, width: "110", height: "110", class: "mt-3 mb-7" }),
                    m('div', { class: `` }, "您有机会获得"),
                    m('div', { class: `has-text-primary title-medium` }, "10 USDT"),
                    m(FormItem, {
                        class: "is-around mt-7 mb-3",
                        content: m('input.input[type=text].has-text-centered', {
                            placeholder: "输入您的手机号/邮箱",
                            oninput: e => {
                                logic.account = e.target.value;
                                // console.log(logic.account);
                            },
                            onblur: e => {
                                // console.log(logic.account);
                            },
                            value: logic.account
                        })
                    }),
                    m('div.body-3.mb-3.has-text-up', { hidden: false }, [regExp.validAccount(true, logic.account)]),
                    // 抢
                    m(Button, {
                        label: "抢",
                        class: 'is-primary',
                        width: 1,
                        onclick() {
                            logic.receiveClick();
                        }
                    }),
                    m('div', { class: `has-text-primary mt-5` }, "已经在APP登录账号？点击前往直接抢 >>")
                ]),
                // 领取概况
                m('div', { class: `has-text-left mt-7 px-6` }, [
                    // m('span', { class: `` }, "已领取2/3个红包,共5/7 USDT"),
                    m('span', { class: `` }, "3个红包共12 EOS，5分钟被抢光")
                ]),
                // 领取列表
                m('div', { class: `has-text-left px-6 pb-3` }, logic.redPacketList.map((item, index) => {
                    return m('div', { class: `is-between py-5 has-border-bottom-1 has-line-level-4`, key: index }, [
                        m('div', { class: `` }, [
                            m('div', { class: `has-text-primary font-weight-bold` }, item.phone),
                            m('div', { class: `body-4` }, item.time)
                        ]),
                        m('div', { class: `has-text-primary font-weight-bold` }, [
                            m('span', { class: `` }, item.num),
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
            })
        ]);
    }
};