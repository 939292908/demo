// https://mithril.js.org/simple-application.html
require('./styles/mystyles.scss');

import m from "mithril";

if (true) {
    m.route.prefix='#!'
}
//////////////////////////////////////////////////////////////////////
import EVBUS  from './libs/evbus'
window.gEVBUS = new EVBUS();

import utils from './utils/utils'
window.utils = utils

import config from './config'
window.$config = config
//////////////////////////////////////////////////////////////////////

import Mkt from "./models/Mkt"
import rt_conf from "./reqConf/rt"
if (true) {
    let mkt = new Mkt(rt_conf.Mkt)
    window.gMkt = mkt    //全局变量
    setInterval(function () {
        mkt.stately.tick(mkt);
    }, 1000)
}
if (true) {
    let trd = new Mkt(rt_conf.Trd)
    window.gTrd = trd    //全局变量
    setInterval(function () {
        trd.stately.tick(trd);
    }, 500)
}

import { API } from "./models/WebAPI"
if (true) {
    window.gWebAPI = API
    setInterval(function () {
        API.stately.tick(API);
    }, 100)
}



//////////////////////////////////////////////////////////////////////
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
window.gDriver = Driver
//////////////////////////////////////////////////////////////////////

//极验对象
require("../tplibs/geetest/gt");
window.gGeeTest = null;

//////////////////////////////////////////////////////////////////////
//全局message事件
let DBG_MESSAGE = true
let DEL_INTERVAL = 5*1000
let EV_MESSAGE_UPD = 'EV_MESSAGE_UPD'
window.EV_MESSAGE_UPD = 'EV_MESSAGE_UPD'
window.$message = function({title = '提示', content = '', type = 'dark'}){
    if(DBG_MESSAGE){console.log(__filename,"MESSAGE",{title, content})}
    gEVBUS.emit(EV_MESSAGE_UPD, {Ev: EV_MESSAGE_UPD, DEL_INTERVAL: DEL_INTERVAL, data: {title, content, type}})
}
//////////////////////////////////////////////////////////////////////

// 判断是否是移动端
window.isModile = utils.isMobile()


//路由
require('./route');






//登录类型处理
require('./tebecheck/login')

console.log(process.env.BUILD_ENV)




