let m = require('mithril')

require('@/styles/Myassets/myWalletIndex.css')

let tradingAccount = require('@/views/pages/Myassets/tradingAccount')
let myWallet = require('@/views/pages/Myassets/myWallet')

let myWalletIndex = {
    currency:'BTC',
    currencyChange:function(val){
        this.setCurrency(val);
        gBroadcast.emit({cmd:gBroadcast.CHANGE_SW_CURRENCY, data:val})
    },
    setCurrency:function(param){
        this.currency = param;
    },
    swValue:0,//0:我的钱包 1:交易账户 2:其他账户
    switchChange: function(val) {
        this.swValue = val
    },
    switchContent: function (){
        gBroadcast.emit({cmd:gBroadcast.CHANGE_SW_CURRENCY, data:this.currency})
        switch(this.swValue){
            case 0:
                return m(myWallet)
            case 1:
                return m(tradingAccount)
        }
    },
    assetValuation: function () {
        return m('div',{class:'myWalletIndex-warpper'},[
            m('div',{class:'myWalletIndex-nav columns-flex'},[
                m('div',{class:'myWalletIndex-nav-my'},['我的资产']),
                m('div',{class:'myWalletIndex-nav-record'},['资产记录'])
            ]),
            m('div',{class:'myWalletIndex-head columns-flex'},[
                m('div',{class:'myWalletIndex-head-left column',style:'border:1px solid red;'},[
                    m('div',{class:'myWalletIndex-head-left-total columns'},[
                        m('span',{class:'',style:'padding:10px'},['总资产估值']),
                        m('span.navbar-item.has-dropdown.is-hoverable', {}, [
                            m('select.select',{onchange:function(){myWalletIndex.currencyChange(this.value)}},[
                                m('option',{},['BTC']),
                                m('option',{},['USDT']),
                            ])
                        ])
                    ]),
                    m('div',{class:'number-hide'},[
                        m('span',{},['0.000000000']),
                        m('span',{},[this.currency]),
                        m('span',{},['图标']),
                        m('br'),
                        m('span',{},['≈ ']),
                        m('span',{},['0.00 ']),
                        m('span',{},['CNY']),
                    ])
                ]),
                m('div',{class:'myWalletIndex-head-right column',style:'border:1px solid red; padding:20px;'},[
                    m('div',{class:'columns'},[
                        m('div',{class:'column'}),
                        m('button',{class:'has-bg-error column',onclick:function(){window.open(require('@/views/pages/Myassets/myWalletIndex'))}},['充币']),
                        m('button',{class:'has-bg-error column'},['提币']),
                        m('button',{class:'has-bg-error column'},['资金划转'])
                    ])
                ])
            ]),
            m('div',{class:'myWalletIndex-switch columns-flex'},[
               	m('div',{class:'my-wallet-first column',onclick:function(){
                	myWalletIndex.switchChange(0)
               	},style:'border:1px solid red;'},[
                   m('span',{},['我的钱包']),
                   m('br'),
                   m('span',{},['0.00000000']),
                   m('span',{},[' '+this.currency])
               ]),
               	m('div',{class:'myAccount column',onclick:function(){
                	myWalletIndex.switchChange(1)
               	},style:'border:1px solid red;'},[
					m('div',{},[
                        m('span',{},['交易账户']),
                        m('br'),
                        m('span',{},['0.00000000']),
                        m('span',{},[' '+this.currency])
					]),
                   	m('div',{class:'desc'},['...'])
               	]),
               	m('div',{class:'otherAccount column',onclick:function(){
					// myWalletIndex.switchChange(2)
				},style:'border:1px solid red;'},[
					m('div',{},[
                        m('span',{},['其他账户']),
                        m('br'),
                        m('span',{},['0.00000000']),
                        m('span',{},' '+this.currency)
					]),
                   	m('div',{class:'desc'},['...'])
				])
            ]),
            myWalletIndex.switchContent(),
        ])
    }
}
module.exports = {
    view: function () {
        return m('div',{class:'myWalletIndex'},[
            myWalletIndex.assetValuation()
        ])
    }
}