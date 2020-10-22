const m = require('mithril');
// const logic = require('./Loading.logic');
require('./Loading.scss');

module.exports = {
    view(vnode) {
        if (vnode.attrs.type === 1) {
            return m('div', { class: `pub-loading-bg has-bg-level-2 ${vnode.attrs.loading ? '' : 'is-hidden'}` }, [
                m('div', { class: `pub-loading-content loading-animation-1` }, [
                    m('img', { class: `pub-loading-img`, src: require("@/assets/img/loading.svg").default }),
                    m('div', { class: `pub-loading-label` }, vnode.attrs.label || "加载中...")
                ])
            ]);
        } else {
            return m('div', { class: `pub-loading-bg` }, [
                m('div', { class: `pub-loading-content pub-loading-content-default` }, [
                    m('img', { class: `pub-loading-img loading-animation-2`, src: require("@/assets/img/loading1.svg").default })
                ])
            ]);
        }
    }
};