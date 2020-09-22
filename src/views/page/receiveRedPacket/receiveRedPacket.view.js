const m = require('mithril');
require('./receiveRedPacket.scss');
const logic = require('./receiveRedPacket.logic');
const Header = require('@/views/components/common/Header/Header.view');
const FormItem = require('@/views/components/common/FormItem/FormItem.view');
const Button = require('@/views/components/common/Button/Button.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-receive-red-packet` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-layout has-text-centered` }, [
                m('div', { class: `has-border-bottom px-6 pb-7 has-line-level-4` }, [
                    m('div', { class: `pt-7` }, [
                        m('span', { class: `` }, "来自"),
                        m('span', { class: `has-text-primary` }, "178****0000"),
                        m('span', { class: `` }, "的")
                    ]),
                    m('div', { class: `title-large mb-3` }, "拼手气红包"),
                    m('div', { class: `` }, "“我们都活在暮光之城，黄昏之后我送你10USDT”"),
                    m('iframe', { src: require("@/assets/img/people.svg").default, width: "110", height: "100", class: "mt-3 mb-7" }),
                    m('div', { class: `` }, "您有机会获得"),
                    m('div', { class: `has-text-primary title-medium` }, "10 USDT"),
                    m(FormItem, {
                        class: "is-around py-3 mt-7 mb-3",
                        content: "1886 8555 8994"
                    }),
                    m(Button, {
                        label: "抢",
                        class: 'is-primary',
                        width: 1,
                        onclick() {
                            console.log("抢红包啦!");
                            window.router.push("/receiveResult");
                        }
                    })
                ]),
                // 领取概况
                m('div', { class: `has-text-left mt-7 px-6` }, [
                    // m('span', { class: `` }, "已领取2/3个红包,共5/7 USDT"),
                    m('span', { class: `` }, "3个红包共12 EOS，5分钟被抢光")
                ]),
                // 领取列表
                m('div', { class: `has-text-left px-6 pb-3` }, logic.redPacketList.map((item, index) => {
                    return m('div', { class: `is-between py-5 has-border-bottom has-line-level-4` }, [
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
            ])
        ]);
    }
};