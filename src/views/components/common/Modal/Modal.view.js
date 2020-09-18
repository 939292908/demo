// {
//     isShow : true, // 显示隐藏
//     onOk () {}, // 确认事件 // 使用默认确认按钮
//     onClose () {}, // 关闭事件
//     slot:{ // 插槽
//         header,
//         body,
//         footer
//     },
//     width: '50%' // px 或 %
// }

require("./Modal.scss");
const m = require("mithril");
const I18n = require('@/languages/I18n').default;
module.exports = {
    // 底部按钮
    getFooter(vnode) {
        if (vnode.attrs.slot?.footer) { // 传入
            return vnode.attrs.slot.footer;
        } else { // 默认
            const closeBtn = vnode.attrs.onClose ? m("button", { class: "button is-primary font-size-2 modal-default-btn button-large is-outlined", onclick() { vnode.attrs.onClose(); } }, [
                '取消' // '取消'
            ]) : "";
            const okBtn = vnode.attrs.onOk ? m("button", { class: "button is-primary font-size-2 modal-default-btn button-large", onclick() { vnode.attrs.onOk(); } }, [
                I18n.$t('10337') // '确定'
            ]) : "";
            return [closeBtn, okBtn];
        }
    },
    view (vnode) {
        return m("div", { class: `my-modal modal theme--light ${vnode.attrs.class ? vnode.attrs.class : ''} ${vnode.attrs.isShow ? "is-active" : ''}` }, [
            m("div", { class: "modal-background" }),
            m("div", { class: "modal-card border-radius-medium-top px-3 py-2 has-bg-level-2", style: `width: ${vnode.attrs.width ? vnode.attrs.width : ''}` }, [
                // 头部
                m("header", { class: "modal-card-head has-bg-level-2 pa-0 pb-5" }, [
                    // 标题
                    m("p", { class: "modal-card-title title-medium" }, [
                        vnode.attrs.slot ? vnode.attrs.slot.header ? vnode.attrs.slot.header : ['头部标题'] : ['头部标题']
                    ]),
                    // 关闭按钮
                    m('i', { class: `iconfont cursor-pointer`, onclick() { vnode.attrs.updateOption(false); } }, '×')
                    // m("div", { class: "icomBox has-bg-level-1 cursor-pointer", onclick: vnode.attrs.onClose }, )
                ]),
                // 内容
                m("section", { class: "modal-card-body has-bg-level-2 pa-0" }, vnode.attrs.slot ? vnode.attrs.slot.body ? vnode.attrs.slot.body : ['内容部分'] : ['内容部分']),
                // 底部
                m("footer", { class: "modal-card-foot has-bg-level-2 pa-0" + ((vnode.attrs.slot?.footer || vnode.attrs.onOk || vnode.attrs.onClose) ? '' : ' is-hidden') },
                    vnode.state.getFooter(vnode)
                )
            ])
        ]);
    }
};