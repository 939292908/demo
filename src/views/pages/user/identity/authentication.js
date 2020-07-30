// 个人总览页面内模块>合约账户

let m = require('mithril')
const { call } = require('file-loader')

require('@/styles/identity/authentication.css')

let authentication = {
    num: 0,
    step: 1,
    stepOne: function () {
        return m('div',[
            m('div.head-label',[
                m('span.personal',['个人身份认证']),
                m('span',{class: authentication.num ? 'display' : 'nodisplay'},['梁明'])
            ]),
            m('div.describe',['请注意验证信息已经认证不能修改，请务必如实填写准确信息']),
            m('div',{class:'step'},[
                m('span',{class: authentication.step ? 'is-warning': 'is-warnings'},[authentication.step ? 'Lv1基础认证' : m('span',['ssLv1基础认证'])]),
                m('span',{class: authentication.step ? 'is-warning': 'is-warnings'},['Lv2高级认证']),
                m('span',{class: authentication.step ? 'is-warning': 'is-warnings'},['Lv3视频认证']),
            ])
        ])
    }
}

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.identity-authentication',{style:'width:70%'},[
            authentication.stepOne()
        ])
    }
}