//合约账单

let m = require("mithril")

import Header from "../common/Header_m"
import netLines from '../network/netLines'

let obj = {
    count: 10,
    intervalId: null,
    // 获取线路数据
    initLinesData () {
        gEVBUS.emit(gEVBUS.EV_OPEN_NET_SWITCH, { Ev: gEVBUS.EV_OPEN_NET_SWITCH, lines: true })
        m.redraw()
        console.log(" --------- init 线路 ---------")
    },
    // 开始 倒计时
    openTiming () {
        if ( obj.intervalId ) return;
        obj.intervalId = setInterval(() => {
            obj.count = obj.count > 0 ? obj.count - 1 :  10
            if ( obj.count == 0 ) obj.initLinesData()
            m.redraw()
        }, 1000);
    },
    // 重置 定时器器/倒计时等
    resetPage () {
        clearInterval(obj.intervalId);
        obj.intervalId = null;
        obj.count = 10;
    },
    initEVBUS () {
        //assetD合约详情全局广播
        if (this.EV_ASSETD_UPD_unbinder) this.EV_ASSETD_UPD_unbinder()
        this.EV_ASSETD_UPD_unbinder = window.gEVBUS.on( gMkt.EV_ASSETD_UPD, arg => {
            obj.initLinesData()
            obj.openTiming()
        } )
    },
    rmEVBUS () {
        if (this.EV_ASSETD_UPD_unbinder) this.EV_ASSETD_UPD_unbinder()
    }
}

export default {
    oninit: function (vnode) {
    },
    oncreate: function (vnode) {
        obj.initEVBUS()
    },
    view: function (vnode) {
        return m('div', { class: `switchLines-page` }, [
            m( Header, {
                slot: {
                    center: `切换线路 (${obj.count})` //"切换线路"
                }
            }),
            m('div', { class: `pub-layout-m` }, m(netLines))
        ])
    },
    onremove: function (vnode) {
        obj.rmEVBUS()
        obj.resetPage()
    }
}