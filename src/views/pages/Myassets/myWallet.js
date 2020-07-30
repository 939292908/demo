let m = require('mithril')

require('@/styles/Myassets/myWallet.css')

let myWallet = {
    currency:'BTC',
    myWalletPage:function(){
        return m('div',{class:'myWallet-nav'},[
            m('div',{},[m('input[type=checkbox]'),m('span',{},'隐藏0资产')]),
            m('div',{},[m('img',{src:'zijinjilu'}),m('span',{},'资金记录')]),
        ]),
        m('div',{},[
            m('table',{style:{border:'1px solid #ccc'}},[
                m('tr',{},[
                    m('thead',{},[
                        m('td',{},'币种'),
                        m('td',{},'总额'),
                        m('td',{},'可用'),
                        m('td',{},'锁定'),
                        m('td',{},this.currency+'估值'),
                        m('td',{},'操作'),
                    ]),
                    m('tbody',{},[
                        m('td',{},'USDT'),
                        m('td',{},'1500.00000000'),
                        m('td',{},'1500.00000000'),
                        m('td',{},'0.00000000'),
                        m('td',{},'0.53514645 '+this.currency),
                        m('td',{},[
                            m('a',{},['充值']),
                            m('a',{},['提现']),
                            m('a',{},['划转'])
                        ]),
                    ])
                ])
            ])
        ])
    }
}

module.exports = {
    view: function () {
        return m('div',{class:'myWallet',style:{border:'1px solid red'}},[
            myWallet.myWalletPage()
        ])
        
    }
}