var m = require("mithril")

const EV_OPENVALIDATEMODE_UPD = 'EV_openValidateMode_UPD'


let obj = {
  validateStatus: 3, //0:不需要验证，1:手机验证， 2:谷歌验证，3:谷歌验证和手机验证
  open: false,
  tabsActive: 0,
  validateCallback: null,
  validateCloseCallback: null,
  oldParam: {},
  google: '',
  sms: '',
  inputMaxLength: 6,
  submitLoading: false,
  getSMSLoading: false,
  getSMSCodeWaitInterval: 60,
  SMSCodeCountDown: 0,
  SMSCodeCountDownTimer: null,
  //初始化全局广播
  initEVBUS: function () {
    let that = this

    if (this.EV_OPENVALIDATEMODE_UPD_unbinder) {
      this.EV_OPENVALIDATEMODE_UPD_unbinder()
    }
    this.EV_OPENVALIDATEMODE_UPD_unbinder = window.gEVBUS.on(EV_OPENVALIDATEMODE_UPD, arg => {
      that.open = true
      that.initLeverInfo(arg.param)
    })
  },
  //删除全局广播
  rmEVBUS: function () {
    if (this.EV_CHANGEACTIVEPOS_UPD_unbinder) {
      this.EV_CHANGEACTIVEPOS_UPD_unbinder()
    }
    if (this.EV_TICK_UPD_unbinder) {
      this.EV_TICK_UPD_unbinder()
    }
  },
  submit: function () {
    let that = this
    this.submitLoading = true
    switch(this.tabsActive){
      case 0:
        console.log('提交谷歌验证')
        window.gWebAPI.ReqGoogleVerify({
          code: this.google
        },function(arg){
          that.submitLoading = false
          if(arg.result.code == 0){
            that.open = false
            that.google = ''
            that.sms = ''
            that.validateCallback && that.validateCallback()
          }else{
            window.$message({title: utils.getWebApiErrorCode(arg.result.code), content: utils.getWebApiErrorCode(arg.result.code), type: 'danger'})
          }
        },function(err){
          that.submitLoading = false
          console.log('ReqGoogleVerify callback err', err)
        })
        
        break;
      case 1:
        console.log('提交手机验证')
        // this.submitLoading = false
        
        window.gWebAPI.ReqSMSVerify({
          phoneNum: this.phone,
          code: this.sms,
        },function(arg){
          that.submitLoading = false
          if(arg.result == 0 || arg.result.code == 0){
            that.open = false
            that.google = ''
            that.sms = ''
            that.validateCallback && that.validateCallback()
          }else{
            window.$message({title: utils.getWebApiErrorCode(arg.result.code), content: utils.getWebApiErrorCode(arg.result.code || arg.result), type: 'danger'})
          }
        },function(err){
          that.submitLoading = false
          console.log('ReqSMSVerify callback err', err)
        })
        break;
    }
    
  },
  setTabsActive: function (param) {
    this.tabsActive = param
    if(param == 0){
      // this.Lever = 0
    }else if(param == 1){
      // this.Lever = this.maxLever
    }
  },
  initLeverInfo: function (param) {
    this.validateStatus = param.status
    this.phone = param.phone
    switch(param.status){
      case 1:
        this.tabsActive = 1
        break;
      case 2:
        this.tabsActive = 0
        break;
      case 3:
        this.tabsActive = 0
        break;
      default:

    }
    this.validateCallback = param.confirmCallback
    this.validateCloseCallback = param.closeCallback
  },
  openValidateMode: function(param){
    /** param = {
      status: 1,//0:不需要验证，1:手机验证， 2:谷歌验证，3:谷歌验证和手机验证
      cb: function(){}
    }*/
    gEVBUS.emit(EV_OPENVALIDATEMODE_UPD, {Ev: EV_OPENVALIDATEMODE_UPD, param: param})
  },
  closeValidateMode: function(){
    this.open = false
    this.google = ''
    this.sms = ''
    this.inputMaxLength = 6
    this.submitLoading = false
    this.getSMSLoading = false
    this.validateCloseCallback && this.validateCloseCallback()
  },
  onSMSInput: function(e){
    if(e.target.value.toString().length >= this.inputMaxLength){
      this.sms = e.target.value.toString().substr(0,this.inputMaxLength)
      !this.submitLoading?this.submit():''
    }else{
      this.sms = e.target.value
    }
  },
  onGoogleInput: function(e){
    if(e.target.value.toString().length >= this.inputMaxLength){
      this.google = e.target.value.toString().substr(0,this.inputMaxLength)
      !this.submitLoading?this.submit():''
    }else{
      this.google = e.target.value
    }
  },
  getSMSCode: function(){
    let that = this
    this.getSMSLoading = true
    window.gWebAPI.ReqSMSVerifyCode({
        exChannel: window.$config.exchId,
        lang: 'zh'
    }, function(param){
        if(param.result.code == 0){
            that.getSMSLoading = false
            window.$message({title: gDI18n.$t('10208'/*'验证码发送成功！'*/), content: gDI18n.$t('10208'/*'验证码发送成功！'*/), type: 'success'})
            console.log(that)
            that.setCountDown()
        }else{
            window.$message({title: utils.getWebApiErrorCode(arg.result.code), content: utils.getWebApiErrorCode(res.result.code), type: 'danger'})
        }
        console.log('ReqSMSVerifyCode success ==>',param)
    }, function(error){
        that.getSMSLoading = false
        window.$message({title: gDI18n.$t('10205'/*'操作超时！'*/), content: gDI18n.$t('10205'/*'操作超时！'*/), type: 'danger'})
        console.log('ReqSMSVerifyCode => ', error)
    })
  },
  setCountDown: function(){
    let that = this
    that.SMSCodeCountDown = that.getSMSCodeWaitInterval
    that.SMSCodeCountDownTimer = setInterval(function(){
      that.SMSCodeCountDown --
      if(that.SMSCodeCountDown == 0){
        clearInterval(that.SMSCodeCountDownTimer)
        that.SMSCodeCountDownTimer = null
        m.redraw()  
      }
    }, 1000)
  }
}

export default {
  oninit: function (vnode) {

  },
  oncreate: function (vnode) {
    obj.initEVBUS()

    window.$openValidateMode = obj.openValidateMode
  },
  view: function (vnode) {

    return m('div', {class:'pub-validate'}, [
      m("div", { class: "pub-validate-model modal" + (obj.open ? " is-active" : ''), }, [
        m("div", { class: "modal-background" }),
        m("div", { class: "modal-card" }, [
          m("header", { class: "pub-validate-head modal-card-head" }, [
            m("p", { class: "modal-card-title"+(obj.validateStatus != 1?' is-hidden':'') }, [
              gDI18n.$t('10209')//'短信验证'
            ]),
            m("p", { class: "modal-card-title"+(obj.validateStatus != 2?' is-hidden':'') }, [
              gDI18n.$t('10210')//'谷歌验证'
            ]),
            m("p", { class: "modal-card-title"+(obj.validateStatus != 3?' is-hidden':'') }, [
              gDI18n.$t('10211')//'二次验证'
            ]),
            m("button", {
              class: "delete", "aria-label": "close", onclick: function () {
                obj.closeValidateMode()
              }
            }),
          ]),
          m("section", { class: "pub-validate-content modal-card-body" }, [
            m("div", { class: "pub-validate-content-tabs tabs "+(obj.validateStatus != 3?' is-hidden':'') }, [
              m("ul", [
                m("li", { class: "" + (obj.tabsActive == 0 ? ' is-active' : '') }, [
                  m("a", {
                    class: "", onclick: function () {
                      obj.setTabsActive(0)
                    }
                  }, [
                    gDI18n.$t('10210')//'谷歌验证'
                  ])
                ]),
                m("li", { class: "" + (obj.tabsActive == 1 ? ' is-active' : '') }, [
                  m("a", {
                    class: "", onclick: function () {
                      obj.setTabsActive(1)
                    }
                  }, [
                    gDI18n.$t('10209')//'短信验证'
                  ])
                ]),
              ])
            ]),

            m('div', { class: "pub-validate-content-google" + (obj.tabsActive != 0 ? " is-hidden" : '') }, [
              m('input', { class: "input", type: 'number', placeholder: gDI18n.$t('10212'/*'请输入谷歌验证码'*/), value: obj.google, oninput: function(e){
                obj.onGoogleInput(e)
              }}),
            ]),
            m('div', { class: "pub-validate-content-sms" + (obj.tabsActive != 1 ? " is-hidden" : '') }, [
              m('div', { class: "field has-addons" }, [
                m('div', { class: "control is-expanded" }, [
                  m('input', { class: "input ", type: 'number', placeholder: gDI18n.$t('10213'/*'请输入短信验证码'*/), value: obj.sms, oninput: function(e){
                    obj.onSMSInput(e)
                  }})
                ]),
                m('div', { class: "control" }, [
                  m('button', { class: "button"+(obj.getSMSLoading?' is-loading':''), disabled: !!obj.SMSCodeCountDown, onclick: function(){
                    obj.getSMSCode()
                  } }, [
                    obj.SMSCodeCountDown?obj.SMSCodeCountDown: gDI18n.$t('10214'/*'发送验证码'*/)
                  ]),
                ]),
              ])
            ]),
          ]),
          m("footer", { class: "pub-validate-foot modal-card-foot" }, [
            m("button", {
              class: "button is-success"+(obj.submitLoading?' is-loading':''), onclick: function () {
                obj.submit()
              }
            }, [
              gDI18n.$t('10051')//'确定'
            ]),
            m("button", {
              class: "button", onclick: function () {
                obj.closeValidateMode()
              }
            }, [
              gDI18n.$t('10052')//'取消'
            ]),
          ]),
        ])
      ])
    ])

  },
  onremove: function (vnode) {
    obj.rmEVBUS()
    window.$openValidateMode = null
  },
}