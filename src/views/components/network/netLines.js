var m = require("mithril")

let obj = {
    // 线路
    netLines:[],
    // api测速结果
    apiResponseSpeed:[],
    // ws测速结果
    wsResponseSpeed:[],
    // 测速开始时间
    testStartTime: 0,
    //初始化全局广播
    initEVBUS: function(){
        let that = this
        // this.netLines = Conf.GetLines().netLines
        // console.log(Conf.GetLines())

        // this.testTick()

        // 线路更新全局广播
        if(this.EV_NET_LINES_UPD_unbinder){
            this.EV_NET_LINES_UPD_unbinder()
        }
        this.EV_NET_LINES_UPD_unbinder = window.gEVBUS.on(gEVBUS.EV_NET_LINES_UPD,arg=> {
            that.initLines()
        })

        // pc端显示线路切换通知
        if(this.EV_OPEN_NET_SWITCH_unbinder){
            this.EV_OPEN_NET_SWITCH_unbinder()
        }
        this.EV_OPEN_NET_SWITCH_unbinder = window.gEVBUS.on(gEVBUS.EV_OPEN_NET_SWITCH,arg=> {
            that.testTick()
        })
    },
    //删除全局广播
    rmEVBUS: function(){
        if(this.EV_NET_LINES_UPD_unbinder){
            this.EV_NET_LINES_UPD_unbinder()
        }
        if(this.EV_OPEN_NET_SWITCH_unbinder){
            this.EV_OPEN_NET_SWITCH_unbinder()
        }
    },
    initLines: function(){
        this.netLines = window.netConf.GetLines().netLines
        this.apiResponseSpeed = []
        this.wsResponseSpeed = []
        // this.testTick()
    },
    getLinesDom: function(){
        return this.netLines.map((item,i) =>{
            return m('a', {key: "pub-netlines-item"+i, class:"pub-netlines-item navbar-item"+(window.netConf.GetActive().Id == item.Id?" has-text-primary":"" ), onclick: function(){
                obj.setNetLine(item, i)
            }}, [
                item.Name,
                m('.spacer'),
                '延迟 '+(obj.apiResponseSpeed[i] || '--')+'/'+(obj.wsResponseSpeed[i] || '--')+' ms',
            ])
        })
    },
    setNetLine: function(param, idx){
        if(param.Id == window.netConf.GetActive().Id) return
        window.netConf.SetActive(idx)
        console.log(window.netConf, window.netConf.GetActive())

        window.gMkt.setSocketUrl(param.WSMKT)
        window.gTrd.setSocketUrl(param.WSTRD)
        window.gWebAPI.setWebApiUrl(param.WebAPI)
    },
    testTick: function() {
        let tm = Date.now()
        if(tm - this.testStartTime < 60 * 1000)return 
        this.testStartTime = Date.now();
        //ws测速
        this.testTradeNetSpeed();
        //api测速
        this.testHttpNetSpeed();
    },
    //ws测速
    testTradeNetSpeed: function() {
        let that = this
        this.wsResponseSpeed = [];
        let testWsList = []
        for(let i = 0; i < this.netLines.length; i++){
            let item = {
                trade:this.netLines[i].WSTRD
            }
            let testItem = new TradeNetSpeed(item);
            testItem.test().then(net => {
                // vm.$set(this.wsResponseSpeed, i, net.duration);
                that.wsResponseSpeed[i] = net.duration;
                console.log('----------ws test ok speeds----------: ', net.duration, net.name, that.wsResponseSpeed);
            }).catch(net => {
                that.wsResponseSpeed[i] = '--';
                console.log('----------ws test CANCEL speeds----------: ', net.duration, net.name, that.wsResponseSpeed);
            });
            testWsList.push(testItem)
        }
        // this.testWsList = testWsList
        // console.log('this.testWsList: ', this.testWsList.length);
    },
    //api测速
    testHttpNetSpeed: function() {
        let that = this
        this.apiResponseSpeed = [];
        // for(let item of this.netLines){
        for(let i = 0; i < this.netLines.length; i++){
            let item = {
                node:this.netLines[i].WebAPI
            }
            let netSpeed = new HttpNetSpeed(item);
            netSpeed.test().then(net => {
                // vm.$set(this.apiResponseSpeed, i, net.duration);
                that.apiResponseSpeed[i] = net.duration;
                console.log('**********api test ok speeds*********: ', net.duration, net.name, i, that.apiResponseSpeed);
            }).catch(net => {
                that.apiResponseSpeed[i] = '--';
                console.log('**********api test CANCEL speeds*********: ', net.duration, net.name, i, that.apiResponseSpeed);
            });
        }
    }
}

// import { Conf } from "../../../reqConf/Conf"

import HttpNetSpeed from '../../../libs/HttpNetSpeed';
import TradeNetSpeed from '../../../libs/TradeNetSpeed';

export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        obj.initEVBUS()
        obj.initLines()
    },
    view: function(vnode) {
        
        return m("div",{class:"pub-netlines"},[
            obj.getLinesDom()
        ])
    },
    onbeforeremove: function(){
        obj.rmEVBUS()
    }
}