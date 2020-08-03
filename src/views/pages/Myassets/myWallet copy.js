let m = require('mithril')

require('@/styles/Myassets/myWallet.css')
// import Table from './Table' // 表格
let Table = require('@/views/pages/Myassets/Table.js')

let myWallet = {
    tableColumns: [], // 表头
    tableData: [], // 表格
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
    initTableColumns:function(){
        myWallet.tableColumns = [
            {
                title: '币种',
                align: 'left',
                class:'table-header',
                key: 'wType',
            },
            {
                title: '总额',
                key: 'Num',
                render (params) { // 自定义 列内容
                    return m('div', [
                        params.Num+''+myWallet.currency
                    ])
                }
            },
            {
                title: '可用',
                key: 'wType'
            },
            {
                title: '锁定',
                key: 'wType'
            },
            {
                title: this.currency+'估值',
                key: 'wType'
            },
            {
                title: '操作', // 表头文字
                render (params) { // 自定义 列内容
                    return m('div', [
                        m('a',{},['充值']),
                        m('a',{},['提现']),
                        m('a',{},['划转'])
                    ], params.state)
                }
            },
            {
            },
        ]
    },
    ininTableData:function(){
        gWebApi.getWallet({
            exChange: window.exchId
        }, function(res){
            myWallet.tableData = myWallet.copyAry(res.assetLists03)
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
                // 表格
                m(Table, {
                    columns: myWallet.tableColumns,
                    data: myWallet.tableData,
                    class:'myWallet-table',
                    defaultColumnWidth:190
                }),
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
                myWallet.initTableColumns();
            } 
        })
        console.log(myWallet.tableData)
        myWallet.ininTableData();
        myWallet.initTableColumns();
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