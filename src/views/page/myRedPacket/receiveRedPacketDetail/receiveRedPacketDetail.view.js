const m = require('mithril');
require('./receiveRedPacketDetail.scss');
const logic = require('./receiveRedPacketDetail.logic');
const Header = require('@/views/components/common/Header/Header.view');
// const Button = require('@/views/components/common/Button/Button.view');
// const Modal = require('@/views/components/common/Modal/Modal.view');
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
                m('div', { class: `has-text-left side-px` }, logic.redPacketList.map((item, index) => {
                    return m('div', { class: `is-between py-5 has-border-bottom-1 has-line-level-4 has-last-child-border-none`, key: index }, [
                        m('div', { class: `` }, [
                            m('div', { class: `font-weight-bold has-text-primary` }, item.build_rtel),
                            m('div', { class: `body-4 has-text-level-3` }, item.build_rtm)
                        ]),
                        m('div', { class: `has-text-right` }, [
                            m('div', { class: `font-weight-bold has-text-primary` }, [
                                item.best * 1 === 1 ? m('i', { class: `iconfont icon-VipCrown iconfont-medium` }) : "",
                                m('span', { class: `` }, item.quota),
                                m('span', { class: `` }, item.coin)
                            ]),
                            m('div', { class: `body-4 has-text-level-4` }, `≈￥${item.build_rmb}`)
                        ])
                    ]);
                }))
            ])
        ]);
    }
};