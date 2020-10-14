const m = require('mithril');
require('./sendRedPacketDetail.scss');
const logic = require('./sendRedPacketDetail.logic');
const Header = require('@/views/components/common/Header/Header.view');
const Button = require('@/views/components/common/Button/Button.view');
const redPacketTop = require('@/views/components/redPacketTop/redPacketTop.view');
const redPacketInfo = require('@/views/components/redPacketInfo/redPacketInfo.view');
const globalModels = require('@/models/globalModels');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-give-red-packet-detail` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-content has-text-centered` }, [
                // 红包头部
                m(redPacketTop, logic.redPacketTopOption),
                // 领取概况
                m(redPacketInfo, logic.redPacketInfoOption),
                // 领取列表
                m('div', { class: `has-text-left side-px` }, logic.redPacketList.map((item, index) => {
                    return m('div', { class: `is-between py-5 has-border-bottom-1 has-line-level-1 has-last-child-border-none`, key: index }, [
                        m('div', { class: `${globalModels.getAccount().uid === item.ruid ? 'has-text-primary' : 'has-text-level-1'}` }, [
                            m('div', { class: `font-weight-bold` }, item.build_rtel || item.build_remail),
                            m('div', { class: `body-4 has-text-level-4` }, item.build_rtm)
                        ]),
                        m('div', { class: `has-text-right` }, [
                            m('div', { class: `font-weight-bold has-text-level-1 ${globalModels.getAccount().uid === item.ruid ? 'has-text-primary' : 'has-text-level-1'}` }, [
                                item.best * 1 === 1 && logic.redPacketTopOption?.status === 1 ? m('i', { class: `iconfont icon-VipCrown has-text-primary iconfont-medium` }) : "",
                                m('span', { class: `` }, item.quota),
                                m('span', { class: `` }, item.coin)
                            ]),
                            m('div', { class: `body-4 has-text-level-3` }, `≈￥${item.build_rmb}`)
                        ])
                    ]);
                }))
            ]),
            // 底部
            m('div', { class: `side-px pt-3` }, [
                m(Button, {
                    class: 'is-primary',
                    label: logic.redPacketInfoOption.status === 0 ? "继续发送该红包" : "知道了",
                    width: 1,
                    loading: logic.shareLoading,
                    onclick() {
                        logic.footerBtnClick();
                    }
                }),
                m('div', { class: `pt-2 body-4 has-text-centered has-text-level-3` }, "24小时未领取红包，资产将会返还到您的钱包账户")
            ])
        ]);
    }
};