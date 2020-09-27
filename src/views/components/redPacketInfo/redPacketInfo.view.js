const m = require('mithril');
// {
//     status: "", // 状态：0待领取，1已领完，2红包到期
//     count: "", // 总数
//     count2: "", // 未领数
//     quota: "", // 总额
//     quota2: "", // 未领额
//     coin: "" // 币种
// }
module.exports = {
    view(vnode) {
        // 待领取/红包到期
        if (vnode.attrs.status * 1 === 0 || vnode.attrs.status * 1 === 2) {
            return m('div', { class: `has-text-left mt-3 px-6` }, [
                `已领取${vnode.attrs.count - vnode.attrs.count2}/${vnode.attrs.count}个红包，共${vnode.attrs.quota - vnode.attrs.quota2}/${vnode.attrs.quota}${vnode.attrs.coin}`
            ]);
        }
        // 已领完
        if (vnode.attrs.status * 1 === 1) {
            return m('div', { class: `has-text-left mt-3 px-6` }, [
                `${vnode.attrs.count}个红包共${vnode.attrs.quota} ${vnode.attrs.coin}，${(vnode.attrs.otm - vnode.attrs.ctm) / 1000 / 60}分钟被抢光`
            ]);
        }
    }
};