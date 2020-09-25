const m = require('mithril');
require('./myRedPacket.scss');
const logic = require('./myRedPacket.logic');
const Header = require('@/views/components/common/Header/Header.view');
const FormItem = require('@/views/components/common/FormItem/FormItem.view');
// const Button = require('@/views/components/common/Button/Button.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view view-my-red-packet` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-layout` }, [
                // nav导航
                m('div', { class: `view-my-red-packet-nav-box is-content-center pt-5` },
                    logic.navList.map((item, index) => {
                        return m('div', {
                            class: ` pb-3 font-weight-bold ${item.class || ''} ${logic.currentNavId === item.id ? 'has-text-primary has-border-bottom-2 has-line-primary' : ''}`,
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
        const getRedPacketStatus = function (item) {
            const status = item.status * 1;
            if (status === 0) return m('span', { class: `has-text-primary` }, "未抢完");
            if (status === 1) return m('span', { class: `` }, "已抢完");
            if (status === 2) {
                if (item.quota === item.quota2) {
                    return m('span', { class: `` }, "已全额退款");
                } else {
                    return m('span', { class: `` }, `已退款 ${item.quota2} ${item.coin}`);
                }
            }
        };
        const key = logic.currentNavId;
        switch (key) {
        case 1:
            // 已领取
            return m('div', { class: `` }, [
                m('div', { class: `mx-6 mt-7 body-4` }, "领取红包总金额：? USDT"),
                logic.receiveRedPacketList.map((item, index) => {
                    return m('div', {
                        class: `is-between py-5 has-border-bottom-1 has-line-level-4 mx-6`,
                        key: index,
                        onclick() {
                            logic.toReceiveRedPacketDetail(item.gid); // 跳转领的红包详情
                        }
                    }, [
                        // 左边
                        m('div', { class: `` }, [
                            m('div', { class: `font-weight-bold` }, [
                                m('span', { class: `` }, item.phone),
                                m('span', { class: `has-text-primary body-4` }, ' ' + item.type)
                            ]),
                            m('div', { class: `body-4` }, item.time)
                        ]),
                        // 右边
                        m('div', { class: `` }, [
                            m('div', { class: `has-text-primary font-weight-bold has-text-right` }, [
                                m('span', { class: `` }, item.num),
                                m('span', { class: `` }, item.coin)
                            ])
                            // m('div', { class: `` }, "≈￥70.5")
                        ])
                    ]);
                })
            ]);

        case 2:
            // 已发送
            return m('div', { class: `` }, [
                m(FormItem, {
                    class: `mx-6 pa-5 mt-7`,
                    content: [
                        // 左边
                        m('div', { class: `` }, [
                            m('p', { class: `` }, "已经发送红包总金额"),
                            m('p', { class: `title-small` }, "80 USDT")
                        ]),
                        // 右边
                        m('div', { class: `has-text-right` }, [
                            m('p', { class: `` }, "已退回红包总金额"),
                            m('p', { class: `title-small` }, "20 USDT")
                        ])
                    ]
                }),
                logic.sendRedPacketList.map((item, index) => {
                    return m('div', {
                        class: `is-between py-5 has-border-bottom-1 has-line-level-4 mx-6`,
                        key: index,
                        onclick() {
                            logic.toSendRedPacketDetail(item.gid); // 跳转发的红包详情
                        }
                    }, [
                        // 左边
                        m('div', { class: `` }, [
                            m('div', { class: `has-text-primary font-weight-bold` }, item.redPacketType > 0 ? "普通红包" : "拼手气红包"),
                            m('div', { class: `body-4` }, item.time)
                        ]),
                        // 右边
                        m('div', { class: `has-text-right` }, [
                            m('div', { class: `has-text-primary font-weight-bold` }, [
                                m('span', { class: `` }, item.quota),
                                m('span', { class: `` }, item.coin)
                            ]),
                            m('div', { class: `font-weight-regular body-4` }, getRedPacketStatus(item))
                        ])
                    ]);
                })
            ]);

        default:
            break;
        }
    }
};