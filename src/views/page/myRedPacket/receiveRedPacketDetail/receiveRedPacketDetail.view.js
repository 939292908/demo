const m = require('mithril');
require('./receiveRedPacketDetail.scss');
const logic = require('./receiveRedPacketDetail.logic');
const Header = require('@/views/components/common/Header/Header.view');
// const Button = require('@/views/components/common/Button/Button.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-receive-red-packet-detail` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-layout has-text-centered pb-3` }, [
                m('div', { class: `has-border-bottom-1 px-6 pb-7 has-line-level-4` }, [
                    m('div', { class: `pt-7` }, [
                        m('span', { class: `` }, '来自'),
                        m('span', { class: `has-text-primary` }, '178****0000'),
                        m('span', { class: `` }, '的')
                    ]),
                    m('div', { class: `title-medium mb-3` }, "拼手气红包"),
                    m('div', { class: `` }, "“我们都活在暮光之城，黄昏之后我送你10USDT”"),
                    m('iframe', { src: require("@/assets/img/people.svg").default, width: "110", height: "110", class: "mt-3 mb-7" }),
                    m('div', { class: `has-text-primary title-medium` }, "10 USDT")
                ]),
                // 领取概况
                m('div', { class: `has-text-left mt-7 px-6` }, [
                    m('span', { class: `` }, "已领取2/3个红包，共12/20USDT")
                ]),
                // 领取列表
                m('div', { class: `has-text-left px-6` }, logic.redPacketList.map((item, index) => {
                    return m('div', { class: `is-between py-5 has-border-bottom-1 has-line-level-4`, key: index }, [
                        m('div', { class: `` }, [
                            m('div', { class: `font-weight-bold has-text-primary` }, item.phone),
                            m('div', { class: `body-4` }, item.time)
                        ]),
                        m('div', { class: `font-weight-bold has-text-primary` }, [
                            m('span', { class: `` }, item.num),
                            m('span', { class: `` }, item.coin)
                        ])
                    ]);
                }))
            ])
        ]);
    }
};