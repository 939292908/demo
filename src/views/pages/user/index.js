let m = require('mithril')

let personal = require('./myself/personal');
let accountSecurity = require('./accountVerify/accountSecurity');

// let closeGoogleVerify = require('./accountVerify/closeGoogleVerify');
// let modifyLoginPwd = require('./accountVerify/modifyLoginPwd');
// let fishCode = require('./accountVerify/fishCode');
// let modifyFishCode = require('./accountVerify/modifyFishCode');
// let modifyMoneyPwd = require('./accountVerify/modifyMoneyPwd');
// let mobileVerify = require('./accountVerify/mobileVerify');
// let mailboxVerify = require('./accountVerify/mailboxVerify');

let obj = {
    menuVal:0,//左侧菜单导航
    assetFlag:0,//右侧资产总览导航
    setMenuVal:function(param){
        this.val = param;
    },
    switchPageWithLeft:function(){
        // val == 0 :'个人总览' val == 1 :'账户安全' val == 2 :'身份认证' val == 3 :'API管理' val == 4 :'邀请返佣'
        switch(this.val){
            case 0:
                return m(personal)
            case 1:
                return m(accountSecurity)
            case 2:
                // return m(personal)
            case 3:
                // return m(personal)
            case 4:
                // return m(personal)
        }
    },
    assetFlag:function(param){
        this.val = param;
    },
    switchPageWithLeft:function(){
        // val == 0 :'个人总览' val == 1 :'账户安全' val == 2 :'身份认证' val == 3 :'API管理' val == 4 :'邀请返佣'
        switch(this.val){
            case 0:
                return m(personal)
            case 1:
                return m(accountSecurity)
            case 2:
                // return m(personal)
            case 3:
                // return m(personal)
            case 4:
                // return m(personal)
        }
    }
}

module.exports = {
    oncreate: function(){

    },
    view:function(){
        return m('div.container', [
            m('aside.container.left.menu',{style:{width:'30%',float:'left',border:'1px solid red'}},[
                m('ul.menu-list',[
                    m('li',{onclick:function(){obj.setMenuVal(0)}},[
                        m('a',{class:""+(obj.val == 0?"is-active":'')},'个人总览')
                    ]),
                    m('li',{onclick:function(){obj.setMenuVal(1)}},[
                        m('a',{class:""+(obj.val == 1?"is-active":'')},'账户安全')
                    ]),
                    m('li',{onclick:function(){obj.setMenuVal(2)}},[
                        m('a',{class:""+(obj.val == 2?"is-active":'')},'身份认证')
                    ]),
                    m('li',{onclick:function(){obj.setMenuVal(3)}},[
                        m('a',{class:""+(obj.val == 3?"is-active":'')},'API管理')
                    ]),
                    m('li',{onclick:function(){obj.setMenuVal(4)}},[
                        m('a',{class:""+(obj.val == 4?"is-active":'')},'邀请返佣')
                    ])
                ])
            ]),
            obj.switchPageWithLeft(),
            m('div',{style:{clear:'both'}}),
        ])
    }
}