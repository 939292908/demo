const m = require('mithril');

require('@/styles/pages/Myassets/myWalletIndex.scss');

const tradingAccount = require('@/views/pages/Myassets/tradingAccount');
const myWallet = require('@/views/pages/Myassets/myWallet');
const wlt = require('@/models/wlt/wlt');
const header = require('@/views/pages/Myassets/header');

const myWalletIndex = {
    currency: 'BTC',
    currencyChange: function (val) {
        this.setCurrency(val);
        window.gBroadcast.emit({ cmd: window.gBroadcast.CHANGE_SW_CURRENCY, data: val });
        val === 'BTC' ? myWalletIndex.setTotalValue(wlt.totalValueForBTC) : myWalletIndex.setTotalValue(wlt.totalValueForUSDT);
        val === 'BTC' ? myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForBTC) : myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForUSDT);
        val === 'BTC' ? myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForBTC) : myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForUSDT);
    },
    setCurrency: function (param) {
        this.currency = param;
    },
    totalValue: 0, // 总资产
    setTotalValue: function (param) {
        this.totalValue = param;
    },
    totalCNY: 0, // 人民币
    setTotalCNY: function (param) {
        this.totalCNY = param;
    },
    walletTotalValue: 0, // 我的钱包总资产
    setWalletTotalValue: function (param) {
        this.walletTotalValue = param;
    },
    tradingAccountTotalValue: 0, // 交易账户总资产
    setTradingAccountTotalValue: function (param) {
        this.tradingAccountTotalValue = param;
    },
    hideMoneyFlag: false, // 是否隐藏资产
    hideValue: function () {
        if (this.hideMoneyFlag) {
            this.hideMoneyFlag = !this.hideMoneyFlag;
            this.setTotalValue(wlt[this.currency === 'BTC' ? 'totalValueForBTC' : 'totalValueForUSDT']);
            this.setTotalCNY(wlt[this.currency === 'BTC' ? 'totalCNYValueForBTC' : 'totalCNYValueForUSDT']);
        } else {
            this.hideMoneyFlag = !this.hideMoneyFlag;
            this.setTotalValue('******');
            this.setTotalCNY('******');
        }
    },
    wltTotal: 0, // 我的钱包
    setWltTotal: function (param) {
        this.wltTotal = param;
    },
    accountTotal: 0, // 交易账户
    setAccountTotal: function (param) {
        this.accountTotal = param;
    },
    // 币币
    coinTotal: 0,
    setCoinTotal: function (param) {
        this.coinTotal = param;
    },
    // 法币
    legalTotal: 0,
    setLegalTotal: function (param) {
        this.legalTotal = param;
    },
    // 合约
    contractTotal: 0,
    setContractTotal: function (param) {
        this.contractTotal = param;
    },
    swValue: 0, // 0:我的钱包 1:交易账户 2:其他账户
    switchChange: function (val) {
        this.swValue = val;
    },
    switchContent: function () {
        window.gBroadcast.emit({ cmd: window.gBroadcast.CHANGE_SW_CURRENCY, data: this.currency });
        switch (this.swValue) {
        case 0:
            return m(myWallet);
        case 1:
            return m(tradingAccount);
        default:
            break;
        }
    },
    Nav: {
        firstNav: [
            {
                title: '充币',
                // 跳转至哪个链接 例如：to: 'http://www.baidu.com'
                to: '#!/chargeMoney'
            },
            {
                title: '提币',
                // 跳转至哪个链接
                to: ''
            },
            {
                title: '内部转账',
                // 跳转至哪个链接
                to: ''
            },
            {
                title: '资金划转',
                // 跳转至哪个链接
                to: ''
            }
        ],
        secondNav: []
    },
    initSecondNav: function () {
        myWalletIndex.Nav.secondNav = [
            {
                title: '我的钱包',
                val: myWalletIndex.walletTotalValue,
                descCls: 'hide-desc'
            },
            {
                title: '交易账户',
                val: myWalletIndex.tradingAccountTotalValue,
                sty: 'mx-5',
                descCls: 'show-desc title-medium'
            },
            {
                title: '其他账户',
                val: '0.00000000 ',
                descCls: 'show-desc title-medium'
            }
        ];
    },
    toPage: function (val) {
        if (val === "") {
            return;
        }
        window.location.href = val;
    },
    switchDisplay: function (param, flag) {
        if (param === 'card1') {
            if (flag === 'show') {
                document.getElementsByClassName('tradeCard')[0].style.display = '';
            } else if (flag === 'hide') {
                document.getElementsByClassName('tradeCard')[0].style.display = 'none';
            }
        }
    },
    assetValuation: function () {
        return m('div', {}, [
            m('div', { style: { height: '344px', width: '100%', backgroundColor: '#0E1C33' } }, [
                m('div', { class: 'myWalletIndex-warpper container' }, [
                    // highlightFlag:哪个高亮   0：我的资产  1：资产记录
                    m(header, { highlightFlag: 0 }),
                    m('div', { class: 'myWalletIndex-head columns-flex' }, [
                        m('div', { class: 'myWalletIndex-head-left column' }, [
                            m('div', { class: 'myWalletIndex-head-left-total columns' }, [
                                m('span', { class: 'body-6', style: 'padding:10px' }, ['总资产估值']),
                                m('span.navbar-item.has-dropdown.is-hoverable', {}, [
                                    m('select.has-text-primary', { onchange: function () { myWalletIndex.currencyChange(this.value); } }, [
                                        m('option', {}, ['BTC']),
                                        m('option', {}, ['USDT'])
                                    ])
                                ])
                            ]),
                            m('div', { class: 'number-hide' }, [
                                m('span', { class: 'title-large' }, [myWalletIndex.totalValue]),
                                m('span', { class: 'title-large' }, [' ' + this.currency]),
                                m('span.cursor-pointer', {
                                    onclick: function () {
                                        myWalletIndex.hideValue();
                                    }
                                }, [' 图标']),
                                m('br'),
                                m('span', {}, ['≈ ']),
                                m('span', {}, [this.totalCNY]),
                                m('span', {}, [' CNY'])
                            ])
                        ]),
                        m('div', { class: 'myWalletIndex-head-right column', style: 'padding:20px;' }, [
                            // 充币  提币  内部转账  资金划转
                            m('div', { class: 'is-between' }, [
                                myWalletIndex.Nav.firstNav.map(item => {
                                    return m('button', { class: 'column button-large mx-3 border-radius-small', onclick: function () { myWalletIndex.toPage(item.to); } }, [item.title]);
                                })
                            ])
                        ])
                    ]),
                    // 我的钱包  交易账户  其他账户
                    m('div', { class: 'myWalletIndex-switch columns-flex' }, [
                        myWalletIndex.Nav.secondNav.map((item, index) => {
                            return m('div.myAccount column border-radius-medium pr-7 pl-7', {
                                class: (myWalletIndex.swValue === index ? 'is-primary' : '') + ' ' + item.sty,
                                onclick: function () {
                                    // 其他账户未开放
                                    if (index <= 1) {
                                        myWalletIndex.switchChange(index);
                                    }
                                }
                            }, [
                                m('div', {}, [
                                    m('div', { class: 'mt-5 body-5 has-text-level-3 mb-1' }, [
                                        m('span', { }, [item.title])
                                    ]),
                                    m('div', { class: 'title-small ' }, [
                                        m('span', { style: { } }, [item.val]),
                                        m('span', {}, [' ' + this.currency])
                                    ])
                                ]),
                                m('div.cursor-pointer', {
                                    class: item.descCls,
                                    onmouseover: function () { myWalletIndex.switchDisplay('card' + index, 'show'); },
                                    onmouseleave: function () { myWalletIndex.switchDisplay('card' + index, 'hide'); }
                                }, '...', [
                                    m('span', { class: 'card' + index })
                                ])
                            ]);
                        }),
                        m('div.tradeCard', { style: { display: 'none' } }, [
                            m('span', '合约账户'),
                            m('font', myWalletIndex.contractTotal + ' ' + myWalletIndex.currency),
                            m('span', '币币账户'),
                            m('font', myWalletIndex.coinTotal + ' ' + myWalletIndex.currency),
                            m('span', '法币账户'),
                            m('font', myWalletIndex.legalTotal + ' ' + myWalletIndex.currency)
                        ])
                    ])
                ])
            ]),
            m('div', { class: 'myWalletIndex-warpper container' }, [
                myWalletIndex.switchContent()
            ])
        ]);
    }
};
module.exports = {
    oncreate: function() {
        wlt.init();
        setTimeout(() => {
            myWalletIndex.setTotalValue(wlt.totalValueForBTC);
            myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForBTC);
            myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForBTC);
            myWalletIndex.setLegalTotal(wlt.legalTotalValueForBTC);
            myWalletIndex.setContractTotal(wlt.contractTotalValueForBTC);
            myWalletIndex.setCoinTotal(wlt.coinTotalValueForBTC);
            myWalletIndex.setTotalCNY(wlt.totalCNYValueForBTC);
            myWalletIndex.initSecondNav();
            m.redraw();
        }, '100');
    },
    view: function () {
        return m('div', { class: 'views-pages-myassets-myWalletIndex theme--light' }, [
            myWalletIndex.assetValuation()
        ]);
    },
    onremove: function() {
        wlt.remove();
    }
};