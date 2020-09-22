const m = require('mithril');
require('./receiveResult.scss');
const logic = require('./receiveResult.logic');
const Header = require('@/views/components/common/Header/Header.view');
const Button = require('@/views/components/common/Button/Button.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-receive-result` }, [
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
                    m('div', { class: `has-text-primary title-medium` }, "10 USDT"),
                    m('div', { class: `mb-3` }, "钱包账户，可直接提现、交易")
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
                })),
                // 底部
                m('div', { class: `views-receive-result-footer px-6` }, [
                    m(Button, {
                        label: "查看我的红包",
                        class: 'views-receive-result-look-my-red-packet-btn is-primary',
                        width: 1,
                        onclick() {
                            // console.log("查看我的红包!");
                            window.router.push("/myRedPacket");
                        }
                    }),
                    m('div', { class: `pt-2 body-4` }, "下载APP  收发红包 小事一桩")
                ])
            ])
        ]);
    }
};