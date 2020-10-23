const m = require('mithril');
// const logic = require('./Loading.logic');
require('./Loading.scss');

module.exports = {
    // oninit: vnode => logic.oninit(vnode),
    // oncreate: vnode => logic.oncreate(vnode),
    // onupdate: vnode => logic.onupdate(vnode),
    // onremove: vnode => logic.onremove(vnode),
    getLoading(option) {
        // 布尔类型直接赋值loading
        if (typeof option.isShow === 'boolean') {
            return option.isShow;
        }
        // 对象或数组 有true打开loading
        if (typeof option.isShow === 'object') {
            return Object.values(option.isShow).some(item => item);
        }
    },
    view(vnode) {
        if (vnode.attrs.type === 1) {
            return m('div', { class: `pub-loading-bg has-bg-level-2 ${vnode.state.getLoading(vnode.attrs) ? '' : 'is-hidden'}` }, [
                m('div', { class: `pub-loading-content loading-animation-1` }, [
                    m('img', { class: `pub-loading-img`, src: require("@/assets/img/loading.svg").default }),
                    m('div', { class: `pub-loading-label` }, vnode.attrs.label || "红包准备中...")
                ])
            ]);
        } else {
            return m('div', { class: `pub-loading-bg ${vnode.state.getLoading(vnode.attrs) ? '' : 'is-hidden'}` }, [
                m('div', { class: `pub-loading-content pub-loading-content-default` }, [
                    m('img', { class: `pub-loading-img loading-animation-2`, src: require("@/assets/img/loading1.svg").default })
                ])
            ]);
        }
    }
    // view(vnode) {
    //     if (logic.option.type === 1) {
    //         return m('div', { class: `pub-loading-bg has-bg-level-2 ${vnode.state.getLoading(logic.option) ? '' : 'is-hidden'}` }, [
    //             m('div', { class: `pub-loading-content loading-animation-1` }, [
    //                 m('img', { class: `pub-loading-img`, src: require("@/assets/img/loading.svg").default }),
    //                 m('div', { class: `pub-loading-label` }, logic.option.label || "红包准备中...")
    //             ])
    //         ]);
    //     } else {
    //         return m('div', { class: `pub-loading-bg ${vnode.state.getLoading(logic.option) ? '' : 'is-hidden'}` }, [
    //             m('div', { class: `pub-loading-content pub-loading-content-default` }, [
    //                 m('img', { class: `pub-loading-img loading-animation-2`, src: require("@/assets/img/loading1.svg").default })
    //             ])
    //         ]);
    //     }
    // }
};