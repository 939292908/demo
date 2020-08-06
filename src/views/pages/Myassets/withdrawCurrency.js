//提币
let m = require('mithril')

require('@/styles/Myassets/withdrawCurrency.css')

let withdrawCurrency = {
    withdrawPage: function () {
        return m('div.withdrawCurrency',{},[
            m('div.withdrawCurrency-nav',{style:{height:'100px'}},[
                m('div',{class:'withdrawCurrency-nav-first',style:{height:'40%'}},[
                    m('div',{class:'withdrawCurrency-nav-first-my'},['我的资产']),
                    m('div',{class:'withdrawCurrency-nav-first-record'},['资产记录'])
                ]),
                m('div',{class:'withdrawCurrency-nav-second',style:{height:'60%'}},[
                    m('div',{class:'withdrawCurrency-nav-second-one'},[
                        m('img',{src:'tibi'},['']),
                        m('span',{},['提币'])
                    ]),
                    m('div',{class:'withdrawCurrency-nav-second-two'},[
                        m('span',{},['内部转账']),
                        m('img',{src:'neibuzhuanzhang'},[''])
                    ])
                ])
            ]),
            m('div.withdrawCurrency-top',{style:{height:'330px',display:'flex'}},[
                m('div.withdrawCurrency-top-left',{style:{width:'50%',height:'100%'}},[
                    m('div.withdrawCurrency-top-left-type',{},[
                        m('span',{},['币种']),
                        m('br'),
                        m('select',{class:''},[
                            m('option','BTC   比特币'),
                            m('option','USDT  泰达币'),
                            m('option','ETH   以太坊')
                        ])
                    ]),
                    m('div.withdrawCurrency-top-left-address',{},[
                        m('div',{},[
                            m('span',{},['提币地址']),
                            m('span',{style:{marginLeft:'auto',color:'#FF8B00'}},['全部地址'])
                        ]),
                        m('select',{},[
                            m('option','18MrWUBMVRksAY83gxJ4F9xiprsR6fWanJ'),
                        ])
                    ]),
                    m('div.withdrawCurrency-top-left-number',{},[
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
                            m('span',{},['可提：0 BTC']),
                            m('span',{style:{marginLeft:'auto'}},['手续费：0.0001BTC'])
                        ])
                    ]),
                    m('div.withdrawCurrency-top-left-btn',{},['确认'])
                ]),
                m('div.withdrawCurrency-top-right',{style:{width:'45%',height:'100%',marginLeft:'auto'}},[
                    m('span',{},['温馨提示']),
                    m('img',{src:'tishitubiao'},[]),
                    m('br'),
                    m('span',{},['*如果您希望将本地数字资产提出至某地址,则该地址及为您的提币地址。某些地址可能需要您提供地址的标签，请务必填写，否则有丢失币的风险']),
                    m('br'),
                    m('span',{},['*填写错误可能导致资产损失，请仔细核对']),
                    m('br'),
                    m('span',{},['*完成LV3身份认证后，24h提币额度提升至100BTC,如需更多请联系客服']),
                ])
            ]),
            m('div.withdrawCurrency-bottom',{style:{height:'350px'}},[
                m('div.withdrawCurrency-bottom-record',{},[
                    m('div',{},[ 
                        m('span',{},['近期提币记录']),
                        m('img',{src:'tanhao'},[])
                    ]),
                    m('div',{style:{marginLeft:'auto'}},[
                        m('span',{},'全部记录')
                    ])
                ]),
                m('div.withdrawCurrency-bottom-tab',{},[
                    m('table',{},[
                        m('thead',{},[
                            m('tr',{},[
                                m('td',{},['币种']),
                                m('td',{},['类型']),
                                m('td',{},['数量']),
                                m('td',{},['手续费']),
                                m('td',{},['状态']),
                                m('td',{},['时间']),
                                m('td',{},['备注'])
                            ])
                        ]),
                        m('tbody',{},[
                            m('tr',{},[
                                m('td',{},['BTC']),
                                m('td',{},['提币']),
                                m('td',{},['0.01000000 BTC']),
                                m('td',{},['0.00000000 BTC']),
                                m('td',{},['待确认']),
                                m('td',{},['2020-05-20 05:20:00']),
                                m('td',{style:{color:'#FF8B00'}},['详情^'])
                            ])
                        ])
                    ])
                ]),
                m('div',{style:{border:'1px solid #ccc',height:'80px',paddingTop:'1%',paddingLeft:'5px'}},[
                    m('div',{style:{marginBottom:'10px'}},[
                        m('span',{style:{marginRight:'30px'}},['提币地址: 0x6e3729d1d77603a53c66ada8d66d5316efd44124']),
                        m('span',{},['链类型: usdterc20'])
                    ]),
                    m('div',{},[
                        m('span',{style:{marginRight:'30px'}},['区块链交易ID: 0x6e3729d1d77603a53c66ada8d66d5316efd44124']),
                        m('span',{},['memo: 1145623'])
                    ])
                ])
            ])
        ])
    }
}

module.exports = {
    view:function(){
        return withdrawCurrency.withdrawPage(); 
    }
}
