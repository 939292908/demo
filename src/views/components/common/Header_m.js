var m = require("mithril")
// {
//     class: "", // 添加类名
//     type : true, // 可自定义初始化type
//     onclick (type) {}, // 点击事件 type 为switch状态
// }
export default {

    oninit (vnode) {
    },
    oncreate (vnode) {
    },
    view (vnode) {
        return m("nav",{class:"pub-layout-m-header is-fixed-top navbar is-transparent", role:"navigation", "aria-label":"main navigation"},[
            m('div', {class:"navbar-brand is-flex"}, [
                m('a', {class:"navbar-item"}, [
                    m('a', {class:"", onclick () {
                        router.back()
                    }}, [
                    m('span', {class:"icon icon-right-i"}, [
                        m('i', {class:"iconfont iconarrow-left  has-text-black"}),
                    ]),
                    ]),
                ]),
                m('.spacer'),
                m("p",{class : "delegation-list-phistory navbar-item has-text-black"},[
                    "6666"
                    ]),
                m('.spacer'),
                m('a', {class:"navbar-item"}, [
                    m('a', {class:"icon icon-right-i navbar-item transform-for-icon",onclick: function(){
                        // obj.setType = true
                    }}, [
                        m('i', {class:"iconfont icontoolbar-side"}),
                    ]),
                ]),
            ]),
        ])
    },
    onbeforeremove (vnode) {

    }
}