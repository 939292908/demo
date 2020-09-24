const m = require('mithril');
const Modal = require('@/views/components/common/Modal/Modal.view');

module.exports = {
    view(vnode) {
        return m(Modal, {
            isShow: vnode.attrs.isShow,
            updateOption(params) {
                vnode.attrs.updateOption(params);
            },
            content: m('div', { class: `view-share-box` }, [
                m('div', {
                    class: `view-share-content has-bg-level-2`,
                    style: `background:url(${require('@/assets/img/shareBg.png').default}) no-repeat;background-size: 100%;`
                }, [
                    m('div', { class: `is-gradient-text-primary title-x-large has-text-centered mt-5` }, "分享红包"),
                    m('div', { class: `is-content-center` }, [
                        m('div', { class: `view-share-content-title is-gradient-bg-primary px-5 font-weight-bold` }, "红包资产可用来提现，交易")
                    ]),
                    m('div', { class: `view-share-content-footer pa-3` }, [
                        m('div', { class: `pa-3` }, [
                            m('div', { class: `is-between has-bg-level-2 px-3 py-2` }, [
                                m('div', { class: `` }, [
                                    m('iframe', { src: require("@/assets/img/logo.svg").default, height: "12", style: "width: 100px;" }),
                                    m('div', { class: `body-3` }, "下载注册APP，轻松交易")
                                ]),
                                m('img', { class: `view-share-content-footer-ewm`, src: vnode.attrs.ewmImg })
                            ])
                        ])
                    ])
                ]),
                // 底部分享
                m('div', { class: `view-share-footer has-bg-level-2 border-radius-large-2-top` }, [
                    m('div', { class: `pt-7 has-text-centered` }, "图片已保存，快去分享给你的好友吧！"),
                    m('div', { class: `is-around has-border-bottom-1 has-line-level-4 py-5` }, vnode.attrs.shareBtnList.map((item, index) => {
                        return m('div', { class: `has-text-centered`, key: index }, [
                            m('i', { class: `iconfont ${item.icon} iconfont-x-large-2` }),
                            m('div', { class: `body-4 mt-1` }, item.label)
                        ]);
                    })),
                    m('div', {
                        class: `has-text-centered pt-5 pb-7`,
                        onclick() {
                            vnode.attrs.cancelShareBtnClick();
                        }
                    }, "取消")
                ])
            ])
        });
    }
};