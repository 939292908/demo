var m = require("mithril")

let obj = {
    open: false,
    tabsActive: 0, //默认显示项

    //初始化全局广播
    initEVBUS: function () {
        let that = this
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
        this.EV_CHANGELOCALE_UPD_unbinder = window.gEVBUS.on(gDI18n.EV_CHANGELOCALE_UPD, arg => {
            that.initLanguage()
        })
    },
    //删除全局广播
    rmEVBUS: function () {
        //监听多元
        if (this.EV_CHANGELOCALE_UPD_unbinder) {
            this.EV_CHANGELOCALE_UPD_unbinder()
        }
    },
    //初始化多语言
    initLanguage: function () {
        
    },
}

export default {
    oninit: function (vnode) {

    },
    oncreate: function (vnode) {
        obj.initEVBUS()
    },
    view: function (vnode) {
        return m('div',"强平价格")
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
    },
}