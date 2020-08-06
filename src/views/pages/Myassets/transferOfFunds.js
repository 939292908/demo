//资金划转
let m = require('mithril')

require('@/styles/Myassets/transferOfFunds.css')

let transferOfFunds = {
    transferOfFundsPage: function () {
        return m('div.transferOfFunds',{},[
            m('div.transferOfFunds-nav',{style:{height:'100px'}},[
                m('div',{class:'transferOfFunds-nav-first',style:{height:'40%'}},[
                    m('div',{class:'transferOfFunds-nav-first-my'},['我的资产']),
                    m('div',{class:'transferOfFunds-nav-first-record'},['资产记录'])
                ]),
                m('div',{class:'transferOfFunds-nav-second',style:{height:'60%'}},[
                    m('div',{class:'transferOfFunds-nav-second-one'},[
                        m('img',{src:'tibi',style:{marginRight:'20px'}},['']),
                        m('span',{},['资金划转'])
                    ]),
                ])
            ]),
            m('div.transferOfFunds-center',{style:{height:'330px',width:'50%'}},[
                m('div.transferOfFunds-center-type',{},[
                    m('span',{},['币种']),
                    m('br'),
                    m('select',{class:''},[
                        m('option','BtC   比特币'),
                        m('option','USDt  泰达币'),
                        m('option','EtH   以太坊')
                    ])
                ]),
                m('div.transferOfFunds-center-transformation',{},[
                    m('div.transferOfFunds-center-transformation-left',{},[
                        m('span',{},['从']),
                        m('input',{value:'我的钱包'},[])
                    ]),
                    m('div.transferOfFunds-center-transformation-center',{},[
                        m('img',{src:'zhuanhuan'},[])
                    ]),
                    m('div.transferOfFunds-center-transformation-right',{},[
                        m('span',{},['到']),
                        m('input',{value:'合约账户'},[])
                    ])
                ]),
                m('div.transferOfFunds-center-number',{},[
                    m('div',{},[
                        m('span',{},['数量']),
                        m('img',{src:'num'},[]),
                        m('div',{},[
                            m('input',{placeholder:'最小提币量：0.001',style:{paddingLeft:'10px'}},[]),
                            m('span',{},['BTC']),
                            m('span',{},['全部'])
                        ])
                    ]),
                    m('div',{},[
                        m('span',{},['可用：0.00000001 BtC']),
                    ])
                ]),
                m('div.transferOfFunds-center-btn',{},['确认'])
            ]),
            m('div.transferOfFunds-bottom',{style:{height:'350px'}},[
                m('div.transferOfFunds-bottom-record',{},[
                    m('div',{},[ 
                        m('span',{},['近期转账记录']),
                        m('img',{src:'tanhao'},[])
                    ]),
                    m('div',{style:{marginLeft:'auto'}},[
                        m('span',{},'全部记录')
                    ])
                ]),
                m('div.transferOfFunds-bottom-tab',{},[
                    m('table',{},[
                        m('thead',{},[
                            m('tr',{},[
                                m('td',{},['币种']),
                                m('td',{},['数量']),
                                m('td',{},['从']),
                                m('td',{},['到']),
                                m('td',{},['时间'])
                            ])
                        ]),
                        m('tbody',{},[
                            m('tr',{},[
                                m('td',{},['BtC']),
                                m('td',{},['0.01000000 BtC']),
                                m('td',{},['我的钱包']),
                                m('td',{},['合约账户']),
                                m('td',{},['2020-05-20 05:20:00']),
                            ])
                        ])
                    ])
                ])
            ])
        ])
    }
}

module.exports = {
    view: function () {
        return transferOfFunds.transferOfFundsPage();
    }
}