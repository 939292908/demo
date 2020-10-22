const m = require('mithril');
require('./Loading.scss');

module.exports = {
    view(vnode) {
        return m('div', { class: `pub-loading-bg has-bg-level-2 ${vnode.attrs.loading ? '' : 'is-hidden'}` }, [
            m('div', { class: `pub-loading-content` }, [
                m('img', { class: `pub-loading-img`, src: require("@/assets/img/loading.svg").default }),
                m('div', { class: `pub-loading-label` }, vnode.attrs.label || "加载中...")
            ])
        ]);
    }
};