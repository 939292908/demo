let m = require('mithril')

require('@/styles/Myassets/myWallet.css')

let myWallet = {
    swValue:0,
    switchChange: function(val) {
        this.swValue = val
        console.log(val)
    },
    switchContent: function () {
        switch(this.swValue){
            case 0:
            // return m(0)
            case 1:
                // return(1)
        }
    },
    assetValuation: function () {
        return m('div',{class:'myWallet-warpper'},[
            m('div',{class:'myWallet-head columns'},[
                m('div',{class:'myWallet-head-left column',style:'border:1px solid red;'},[
                    m('div',{class:'myWallet-head-left-total columns'},[
                        m('span',{class:'',style:'padding:10px'},['总资产估值']),
                        m('span.navbar-item.has-dropdown.is-hoverable', {}, [
                            m('div.navbar-link', {}, [
                                'BTC'
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
                        m('span',{},['BTC']),
                        m('span',{},['图标'])
                    ])
                ]),
                m('div',{class:'myWallet-head-right column',style:'border:1px solid red; padding:20px;'},[
                    m('div',{class:'columns'},[
                        m('div',{class:'column'}),
                        m('button',{class:'has-bg-error column'},['充币']),
                        m('button',{class:'has-bg-error column'},['提币']),
                        m('button',{class:'has-bg-error column'},['资金划转'])
                    ])
                ])
            ]),
            m('div',{class:'myWallet-switch columns'},[
               m('div',{class:'my-wallet-first column',onclick:function(){
                myWallet.switchChange(0)
               },style:'border:1px solid red;'},['1']),
               m('div',{class:'myAccount column',onclick:function(){
                myWallet.switchChange(1)
               },style:'border:1px solid red;'},['2']),
               m('div',{class:'otherAccount column',onclick:function(){
                myWallet.switchChange(2)
               },style:'border:1px solid red;'},['3'])
            ]),
            m('div',{class:'hide'},[1]),
            myWallet.switchContent(),
        ])
    }
}
module.exports = {
    view: function () {
        return m('div',{class:'myWallet'},[
            myWallet.assetValuation()
        ])
        
    }
}