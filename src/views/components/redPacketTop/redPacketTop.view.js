const m = require('mithril');
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n').default;

// const globalModels = require('@/models/globalModels');

// {
//     gtel / gemail: "", // 来源
//     type: "", // 红包类型 type 0:为拼手气 / >0:普通红包
//     des: "", // 留言
//     quota: "", // 金额 (空不显示金额,币种)
//     coin: "", // 币种 (空不显示金额,币种)
//     msg: "" // 提示消息 (空不显示)
//     msg2: "" // 提示2 (空不显示)

//     guid: "" // 没有guid则自己发的红包
//     hiddenLine: "" // 隐藏底部线条
// }
module.exports = {
    // 红包来源
    getFromName(vnode) {
        if (vnode.attrs.gtel) {
            return utils.hideAccountNameInfo(vnode.attrs.gtel);
        }
        if (vnode.attrs.gemail) {
            return utils.hideAccountNameInfo(vnode.attrs.gemail);
        }
    },
    // 红包类型
    getType(vnode) {
        if (vnode.attrs.type * 1 > 0) {
            return I18n.$t('20010'/* 普通红包 */);
        } else {
            return I18n.$t('20011'/* 拼手气红包 */);
        }
    },
    view(vnode) {
        return m('div', { class: `${vnode.attrs.hiddenLine ? '' : 'has-border-bottom-1'} side-px pb-3 has-line-level-1 ${vnode.attrs.class || ''}` }, [
            // 来源 没有guid则自己发的红包
            !vnode.attrs.guid ? m('div', { class: `pt-5 has-text-level-1` }, I18n.$t('20012'/* 您发送的 */))
            // vnode.attrs.guid === globalModels.getAccount().uid ? m('div', { class: `pt-5 has-text-level-1` }, "您发送的")
                : m('div', { class: `pt-5 has-text-level-1` }, [
                    m('span', { class: `` }, I18n.$t('20013'/* 来自 */)),
                    m('span', { class: `has-text-primary` }, vnode.state.getFromName(vnode)),
                    m('span', { class: `` }, I18n.$t('20014'/* 的 */))
                ]),
            // 红包类型 type 0:为拼手气 / >0:普通红包
            m('div', { class: `title-medium mb-3 has-text-level-1` }, vnode.state.getType(vnode)),
            // 留言 des
            m('div', { class: `has-text-level-3 ${(vnode.attrs.msg2 || vnode.attrs.quota) ? 'mb-5' : ''}` }, vnode.attrs.des),
            // img
            // m('iframe', { src: require("@/assets/img/people.svg").default, width: "110", height: "110", class: "mt-3 mb-7" }),
            // 提示2
            vnode.attrs.msg2 ? m('div', { class: ` has-text-level-4` }, vnode.attrs.msg2) : '',
            // 金额
            (vnode.attrs.quota && vnode.attrs.coin) ? m('div', { class: `has-text-primary title-medium` }, `${utils.toFixedForFloor(vnode.attrs.quota, 4)} ${vnode.attrs.coin}`) : '',
            // 提示消息
            vnode.attrs.msg ? m('div', { class: `has-text-level-4` }, vnode.attrs.msg) : ''
        ]);
    }
};