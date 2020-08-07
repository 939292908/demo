const m = require('mithril')

require('@/styles/Myassets/myWallet.css')

let myWallet = {
    currency:'BTC',
    setCurrency:function(param){
        this.currency = param;
    },
    assetList:[],
    copyAry:function(ary) {
        let res = []
        for (let i = 0; i < ary.length; i++) {
            res.push(ary[i])
        }
        return res;
    },
    initAssetList:function(){
        gWebApi.getWallet({
            exChange: window.exchId
        }, function(res){
            myWallet.assetList = myWallet.copyAry(res.assetLists03)
            m.redraw();
        });
    },
    myWalletPage:function(){
        return m('div',[
            m('div',{class:'myWallet-nav'},[
                m('div',{},[m('input[type=checkbox]'),m('span',{},'隐藏0资产')]),
                m('div',{},[m('img',{src:'zijinjilu'}),m('span',{},'资金记录')]),
            ]),
            m('div',{},[
                m('table',{style:{border:'1px solid #ccc'}},[
                    m('thead',{},[
                        m('tr',{},[
                            m('td',{},'币种'),
                            m('td',{},'总额'),
                            m('td',{},'可用'),
                            m('td',{},'锁定'),
                            m('td',{},this.currency+'估值'),
                            m('td',{},'操作'),
                        ])  
                    ]),
                    m('tbody',{},[
                        myWallet.assetList.map(item => {
                            return m('tr',{},[
                                m('td',{},item.wType),
                                m('td',{},item.pawnBal+item.mainLock+item.mainBal+item.financeBal+item.depositLock+item.actMainBal),
                                m('td',{},item.mainBal),
                                m('td',{},item.depositLock),
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
            key: 'myWallet',
            cmd: gBroadcast.CHANGE_SW_CURRENCY,
            cb: function(arg){
                myWallet.setCurrency(arg);
            } 
        })
        myWallet.initAssetList();
    },
    view: function () {
        return m('div',{class:'myWallet',style:{border:'1px solid red'}},[
            myWallet.myWalletPage()
        ])
        
    },
    oncreate:function(){
    },
    onremove:function(){
        gBroadcast.offMsg({
            key: 'myWallet',
            isall: true
        })
    }
}