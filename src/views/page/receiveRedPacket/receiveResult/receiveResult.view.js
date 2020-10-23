const m = require('mithril');
require('./receiveResult.scss');
const logic = require('./receiveResult.logic');
const Header = require('@/views/components/common/Header/Header.view');
const Button = require('@/views/components/common/Button/Button.view');
const redPacketTop = require('@/views/components/redPacketTop/redPacketTop.view');
const redPacketInfo = require('@/views/components/redPacketInfo/redPacketInfo.view');
const redPacketUtils = require('@/util/redPacketUtils').default;
const globalModels = require('@/models/globalModels');
const I18n = require('@/languages/I18n').default;
const Loading = require('@/views/components/common/Loading/Loading.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-receive-result` }, [
            m(Loading, logic.loadingOption),
            m(Header, logic.headerOption),
            m('div', { class: `pub-content has-text-centered` }, [
                // 红包头部
                m(redPacketTop, logic.redPacketTopOption),
                // 领取概况
                m(redPacketInfo, logic.redPacketInfoOption),
                // 领取列表
                m('div', { class: `has-text-left px-6` }, logic.redPacketList.map((item, index) => {
                    return m('div', { class: `is-between py-5 has-border-bottom-1 has-line-level-1 has-last-child-border-none`, key: index }, [
                        m('div', { class: `` }, [
                            m('div', {
                                class: `font-weight-bold ${globalModels.getAccount().uid === item.ruid ? 'has-text-primary' : 'has-text-level-1'}`
                            }, item.build_rtel || item.build_remail),
                            m('div', { class: `body-4` }, item.build_rtm)
                        ]),
                        m('div', { class: `has-text-right` }, [
                            m('div', {
                                class: `font-weight-bold ${globalModels.getAccount().uid === item.ruid ? 'has-text-primary' : 'has-text-level-1'}`
                            }, [
                                item.best * 1 === 1 && logic.redPacketTopOption?.status === 1 ? m('i', { class: `iconfont icon-VipCrown has-text-primary iconfont-medium` }) : "",
                                m('span', { class: `` }, item.quota),
                                m('span', { class: `` }, item.coin)
                            ]),
                            m('div', { class: `body-4` }, `≈￥${item.build_rmb}`)
                        ])
                    ]);
                }))
            ]),
            m('div', { class: `views-receive-result-footer px-6 pb-3 has-text-centered` }, [
                m('a', { href: redPacketUtils.getRegisterUrl(m.route.param().r) }, m(Button, {
                    label: I18n.$t('20057')/* 查看我的红包 */,
                    class: 'is-primary',
                    width: 1
                })),
                m('a', { class: `pt-2 body-4 has-text-level-3`, href: redPacketUtils.getRegisterUrl(m.route.param().r) }, I18n.$t('20058')/* 下载APP 收发红包 小事一桩 */)
            ])
        ]);
    }
};