const m = require('mithril');
require('./sendRedPacketDetail.scss');
const logic = require('./sendRedPacketDetail.logic');
const Header = require('@/views/components/common/Header/Header.view');
const Button = require('@/views/components/common/Button/Button.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-give-red-packet-detail ${logic.redPacketState === 1 ? '' : 'has-bottom-btn'}` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-layout has-text-centered mb-3` }, [
                m('div', { class: `has-border-bottom-1 px-6 pb-7 has-line-level-4` }, [
                    m('div', { class: `pt-7` }, "您发送的"),
                    m('div', { class: `title-medium mb-3` }, "拼手气红包"),
                    m('div', { class: `` }, "“我们都活在暮光之城，黄昏之后我送你10USDT”"),
                    m('iframe', { src: require("@/assets/img/people.svg").default, width: "110", height: "110", class: "mt-3 mb-7" }),
                    m('div', { class: `has-text-primary title-medium` }, "10 USDT"),
                    logic.redPacketState === 3 ? m('div', { class: `` }, "红包已过期") : ""
                ]),
                // 领取概况
                m('div', { class: `has-text-left mt-7 px-6` }, [
                    m('span', { class: `` }, "已领取2/3个红包，共12/20USDT")
                ]),
                // 领取列表
                m('div', { class: `has-text-left px-6` }, logic.redPacketList.map((item, index) => {
                    return m('div', { class: `is-between py-5 has-border-bottom-1 has-line-level-4`, key: index }, [
                        m('div', { class: `` }, [
                            m('div', { class: `font-weight-bold` }, item.phone),
                            m('div', { class: `body-4` }, item.time)
                        ]),
                        m('div', { class: `font-weight-bold` }, [
                            m('span', { class: `` }, item.num),
                            m('span', { class: `` }, item.coin)
                        ])
                    ]);
                })),
                // 底部
                m('div', { class: `views-receive-result-footer px-6 ${logic.redPacketState === 1 ? 'is-hidden' : ''}` }, [
                    m(Button, {
                        label: logic.redPacketState === 2 ? "继续发送该红包" : "知道了",
                        class: 'views-receive-result-look-my-red-packet-btn is-primary',
                        width: 1,
                        onclick() {
                            if (logic.redPacketState === 2) { // 继续发送该红包
                                window.router.push("/sendRedPacket");
                            } else { // 知道了
                                window.router.back();
                            }
                        }
                    }),
                    m('div', { class: `pt-2 body-4` }, "24小时未领取红包，资产将会返还到您的钱包账户")
                ])
            ])
        ]);
    }
};