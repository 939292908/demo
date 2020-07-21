let m = require('mithril')
// 主题颜色
import "@/styles/styles"
// UI库
import '@/styles/bluma.sass'
// 公用样式
import '@/styles/common.css'

// log日志管理
import _console from '@/log/log'
window._console = new _console()

// 全局广播
import broadcast from '@/libs/broadcast'
window.gBroadcast = new broadcast()

import i18n from '@/languages/dI18n'
window.gI18n = new i18n()

import utils from '@/util/utils'
window.utils = utils

// 请求接口配置
import Conf from "@/api/apiConf"
let instConf = new Conf(process.env.BUILD_ENV)
let api = instConf.GetActive()
instConf.updateNetLines()

window._console.log('ht',api)

// 全局API请求
let webApi = require('@/api/webApi')
window.gWebApi = new webApi({baseUrl: api.WebAPI})



// gBroadcast.onMsg({
//     key: 'index',
//     cmd: 'onOrder',
//     cb: function(res){
//         window._console.log('ht','index onOrder', res)
//     }
// })

// gBroadcast.onMsg({
//     key: 'index',
//     cmd: 'tick',
//     cb: function(res){
//         window._console.log('ht','index tick', res)
//     }
// })

// gBroadcast.onMsg({
//     key: 'index1',
//     cmd: 'onOrder',
//     cb: function(res){
//         window._console.log('ht','index1 onOrder', res)
//     }
// })


let root = document.body

let index = require('@/views/index')

m.mount(root,index)

require('@/route/index')