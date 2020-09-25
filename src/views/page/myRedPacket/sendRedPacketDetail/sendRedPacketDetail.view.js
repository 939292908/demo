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
                    m('div', { class: `title-medium mb-3` }, logic.redPacketType * 1 > 0 ? "普通红包" : "拼手气红包"),
                    m('div', { class: `` }, logic.redPacketDes),
                    m('iframe', { src: require("@/assets/img/people.svg").default, width: "110", height: "110", class: "mt-3 mb-7" }),
                    m('div', { class: `has-text-primary title-medium` }, `${logic.quota} ${logic.coin}`),
                    logic.redPacketState === 3 ? m('div', { class: `` }, "红包已过期") : ""
                ]),
                // 领取概况
                m('div', { class: `has-text-left mt-7 px-6` }, [
                    m('span', { class: `` }, `已领取${logic.count - logic.count2}/${logic.count}个红包，共${logic.quota - logic.quota2}/${logic.quota}${logic.coin}`)
                ]),
                // 领取列表
                m('div', { class: `has-text-left px-6` }, logic.redPacketList.map((item, index) => {
                    return m('div', { class: `is-between py-5 has-border-bottom-1 has-line-level-4`, key: index }, [
                        m('div', { class: `` }, [
                            m('div', { class: `font-weight-bold` }, item.phone),
                            m('div', { class: `body-4` }, item.time)
                        ]),
                        m('div', { class: `font-weight-bold` }, [
                            m('span', { class: `` }, item.quota),
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
                                window.router.push({
                                    path: "/sendRedPacket",
                                    data: {
                                        gid: "123"
                                    }
                                });
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