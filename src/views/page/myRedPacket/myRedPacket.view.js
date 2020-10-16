const m = require('mithril');
require('./myRedPacket.scss');
const logic = require('./myRedPacket.logic');
const Header = require('@/views/components/common/Header/Header.view');
const FormItem = require('@/views/components/common/FormItem/FormItem.view');
// const Button = require('@/views/components/common/Button/Button.view');
const I18n = require('@/languages/I18n').default;

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view view-my-red-packet` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-content` }, [
                // nav导航
                m('div', { class: `view-my-red-packet-nav-box is-content-center pt-5` },
                    logic.navList.map((item, index) => {
                        return m('div', {
                            class: ` pb-3 font-weight-bold has-text-level-3 ${item.class || ''} ${logic.currentNavId === item.id ? 'has-text-primary has-border-bottom-2 has-line-primary' : ''}`,
                            key: index,
                            onclick() {
                                logic.currentNavId = item.id;
                            }
                        }, item.label);
                    })

                ),
                m('div', { class: `has-border-bottom-1 has-line-level-1` }),
                vnode.state.getNavContent()
            ])
        ]);
    },
    getNavContent() {
        // 红包状态获取
        const getTextByStatus = function (item) {
            const status = item.status * 1;
            if (status === 0) return m('span', { class: `has-text-primary no-select` }, I18n.$t('20039')/* 未抢完 */);
            if (status === 1) return m('span', { class: `has-text-level-3 no-select` }, I18n.$t('20040')/* 已抢完 */);
            if (status === 3) {
                if (item.quota === item.quota2) {
                    return m('span', { class: `has-text-level-3` }, I18n.$t('20041')/* 已全额退款 */);
                } else {
                    return m('span', { class: `has-text-level-3` }, `${I18n.$t('20042')/* 已退款 */} ${item.quota2} ${item.coin}`);
                }
            }
        };
        const key = logic.currentNavId;
        switch (key) {
        case 1:
            // 已领取
            return m('div', { class: `side-px` }, [
                m(FormItem, {
                    class: `py-5 px-3 mt-7 mb-3`,
                    content: [
                        // 左边
                        m('div', { class: `` }, [
                            m('p', { class: `has-text-level-3` }, I18n.$t('20043')/* 领取红包总金额 */),
                            m('p', { class: `title-small has-text-level-1` }, `${logic.receiveMoneySum} USDT`)
                        ]),
                        // 右边
                        m('div', { class: `has-text-right` }, [
                        ])
                    ]
                }),
                logic.receiveRedPacketList.map((item, index) => {
                    return m('div', {
                        class: `is-between py-5 has-border-bottom-1 has-line-level-1 has-last-child-border-none`,
                        key: index,
                        onclick() {
                            logic.toReceiveRedPacketDetail(item); // 跳转领的红包详情
                        }
                    }, [
                        // 左边
                        m('div', { class: `` }, [
                            m('div', { class: `font-weight-bold` }, [
                                m('span', { class: `has-text-level-1` }, item.rtel_bulid || item.remail_bulid),
                                m('span', { class: `has-text-primary body-4` }, ' ' + item.type > 0 ? I18n.$t('20010'/* 普通红包 */) : I18n.$t('20011'/* 拼手气红包 */))
                            ]),
                            m('div', { class: `body-4 has-text-level-4` }, item.time)
                        ]),
                        // 右边
                        m('div', { class: `` }, [
                            m('div', { class: `has-text-primary font-weight-bold has-text-right` }, [
                                item.best * 1 === 1 && logic.redPacketTopOption?.status === 1 ? m('i', { class: `iconfont icon-VipCrown has-text-primary iconfont-medium` }) : "",
                                m('span', { class: `` }, item.quota),
                                m('span', { class: `` }, item.coin)
                            ])
                            // m('div', { class: `` }, "≈￥70.5")
                        ])
                    ]);
                })
            ]);

        case 2:
            // 已发送
            return m('div', { class: `side-px` }, [
                m(FormItem, {
                    class: `py-5 px-3 mt-7 mb-3`,
                    content: [
                        // 左边
                        m('div', { class: `` }, [
                            m('p', { class: `has-text-level-3` }, I18n.$t('20044')/* 已发送红包总金额 */),
                            m('p', { class: `title-small no-wrap has-text-level-1` }, `${logic.sendMoneySum} USDT`)
                        ]),
                        // 右边
                        m('div', { class: `has-text-right` }, [
                            m('p', { class: `has-text-level-3` }, I18n.$t('20045')/* 已退回红包总金额 */),
                            m('p', { class: `title-small no-wrap has-text-level-1` }, `${logic.sendMoneySumBack} USDT`)
                        ])
                    ]
                }),
                logic.sendRedPacketList.map((item, index) => {
                    return m('div', {
                        class: `is-between py-5 has-border-bottom-1 has-line-level-1 has-last-child-border-none`,
                        key: index,
                        onclick() {
                            logic.toSendRedPacketDetail(item); // 跳转发的红包详情
                        }
                    }, [
                        // 左边
                        m('div', { class: `` }, [
                            m('div', { class: `has-text-primary font-weight-bold` }, item.type > 0 ? I18n.$t('20010'/* 普通红包 */) : I18n.$t('20011'/* 拼手气红包 */)),
                            m('div', { class: `body-4 has-text-level-3` }, item.time)
                        ]),
                        // 右边
                        m('div', { class: `has-text-right` }, [
                            m('div', { class: `has-text-level-1 font-weight-bold` }, [
                                m('span', { class: `` }, item.quota),
                                m('span', { class: `` }, item.coin)
                            ]),
                            m('div', { class: `font-weight-regular body-4` }, getTextByStatus(item))
                        ])
                    ]);
                })
            ]);

        default:
            break;
        }
    }
};