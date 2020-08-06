//充币
let m = require('mithril')

require('@/styles/Myassets/rechargeCurrency.css')

let rechargeCurrency = {
    rechargePage:function(){
        return m('div.rechargeCurrency',{},[
            m('div.rechargeCurrency-top',{},[
                m('div.rechargeCurrency-top-left',{},[
                    m('div',{class:'rechargeCurrency-nav'},[
                        m('div',{class:'rechargeCurrency-nav-my'},['我的资产']),
                        m('div',{class:'rechargeCurrency-nav-record'},['资产记录'])
                    ]),
                    m('div',{style:{marginBottom:'10px'}},[
                        m('img',{src:'fanhuitubiao'}),
                        m('span',{style:{fontSize:'20px'}},['充币'])
                    ]),
                    m('div',{},[
                        m('span',{},['币种']),
                        m('br'),
                        m('select',{class:'select'},[
                            m('option','BTC   比特币'),
                            m('option','USDT  泰达币'),
                            m('option','ETH   以太坊')
                        ])
                    ]),
                    m('div',{style:{marginBottom:'10px'}},[
                        m('span',{},['充币二维码']),
                        m('br'),
                        m('img',{src:'chongbierweima',style:{marginTop:'10px'}},[])
                    ]),
                    m('div',{style:{marginBottom:'50px'}},[
                        m('span',{},['充币地址']),
                        m('br'),
                        m('div',{style:{marginTop:'5px',backgroundColor: '#FFEEDA',width:'380px',height:'50px',lineHeight:'50px',padding:'0 10px',display: 'flex',flexDirection:'row'}},[
                            m('span',{},'18MrWUBMVRksAY83gxJ4F9xiprsR6fWanJ'),
                            m('img',{src:'fuzhi',style:{marginLeft:'auto',marginTop:'4%'}},[])
                        ])
                    ])
                ]),
                m('div.rechargeCurrency-top-right',{},[
                    m('span',{},['温馨提示']),
                    m('img',{src:'tishitubiao'},[]),
                    m('br'),
                    m('span',{},['*您只能向此地址充值BTC,其他资产充入BTC地址将无法找回']),
                    m('br'),
                    m('span',{},['*使用BTC地址充值需要1个网络确认才能到账']),
                    m('br'),
                    m('span',{},['*BTC单笔充币大于0.00005BTC才可以到账']),
                    m('br'),
                    m('span',{},['*默认充入资金账户，您可以通过“资金划转”将资金转至交易账户或者其他账户'])
                ])
            ]),
            m('div',{},[
                m('div',{},[
                    m('div',{style:{display: 'flex',flexDirection:'row'}},[
                        m('div',{},[ 
                            m('span',{},['近期提币记录']),
                            m('img',{src:'tanhao'},[])
                        ]),
                        m('div',{style:{marginLeft:'auto'}},[
                            m('span',{},'全部记录')
                        ])
                    ]),
                    m('div',{},[
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
                                    m('td',{},['充币']),
                                    m('td',{},['0.01000000 BTC']),
                                    m('td',{},['0.00000000 BTC']),
                                    m('td',{},['成功']),
                                    m('td',{},['2020-05-20 05:20:00']),
                                    m('td',{},['详情'])
                                ])
                            ])
                        ])
                    ]),
                    m('div',{style:{border:'1px solid #ccc',height:'50px',lineHeight:'50px',padding:'0 20px',width:'100%'}},[
                        m('span',{style:{marginRight:'20px'}},['区块链交易ID: 0x6e3729d1d77603a53c66ada8d66d5316efd44124']),
                        m('span',{},['链类型: usdterc20'])
                    ])
                ])
            ])
        ])
    }
}

module.exports = {
    view:function(){
        return rechargeCurrency.rechargePage(); 
    }
}