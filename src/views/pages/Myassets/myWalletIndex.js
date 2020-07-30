let m = require('mithril')

require('@/styles/Myassets/myWalletIndex.css')

let tradingAccount = require('@/views/pages/Myassets/tradingAccount')

let myWalletIndex = {
    currency:'BTC',
    swValue:0,//0:我的钱包 1:交易账户 2:其他账户
    switchChange: function(val) {
        this.swValue = val
    },
    switchContent: function (){
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
                            m('div.navbar-link', {}, [
                                this.currency
                            ]),
                            m('div.navbar-dropdown', {}, [
                                m('a.navbar-item', {}, [
                                    'About'
                                ]),
                                m('a.navbar-item', {}, [
                                    'Content'
                                ]),
                                m('a.navbar-item', {}, [
                                    'Report an issue'
                                ]),
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
                        m('button',{class:'has-bg-error column'},['充币']),
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
					myWalletIndex.switchChange(2)
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
            // m('div',{class:'hide'},[1]),
            myWalletIndex.switchContent(),
        ])
    }
}
module.exports = {
    view: function () {
        return m('div',{class:'myWalletIndex'},[
            myWallet.myWalletPage()
        ])
        
    }
}