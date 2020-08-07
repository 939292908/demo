//  个人总览页面内模块>资产总览菜单导航
const m = require('mithril');

let assetOverview = require('./assetOverview');// 资产总览
let myWallet = require('./myWallet');// 我的钱包
let contract = require('./contract');// 合约账户
let coins = require('./coins');// 币币账户
let legal = require('./legal');// 法币账户

let obj = {
    assetFlag:0,// 右侧资产总览导航
    setAssetFlag:function(param){
        this.assetFlag = param;
    },
    switchPageWithAsset:function(){
        //  assetFlag == 0 :'资产总览' assetFlag == 1 :'币币账户' assetFlag == 2 :'法币账户' assetFlag == 3 :'我的钱包' assetFlag == 4 :'合约账户'
        switch(this.assetFlag){
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
        return m('div.container.right.money',{style:{border:'1px solid #ccc',height:'140px'}},[
            m('span.container.right.money.tit','资产总览'),
            m('div.container.right.money.nav',[
                m('ul',[
                    m('li',{style:'float:left;margin-left:15px;cursor: pointer;',onclick:function(){obj.setAssetFlag(0)}},'资产总览'),
                    m('li',{style:'float:left;margin-left:15px;cursor: pointer;',onclick:function(){obj.setAssetFlag(1)}},'我的钱包'),
                    m('li',{style:'float:left;margin-left:15px;cursor: pointer;',onclick:function(){obj.setAssetFlag(2)}},'合约账户'),
                    m('li',{style:'float:left;margin-left:15px;cursor: pointer;',onclick:function(){obj.setAssetFlag(3)}},'币币账户'),
                    m('li',{style:'float:left;margin-left:15px;cursor: pointer;',onclick:function(){obj.setAssetFlag(4)}},'法币账户'),
                    m('div',{style:{clear:'both'}}),
                ])
            ]),
            obj.switchPageWithAsset()
        ]);
    }
};