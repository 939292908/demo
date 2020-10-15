// {
//     isShow : true, // 显示隐藏
//     onOk () {}, // 确认事件 // 使用默认确认按钮
//     onClose () {}, // 关闭事件
//     slot:{ // 插槽
//         header,
//         body,
//         footer,
//     },
//     content: '', // 内容
//     width: '50%' // px 或 %
// }

require("./Modal.scss");
const m = require("mithril");
const I18n = require('@/languages/I18n').default;
const Button = require('@/views/components/common/Button/Button.view');

module.exports = {
    // 底部按钮
    getFooter(vnode) {
        if (vnode.attrs.slot?.footer) { // 传入的底部
            return vnode.attrs.slot.footer;
        } else { // 默认底部
            const closeBtn = vnode.attrs.cancel ? m(Button, {
                class: "is-primary font-size-2 modal-default-btn is-outlined",
                label: vnode.attrs.cancel.label || I18n.$t('20035')/* 取消 */, // '取消'
                disabled: vnode.attrs.cancel.disabled,
                onclick() { vnode.attrs.cancel.onclick && vnode.attrs.cancel.onclick(); }
            }) : "";
            const okBtn = vnode.attrs.ok ? m(Button, {
                class: "is-primary font-size-2 modal-default-btn",
                label: vnode.attrs.ok.label || I18n.$t('20006'/* 确定 */),
                disabled: vnode.attrs.ok.disabled,
                loading: vnode.attrs.ok.loading,
                onclick() { vnode.attrs.ok.onclick && vnode.attrs.ok.onclick(); }
            }) : "";
            return [closeBtn, okBtn];
        }
    },
    view (vnode) {
        return m("div", { class: `my-modal modal theme--light ${vnode.attrs.content ? '' : 'my-modal-flex-end'} ${vnode.attrs.class ? vnode.attrs.class : ''} ${vnode.attrs.isShow ? "is-active" : ''}` }, [
            // 背景
            m("div", { class: "modal-background", onclick() { vnode.attrs.updateOption({ isShow: false }); } }),
            // 内容
            vnode.attrs.content ? vnode.attrs.content
                : m("div", { class: "modal-card border-radius-large-2-top px-6 py-3 has-bg-level-2", style: `width: ${vnode.attrs.width ? vnode.attrs.width : ''}` }, [
                // 头部
                    m("header", { class: "modal-card-head has-bg-level-2 pa-0 pb-5" + (vnode.attrs.slot.header ? '' : ' is-hidden') }, [
                    // 标题
                        m("p", { class: "modal-card-title title-medium has-text-level-1" }, [
                            vnode.attrs.slot ? vnode.attrs.slot.header ? vnode.attrs.slot.header : ['头部标题'] : ['头部标题']
                        ]),
                        // 关闭按钮
                        m('i', { class: `iconfont icon-close has-text-level-1`, onclick() { vnode.attrs.updateOption({ isShow: false }); } })
                    ]),
                    // 内容
                    m("section", { class: "modal-card-body has-bg-level-2 pa-0" }, vnode.attrs.slot ? vnode.attrs.slot.body ? vnode.attrs.slot.body : ['内容部分'] : ['内容部分']),
                    // 底部
                    m("footer", { class: "modal-card-foot has-bg-level-2 pa-0 mt-7" + ((vnode.attrs.slot?.footer || vnode.attrs.ok || vnode.attrs.cancel) ? '' : ' is-hidden') },
                        vnode.state.getFooter(vnode)
                    )
                ])
        ]);
    }
};