// 个人总览页面内模块>资产总览菜单导航
let m = require('mithril')

let assetOverview = require('./myself/assetOverview');//资产总览
let myWallet = require('./myself/myWallet');//我的钱包
let contract = require('./myself/contract');//合约账户
let conins = require('./myself/coins');//币币账户
let legal = require('./myself/legal');//法币账户

let obj = {
    assetFlag:0,//右侧资产总览导航
    assetFlag:function(param){
        this.val = param;
    },
    switchPageWithAsset:function(){
        // val == 0 :'资产总览' val == 1 :'币币账户' val == 2 :'法币账户' val == 3 :'我的钱包' val == 4 :'合约账户'
        switch(this.val){
            case 0:
                return m(assetOverview)
            case 1:
                return m(myWallet)
            case 2:
                return m(contract)
            case 3:
                return m(coins)
            case 4:
                return m(legal)
        }
    }
}

module.exports = { 
    oncreate: function(){

    },
    view:function(){
        return m('div.container.right.money',{style:{border:'1px solid red'}},[
            m('span.container.right.money.tit','资产总览'),
            m('div.container.right.money.nav',[
                m('ul',[
                    m('li',{style:'float:left;margin-left:15px;'},'资产总览'),
                    m('li',{style:'float:left;margin-left:15px;'},'我的钱包'),
                    m('li',{style:'float:left;margin-left:15px;'},'合约账户'),
                    m('li',{style:'float:left;margin-left:15px;'},'币币账户'),
                    m('li',{style:'float:left;margin-left:15px;'},'法币账户'),
                    m('div',{style:{clear:'both'}}),
                ])
            ]),
            obj.switchPageWithAsset()
        ])
    }
}