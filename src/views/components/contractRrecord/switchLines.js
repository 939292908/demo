//合约账单

let m = require("mithril")


let obj = {
    count: 10,
    intervalId: null,
    // 获取线路数据
    init () {
        gEVBUS.emit(gEVBUS.EV_OPEN_NET_SWITCH, { Ev: gEVBUS.EV_OPEN_NET_SWITCH, lines: true })
        m.redraw()
        console.log(" --------- init 线路 ---------")
    },
    // 倒计时
    setCount () {
        if ( obj.intervalId ) return;
        obj.intervalId = setInterval(() => {
            obj.count = obj.count > 0 ? obj.count - 1 :  10
            if ( obj.count == 0 ) obj.init()
            m.redraw()
            // console.log('count',obj.count);
        }, 1000);
    },
    // 重置 定时器器/倒计时等
    reset () {
        clearInterval(obj.intervalId);
        obj.intervalId = null;
        obj.count = 10;
    }
}
import netLines from '../network/netLines'

export default {
    oninit: function (vnode) {
    },
    oncreate: function (vnode) {
        obj.init()
        obj.setCount()
        // document.querySelector('.delegation-list-phistory').click()
    },
    view: function (vnode) {
        return m("div", { class: "details-header" }, [
            m("nav", { class: "pub-layout-m-header is-fixed-top navbar is-transparent", role: "navigation", "aria-label": "main navigation" }, [
                m('div', { class: "navbar-brand is-flex" }, [
                    m('a', { class: "navbar-item" }, [
                        m('a', {
                            class: "", onclick () { router.back() }
                        }, [
                            m('span', { class: "icon icon-right-i" }, [
                                m('i', { class: "iconfont has-text-black iconarrow-left" }),
                            ]),
                        ]),
                    ]),
                    m('.spacer'),
                    // onclick () { obj.init() }
                    m("p", { class: "delegation-list-phistory navbar-item has-text-black" }, [
                        `切换线路 (${obj.count})` //"切换线路"
                    ]),
                    m('.spacer'),
                    m('.spacer'),
                ]),
            ]),
            m('div', { class: "pub-layout-m" }, [
                m(netLines)
            ]),
        ])
    },
    onremove: function (vnode) {
        obj.reset();
    }
}