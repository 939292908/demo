var m = require("mithril")
let md5 = require('md5')

import { GeeTest } from "../../../libs/geetestEx"

let loginGeeTest = null;

function AffirmGeeTest(props) {
    if (loginGeeTest ==null) {
        loginGeeTest = new GeeTest(props)
    }
    return loginGeeTest
}

let obj = {
    open: false,
    loginType: "email",
    userName: '',
    password: '',
    gt: null,
    loginLoading: false,
    initGeeTest: function(){
        let that = this
        this.gt = AffirmGeeTest(
            {
                url: gWebAPI.Url_GT_REGISTER(),
                urlValidate:gWebAPI.Url_GT_VALIDATE(),
                onSuccess:function () {
                    that.login()
                }
                ,onCancel:function () {
                    that.loginLoading = false
                }
            });
        this.gt.initVerifyGee();

    },
    submit: function(){
        if(!this.userName || !this.password){
            console.log('请输入账号和密码')
            return
        }
        this.loginLoading = true
        this.gt.Verify()
    },
    login: function(){
        let that = this
        if (/@/.test(this.userName)) {
            this.loginType = "email";
        } else {
            this.loginType = "phone";
        }
        window.gWebAPI.ReqUserLoginCheck({
            loginType: this.loginType,
            loginName: this.userName,
            pass: md5(this.password),
            exChannel: window.$config.exchId//
        }, function(res){
            console.log('ReqUserLoginCheck success ==>> ',res)
            if(res.result.code == 0){
                switch(res.result.tfa){
                    case 0:
                        that.getUserInfo()
                        break;
                    case 1:
                    case 2:
                    case 3:
                        that.loginLoading = false;
                        that.open = false
                        window.$openValidateMode({
                            status: res.result.tfa, 
                            googleId: res.result.googleId,
                            loginSms: res.result.loginSms,
                            phone: res.result.phone,
                            confirmCallback: function(){
                                that.loginWeb()
                            },
                            closeCallback: function(){
                                that.open = true
                            }
                        })
                        break;
                    default:
                        $message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10203'/*'未知错误'*/), type: 'danger'});
                        that.loginLoading = false;
                }
            }else{
                that.loginLoading = false
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getWebApiErrorCode(res.result.code), type: 'danger'})
            }
        }, function(err){
            that.loginLoading = false
                window.$message({ content: gDI18n.$t('10037'/*"提示"*/), type: 'danger'})
            console.log('ReqUserLoginCheck => ', err)
        })
    },
    loginWeb: function(){
        let that = this
        window.gWebAPI.ReqUserLoginWeb({
            loginType: this.loginType,
            loginName: this.userName,
            pass: md5(this.password),
            exChannel: window.$config.exchId
        }, function(arg){
            that.loginLoading = false
            if(arg.result.code == 0){
                that.getUserInfo()
            }else{
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getWebApiErrorCode(res.result.code), type: 'danger'})
            }
        }, function(err){
            console.log('ReqUserLoginWeb => ', err)
        })
    },
    getUserInfo: function(){
        let that = this
        window.gWebAPI.ReqUserInfo({}, function(param){
            if(param.result.code == 0){
                that.closeMode()
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10204'/*'登录成功！'*/), type: 'success'})
                utils.setItem('login-user-name', param.account.accountName)
            }else{
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: utils.getWebApiErrorCode(res.result.code), type: 'danger'})
            }
            
            console.log('ReqUserInfo success ==>',param)
            m.redraw()
        }, function(error){
            that.loginLoading = false
                window.$message({ title: gDI18n.$t('10037'/*"提示"*/), content: gDI18n.$t('10205'/*'操作超时！'*/), type: 'danger'})
            console.log('ReqUserInfo => ', error)
        })
    },
    //初始化全局广播
    initEVBUS: function(){
        let that = this
        
        if(this.EV_OPENLOGINMODE_unbinder){
            this.EV_OPENLOGINMODE_unbinder()
        }
        this.EV_OPENLOGINMODE_unbinder = window.gEVBUS.on(gWebAPI.EV_OPENLOGINMODE,arg=> {
            that.open = true
        })
        
        
    },
    //删除全局广播
    rmEVBUS: function(){
        if(this.EV_OPENLOGINMODE_unbinder){
            this.EV_OPENLOGINMODE_unbinder()
        }
    },
    openLoginMode: function(){
        this.open = !this.open
        let userName = utils.getItem('login-user-name')
        if(userName){
            this.userName = userName
        }
    },
    closeMode: function(){
        this.open = false
        this.loginLoading = false
        this.userName = ''
        this.password = ''
    }
}

export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        obj.initEVBUS()
        obj.initGeeTest()
    },
    view: function(vnode) {
        
        return m('div', {class:'pub-login'}, [
            m('button', {class: "pub-login-btn button is-primary has-text-white is-hidden-touch", onclick: function(){
                obj.openLoginMode()
            }}, [
                gDI18n.$t('10136')//'登录'
            ]),
            m("div",{class:"pub-login-mpdel modal"+ (obj.open?" is-active":''),},[
                m("div",{class:"modal-background"}),
                m("div",{class:"modal-card"},[
                    m("header",{class:"pub-login-head modal-card-head"},[
                        m("p",{class:"modal-card-title"},[
                            gDI18n.$t('10136')//'登录'
                        ]),
                        m("button",{class:"delete", "aria-label":"close", onclick: function(){
                            obj.closeMode()
                        }}),
                    ]),
                    m("section",{class:"pub-login-content modal-card-body"},[
                        m(".field",{},[
                            m("div",{class:"control has-icons-right"},[
                                m("input",{
                                    class:"input", 
                                    type:"text", 
                                    placeholder: gDI18n.$t('10206'/*"请输入邮箱或者手机号"*/), 
                                    value: obj.userName,
                                    oninput: function(e) {
                                        obj.userName = e.target.value
                                    }
                                }),
                            ]),
                        ]),
                        m(".field",{},[
                            m("div",{class:"control has-icons-right"},[
                                m("input",{
                                    class:"input", 
                                    type:"password", 
                                    placeholder: gDI18n.$t('10207'/*"请输入登录密码"*/), 
                                    value: obj.password,
                                    oninput:function(e) {
                                        obj.password = e.target.value
                                    }
                                }),
                            ]),
                        ]),
                    ]),
                    m("footer",{class:"pub-login-foot modal-card-foot pl-30"},[
                        m("button",{class:"button is-primary has-text-white"+(obj.loginLoading?" is-loading":""), onclick: function(){
                            obj.submit()
                        }},[
                            gDI18n.$t('10136')//'登录'
                        ]),
                        m("button",{class:"button border-4", onclick: function(){
                            obj.closeMode()
                        }},[
                            gDI18n.$t('10052')//'取消'
                        ]),
                    ]),
                ]) 
            ])
        ])
        
    },
    onremove: function(vnode) {
        obj.rmEVBUS()
        obj.gt?obj.gt.destroy():''
    },
}