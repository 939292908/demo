//账户交易>法币账户
let m = require('mithril')

require('@/styles/Myassets/tradingAccount_legal.css')

let legal = {
    currency:'BTC',
    setCurrency:function(param){
        this.currency = param;
    },
    legalList:[],
    copyAry:function(ary) {
        let res = []
        for (let i = 0; i < ary.length; i++) {
            res.push(ary[i])
        }
        return res;
    },
    initTableData:function(){
        gWebApi.getWallet({
            exChange: window.exchId
        }, function(res){
            legal.legalList = legal.copyAry(res.assetLists04)
            m.redraw();
        });
    },
    legalIndex:function(){
        return m('div',[
            m('div',{class:'tradingAccount_legal-nav'},[
                m('div',{},[m('input[type=checkbox]'),m('span',{},'隐藏0资产')]),
                m('div',{},[m('img',{src:'zijinjilu'}),m('span',{},'资金记录')]),
                m('div',{style:{marginLeft:'auto'}},[m('span',{},'法币账户'+legal.currency)]),
            ]),
            m('div',{},[
                m('table',{style:{border:'1px solid #ccc'}},[
                    m('tr',{},[
                        m('thead',{},[
                            m('td',{},'币种'),
                            m('td',{},'总额'),
                            m('td',{},'可用'),
                            m('td',{},'冻结'),
                            m('td',{},this.currency+'估值'),
                            m('td',{},'操作'),
                        ]),
                        legal.legalList.map(item => {
                            return m('tr',{},[
                                m('td',{},item.wType),
                                m('td',{},'1500.00000000'),
                                m('td',{},'1500.00000000'),
                                m('td',{},'0.00000000'),
                                m('td',{},'0.53514645 '+this.currency),
                                m('td',{},[
                                    m('a',{},['充值']),
                                    m('a',{},['提现']),
                                    m('a',{},['划转'])
                                ])
                            ])
                        })
                    ])
                ])
            ])
        ])
    }
}
module.exports = {
    oninit: function(){
        gBroadcast.onMsg({
            key: 'tradingAccount_legal',
            cmd: gBroadcast.CHANGE_SW_CURRENCY,
            cb: function(arg){
                legal.setCurrency(arg);
            } 
        })
        legal.initTableData();
    },
    view: function () {
        return m('div',{class:'legal'},[
            legal.legalIndex()
        ])
    },
    onremove:function(){
        gBroadcast.offMsg({
            key: 'tradingAccount_legal',
            isall: true
        })
    }
}