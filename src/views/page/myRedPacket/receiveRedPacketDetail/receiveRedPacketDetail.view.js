const m = require('mithril');
require('./receiveRedPacketDetail.scss');
const logic = require('./receiveRedPacketDetail.logic');
const Header = require('@/views/components/common/Header/Header.view');
// const Button = require('@/views/components/common/Button/Button.view');
const Modal = require('@/views/components/common/Modal/Modal.view');
const redPacketTop = require('@/views/components/redPacketTop/redPacketTop.view');
const redPacketInfo = require('@/views/components/redPacketInfo/redPacketInfo.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-receive-red-packet-detail` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-content has-text-centered pb-3` }, [
                // 红包头部
                m(redPacketTop, logic.redPacketTopOption),
                // 领取概况
                m(redPacketInfo, logic.redPacketInfoOption),
                // 领取列表
                m('div', { class: `has-text-left px-6` }, logic.redPacketList.map((item, index) => {
                    return m('div', { class: `is-between py-5 has-border-bottom-1 has-line-level-4 has-last-child-border-none`, key: index }, [
                        m('div', { class: `` }, [
                            m('div', { class: `font-weight-bold has-text-primary` }, item.build_rtel),
                            m('div', { class: `body-4` }, item.build_rtm)
                        ]),
                        m('div', { class: `has-text-right` }, [
                            m('div', { class: `font-weight-bold has-text-primary` }, [
                                item.best * 1 === 1 ? m('i', { class: `iconfont icon-VipCrown iconfont-medium` }) : "",
                                m('span', { class: `` }, item.quota),
                                m('span', { class: `` }, item.coin)
                            ]),
                            m('div', { class: `body-4` }, `≈￥${item.build_rmb}`)
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
                    m.route.param().best * 1 === 1 ? m('i', { class: `iconfont icon-VipCrown iconfont-x-large-4 has-text-primary` }) : m('iframe', { src: require("@/assets/img/people.svg").default, width: 64, height: 64 }),
                    m('div', { class: `title-medium` }, [m.route.param().best * 1 === 1 ? "手气最佳" : "我抢到了"]),
                    m('div', { class: `title-medium has-text-primary` }, `8 USDT`),
                    m('div', { class: `` }, [
                        m('span', { class: `` }, "我抢到了来自"),
                        m('span', { class: `has-text-primary` }, "178****7894"),
                        m('span', { class: `` }, "的拼手气红包")
                    ]),
                    m('div', { class: `has-border-top-1 has-line-level-2 has-text-left is-between py-6 mt-7` }, [
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