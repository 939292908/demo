// 账户交易>合约账户
const m = require('mithril')

require('@/styles/Myassets/tradingAccount_contract.css')

let contract = {
    currency:'BTC',
    setCurrency:function(param){
        this.currency = param;
    },
    contractList:[],
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
            contract.contractList = contract.copyAry(res.assetLists01)
            m.redraw();
        });
    },
    contractIndex:function(){
        return m('div.tradingAccount_contract',[
            m('div',{class:'tradingAccount_contract-nav'},[
                m('div',{},[m('input[type=checkbox]'),m('span',{},'隐藏0资产')]),
                m('div',{},[m('img',{src:'zijinjilu'}),m('span',{},'资金记录')]),
                m('div',{},[m('img',{src:'yingkuifenxi'}),m('span',{},'盈亏分析')]),
                m('div',{style:{marginLeft:'auto'}},[m('span',{},'合约账户'+contract.currency)]),
            ]),
            m('div',{},[
                m('table',{style:{border:'1px solid #ccc'}},[
                    m('tr',{},[
                        m('thead',{},[
                            m('td',{},'币种'),
                            m('td',{},'账户权益'),
                            m('td',{},'未实现盈亏'),
                            m('td',{},'可用保证金'),
                            m('td',{},this.currency+'估值'),
                            m('td',{},'操作'),
                        ]),
                        contract.contractList.map(item => {
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
            key: 'tradingAccount_contract',
            cmd: gBroadcast.CHANGE_SW_CURRENCY,
            cb: function(arg){
                contract.setCurrency(arg);
            } 
        })
        contract.initTableData()
    },
    view: function () {
        return m('div',{class:'contract'},[
            contract.contractIndex()
        ])
    },
    onremove:function(){
        gBroadcast.offMsg({
            key: 'tradingAccount_contract',
            isall: true
        })
    }
}