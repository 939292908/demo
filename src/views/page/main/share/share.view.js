const m = require('mithril');
const Modal = require('@/views/components/common/Modal/Modal.view');
const logic = require('./share.logic.js');
require('./share.scss');

module.exports = {
    view(vnode) {
        return m(Modal, {
            isShow: logic.options.isShow,
            content: m('div', { class: `view-share-box` }, [
                m('div', {
                    class: `view-share-content has-text-centered scroll-y`
                }, [
                    m('img', { src: logic.options.needShareImg, width: '60%' })
                ]),
                // 底部分享
                m('div', { class: `view-share-footer has-bg-level-2 border-radius-large-2-top` }, [
                    m('div', { class: `pt-7 has-text-centered has-text-level-3` }, "图片已保存，快去分享给你的好友吧！"),
                    m('div', { class: `is-around has-border-bottom-1 has-line-level-4 pa-5` }, logic.shareBtnList.map((item, index) => {
                        return m('button', {
                            class: `button is-light has-text-centered`,
                            key: index,
                            onclick: e => {
                                logic.doShare(item);
                            }
                        }, [
                            m('div', { class: `has-text-centered`, key: index }, [
                                // m('i', { class: `iconfont ${item.icon} iconfont-x-large-2` }),
                                m('svg', { class: "icon iconfont-x-large-2 ma-0", "aria-hidden": true }, [
                                    m('use', { "xlink:href": item.icon })
                                ]),
                                /* <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-xxx"></use>
                                    </svg> */
                                m('div', { class: `body-4 mt-1` }, item.label)
                            ])
                        ]);
                    })),
                    m('button', {
                        class: `button is-light is-fullwidth has-text-centered button-large`,
                        onclick() {
                            logic.cancelShareBtnClick();
                        }
                    }, "取消")
                ])
            ])
        });
    }
};