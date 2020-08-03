// https://mithril.js.org/simple-application.html
require('./styles/mystyles.scss');

import m from "mithril";

//////////////////////////////////////////////////////////////////////
require('./models/initEVBUS')

import utils from './utils/utils'
window.utils = utils

import config from './config'
window.$config = config
window.$config.future.UPNLPrzActive = utils.getItem("UPNLPrzActiveSeted")?utils.getItem("UPNLPrzActiveSeted"):window.$config.future.UPNLPrzActive
window.$theme = utils.getItem("theme") ? utils.getItem("theme") : config.theme
//////////////////////////////////////////////////////////////////////

// 多语言模块 start
import di18n from './languages/dI18n'
window.gDI18n = new di18n()
// 多语言模块 end

import Mkt from "./models/Mkt"
import rt_conf from "./reqConf/rt"
console.log(rt_conf.Mkt, rt_conf.Trd, rt_conf.Web)
// window.updateNetLines = rt_conf.Conf.updateNetLines
window.netConf = rt_conf.Conf
window.netConf.updateNetLines()
console.log(rt_conf)

let Interval = process.env.BUILD_ENV == 'dev'?1000:50
if (true) {
    let mkt = new Mkt(rt_conf.Mkt)
    window.gMkt = mkt    //全局变量
    setInterval(function () {
        mkt.stately.tick(mkt);
    }, Interval)
}
if (true) {
    let trd = new Mkt(rt_conf.Trd)
    window.gTrd = trd    //全局变量
    setInterval(function () {
        trd.stately.tick(trd);
    }, Interval)
}

import API from "./models/WebAPI"
if (true) {
    let instAPI = new API(rt_conf.Web)
    window.gWebAPI = instAPI
    setInterval(function () {
        instAPI.stately.tick(instAPI);
    }, Interval)
}



//////////////////////////////////////////////////////////////////////
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
window.gDriver = Driver
//////////////////////////////////////////////////////////////////////


//极验对象
require("../tplibs/geetest/gt");
window.gGeeTest = null;

// 复制到剪切板
/**
 * 拷贝到剪切板
 * @target 类名或者id，例如：".btn"
 */
import Clipboard from 'clipboard'
window.$copy = function(target, suc, err){
    let copyBtn = new Clipboard(target);
    copyBtn.on("success", function () {
        window.$message?window.$message({content: gDI18n.$t('10253'/*"已拷贝至剪切板！"*/), type: "success"}):''
        suc && suc()
        setTimeout(() => {
            copyBtn.destroy();
        }, 2000);
    });
    copyBtn.on("error", function () {
        window.$message?window.$message({content: gDI18n.$t('10254'/*"拷贝失败！"*/), type: "danger"}):''
        err && err()
        copyBtn.destroy();
    });
}

//////////////////////////////////////////////////////////////////////
//全局message事件
let DBG_MESSAGE = true
let DEL_INTERVAL = 5*1000
let EV_MESSAGE_UPD = 'EV_MESSAGE_UPD'
window.EV_MESSAGE_UPD = 'EV_MESSAGE_UPD'
window.$message = function({title = gDI18n.$t('10037'/*'提示'*/), content = '', type = 'dark'}){
    if(DBG_MESSAGE){console.log(__filename,"MESSAGE",{title, content})}
    gEVBUS.emit(EV_MESSAGE_UPD, {Ev: EV_MESSAGE_UPD, DEL_INTERVAL: DEL_INTERVAL, data: {title, content, type}})
}
//////////////////////////////////////////////////////////////////////

window.onresize = function(arg){
    // 判断是否是移动端
    if(config.mobile){
        window.isMobile = utils.isMobile()
    }
    gEVBUS.emit(gEVBUS.EV_ONRESIZE_UPD, {Ev: gEVBUS.EV_ONRESIZE_UPD})
}
// 判断是否是移动端
if(config.mobile){
    window.isMobile = utils.isMobile()
}

// require('./styles/theme.js')
import theme from './styles/theme.js'

window.themeColors = theme


//路由
// require('./route');
import('./views/index').then(arg=>{
    let root = document.body
    m.mount(root,arg.default)
    import('./route/index')
})


document.querySelector('body').setAttribute('id', window.$theme) // 设置主题







//登录类型处理
require('./tebecheck/login')

console.log(process.env.BUILD_ENV)




