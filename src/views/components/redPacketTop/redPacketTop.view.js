const m = require('mithril');
// {
//     guid: "", // 来源 (空为自己)
//     type: "", // 红包类型 type 0:为拼手气 / >0:普通红包
//     des: "", // 留言
//     quota: "", // 金额 (空不显示金额,币种)
//     coin: "", // 币种 (空不显示金额,币种)
//     msg: "" // 提示消息 (空不显示)
//     msg2: "" // 提示2 (空不显示)
// }
module.exports = {
    view(vnode) {
        return m('div', { class: `has-border-bottom-1 side-px pb-3 has-line-level-4 ${vnode.attrs.class || ''}` }, [
            // 来源 guid (空 为来源自己)
            vnode.attrs.guid ? m('div', { class: `pt-5` }, [
                m('span', { class: `` }, '来自'),
                m('span', { class: `has-text-primary` }, vnode.attrs.guid),
                m('span', { class: `` }, '的')
            ]) : m('div', { class: `pt-7` }, "您发送的"),
            // 红包类型 type 0:为拼手气 / >0:普通红包
            m('div', { class: `title-medium mb-3` }, vnode.attrs.type * 1 > 0 ? "普通红包" : "拼手气红包"),
            // 留言 des
            m('div', { class: `mb-5` }, vnode.attrs.des),
            // img
            // m('iframe', { src: require("@/assets/img/people.svg").default, width: "110", height: "110", class: "mt-3 mb-7" }),
            // 提示2
            vnode.attrs.msg2 ? m('div', { class: `` }, vnode.attrs.msg2) : '',
            // 金额
            (vnode.attrs.quota && vnode.attrs.coin) ? m('div', { class: `has-text-primary title-medium` }, `${vnode.attrs.quota} ${vnode.attrs.coin}`) : '',
            // 提示消息
            vnode.attrs.msg ? m('div', { class: `` }, vnode.attrs.msg) : ''
        ]);
    }
};