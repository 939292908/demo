const m = require('mithril');
require('./receiveRedPacketDetail.scss');
const logic = require('./receiveRedPacketDetail.logic');
const Header = require('@/views/components/common/Header/Header.view');
// const Button = require('@/views/components/common/Button/Button.view');
const Modal = require('@/views/components/common/Modal/Modal.view');

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
            ]),
            // 分享抢红包详情 弹框
            m(Modal, {
                isShow: logic.isShowShareDetailModal,
                updateOption(params) {
                    logic.isShowShareDetailModal = params.isShow;
                },
                content: m('div', { class: `my-modal-content has-bg-level-2 px-7 py-5 has-text-centered` }, [
                    logic.isLucky ? m('i', { class: `iconfont icon-huiyuan` }) : m('iframe', { src: require("@/assets/img/people.svg").default, width: 64, height: 64 }),
                    m('div', { class: `` }, [logic.isLucky ? "手气最佳" : "我抢到了"]),
                    m('div', { class: `` }, `8 USDT`),
                    m('div', { class: `` }, `我抢到了来自178****7894的拼手气红包`),
                    m('div', { class: `has-border-top-1 has-line-level-2 has-text-left is-between py-6` }, [
                        m('div', { class: `` }, [
                            m('iframe', { src: require("@/assets/img/logo.svg").default, height: "12", style: "width: 100px;" }),
                            m('div', { class: `body-3` }, "下载注册APP，轻松交易")
                        ]),
                        m('img', { class: `views-receive-red-packet-detail-footer-ewm`, width: 42, src: logic.ewmImg })
                    ])
                ])
            })
        ]);
    }
};