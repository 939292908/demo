let m = require('mithril')
// 主题颜色
import("@/styles/index")
// UI库
import('@/styles/bluma.sass')
// 公用样式
import('@/styles/common.css')

// log日志管理
import _console from '@/log/log'
window._console = new _console()

// 全局广播
import broadcast from '@/broadcast/broadcast'
window.gBroadcast = new broadcast()

//多语言
import i18n from '@/languages/dI18n'
window.gI18n = new i18n()


//工具库
import utils from '@/util/utils'
window.utils = utils

// 请求接口配置
import Conf from "@/api/apiConf"
let instConf = new Conf(process.env.BUILD_ENV)
let api = instConf.GetActive()
instConf.updateNetLines()


// 全局API请求
let webApi = require('@/api/webApi')
window.gWebApi = new webApi({baseUrl: api.WebAPI})

window.onresize = function(arg){
    // 判断是否是移动端
    window.isMobile = utils.isMobile()
    gBroadcast.emit(gBroadcast.ONRESIZE_UPD, {Ev: gBroadcast.ONRESIZE_UPD})
}
// 判断是否是移动端
window.isMobile = utils.isMobile()


import('@/views/index').then(arg=>{
    let root = document.body
    m.mount(root,arg.default)
    import('@/route/index')
})

