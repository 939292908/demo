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
                    class: `view-share-content has-bg-level-2`
                }, [
                    m('img', { src: logic.options.needShareImg, width: '100%' })
                ]),
                // 底部分享
                m('div', { class: `view-share-footer has-bg-level-2 border-radius-large-2-top` }, [
                    m('div', { class: `pt-7 has-text-centered` }, "图片已保存，快去分享给你的好友吧！"),
                    m('div', { class: `is-around has-border-bottom-1 has-line-level-4 py-5` }, logic.shareBtnList.map((item, index) => {
                        return m('div', { class: `has-text-centered`, key: index }, [
                            m('i', { class: `iconfont ${item.icon} iconfont-x-large-2` }),
                            m('div', { class: `body-4 mt-1` }, item.label)
                        ]);
                    })),
                    m('div', {
                        class: `has-text-centered pt-5 pb-7`,
                        onclick() {
                            logic.cancelShareBtnClick();
                        }
                    }, "取消")
                ])
            ])
        });
    }
};