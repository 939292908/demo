const m = require('mithril');

require('@/styles/pages/Myassets/myWalletIndex.scss');

const tradingAccount = require('@/views/pages/Myassets/tradingAccount');
const myWallet = require('@/views/pages/Myassets/myWallet');
const wlt = require('@/models/wlt/wlt');
const header = require('@/views/pages/Myassets/header');

const myWalletIndex = {
    currency: 'BTC',
    // currencyChange: function (val) {
    //     this.setCurrency(val);
    //     window.gBroadcast.emit({ cmd: window.gBroadcast.CHANGE_SW_CURRENCY, data: val });
    //     val === 'BTC' ? myWalletIndex.setTotalValue(wlt.totalValueForBTC) : myWalletIndex.setTotalValue(wlt.totalValueForUSDT);
    //     val === 'BTC' ? myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForBTC) : myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForUSDT);
    //     val === 'BTC' ? myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForBTC) : myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForUSDT);
    // },
    setCurrency: function (param) {
        myWalletIndex.currency = param;
    },
    totalValue: 0, // 总资产
    setTotalValue: function (param) {
        myWalletIndex.totalValue = param;
    },
    totalCNY: 0, // 人民币
    setTotalCNY: function (param) {
        myWalletIndex.totalCNY = param;
    },
    walletTotalValue: 0, // 我的钱包总资产
    setWalletTotalValue: function (param) {
        myWalletIndex.walletTotalValue = param;
    },
    tradingAccountTotalValue: 0, // 交易账户总资产
    setTradingAccountTotalValue: function (param) {
        myWalletIndex.tradingAccountTotalValue = param;
    },
    hideMoneyFlag: false, // 是否隐藏资产
    hideValue: function () {
        if (myWalletIndex.hideMoneyFlag) {
            myWalletIndex.hideMoneyFlag = !myWalletIndex.hideMoneyFlag;
            myWalletIndex.setTotalValue(wlt[myWalletIndex.currency === 'BTC' ? 'totalValueForBTC' : 'totalValueForUSDT']);
            myWalletIndex.setTotalCNY(wlt[myWalletIndex.currency === 'BTC' ? 'totalCNYValueForBTC' : 'totalCNYValueForUSDT']);
        } else {
            myWalletIndex.hideMoneyFlag = !myWalletIndex.hideMoneyFlag;
            myWalletIndex.setTotalValue('******');
            myWalletIndex.setTotalCNY('******');
        }
    },
    wltTotal: 0, // 我的钱包
    setWltTotal: function (param) {
        myWalletIndex.wltTotal = param;
    },
    accountTotal: 0, // 交易账户
    setAccountTotal: function (param) {
        myWalletIndex.accountTotal = param;
    },
    // 币币
    coinTotal: 0,
    setCoinTotal: function (param) {
        myWalletIndex.coinTotal = param;
    },
    // 法币
    legalTotal: 0,
    setLegalTotal: function (param) {
        myWalletIndex.legalTotal = param;
    },
    // 合约
    contractTotal: 0,
    setContractTotal: function (param) {
        myWalletIndex.contractTotal = param;
    },
    swValue: 0, // 0:我的钱包 1:交易账户 2:其他账户
    switchChange: function (val) {
        myWalletIndex.swValue = val;
    },
    switchContent: function () {
        window.gBroadcast.emit({ cmd: window.gBroadcast.CHANGE_SW_CURRENCY, data: myWalletIndex.currency });
        switch (myWalletIndex.swValue) {
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
                to: '#!/chargeMoney',
                defaultSty: 'highlight'
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
    switchDisplay: function (param, flag, type) {
        if (param === 'card1') {
            if (flag === 'show') {
                document.getElementsByClassName('tradeCard')[0].style.display = '';
            } else if (flag === 'hide') {
                setTimeout(() => {
                    document.getElementsByClassName('tradeCard')[0].style.display = 'none';
                }, 200);
            }
        }
    },
    selectOpFlag: false,
    selectOpText: 'BTC',
    selectOp: ['BTC', 'USDT'],
    // 切换ul（select）的显示隐藏
    setSelectOpFlag: function() {
        event.stopPropagation();
        myWalletIndex.selectOpFlag = !myWalletIndex.selectOpFlag;
        if (myWalletIndex.selectOpFlag) {
            document.getElementsByTagName('ul')[0].style.display = '';
        } else {
            document.getElementsByTagName('ul')[0].style.display = 'none';
        }
    },
    setSelectOpText: function(param) {
        myWalletIndex.selectOpText = param;
    },
    // 设置button（option）显示的值
    selectOpHideUl: function(item) {
        document.getElementsByTagName('ul')[0].style.display = 'none';
        myWalletIndex.setSelectOpText(item);
        myWalletIndex.setCurrency(item);
        window.gBroadcast.emit({ cmd: window.gBroadcast.CHANGE_SW_CURRENCY, data: item });
        item === 'BTC' ? myWalletIndex.setTotalValue(wlt.totalValueForBTC) : myWalletIndex.setTotalValue(wlt.totalValueForUSDT);
        item === 'BTC' ? myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForBTC) : myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForUSDT);
        item === 'BTC' ? myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForBTC) : myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForUSDT);
    },
    // 点击除button的元素隐藏ul（仿select）
    optionDisplay: function(event) {
        if (event.target.tagName !== 'BUTTON') {
            myWalletIndex.selectOpFlag = false;
            document.getElementsByTagName('ul')[0].style.display = 'none';
        }
    },
    changeBtnSty: function (index, type) {
        if (index !== 0) {
            const ele = document.getElementsByClassName('Operation' + index)[0];
            if (type === 'show') {
                ele.classList.value = ele.classList.value.replace('bgNone has-text-primary has-line-level-2', 'has-bg-primary');
            } else {
                ele.classList.value = ele.classList.value.replace('has-bg-primary', 'bgNone has-text-primary has-line-level-2');
            }
        }
    },
    assetValuation: function () {
        return m('div', { onclick: function() { myWalletIndex.optionDisplay(event); } }, [
            m('div.top mb-8', { style: { height: '344px', width: '100%', backgroundColor: '#0E1C33' } }, [
                m('div', { class: 'myWalletIndex-warpper container' }, [
                    // highlightFlag:哪个高亮   0：我的资产  1：资产记录
                    m(header, { highlightFlag: 0 }),
                    m('div', { class: 'myWalletIndex-head columns-flex mt-7' }, [
                        m('div', { class: 'myWalletIndex-head-left column' }, [
                            m('div', { class: 'myWalletIndex-head-left-total columns pt-3' }, [
                                m('span', { class: 'body-6', style: 'color:white' }, ['总资产估值']),
                                // m('span.navbar-item.has-dropdown.is-hoverable', {}, [
                                //     m('select.has-text-primary', { onchange: function () { myWalletIndex.currencyChange(this.value); } }, [
                                //         m('option.pa-3', {}, ['BTC']),
                                //         m('option', {}, ['USDT'])
                                //     ])
                                // ])
                                m('div', {}, [
                                    m(`button.cursor-pointer`, { onclick: myWalletIndex.setSelectOpFlag, style: { color: `#FF8B00` } }, myWalletIndex.selectOpText + ' ▼'),
                                    m('ul.border-radius-small ml-3', { style: { display: 'none' } }, [
                                        myWalletIndex.selectOp.map(item => {
                                            return m('li.cursor-pointer pl-3', { class: item === myWalletIndex.selectOpText ? 'has-text-primary' : '', onclick: function() { myWalletIndex.selectOpHideUl(item); } }, item);
                                        })
                                    ])
                                ])
                            ]),
                            m('div', { class: 'number-hide', style: 'color:white' }, [
                                m('span', { class: 'title-large' }, [myWalletIndex.totalValue]),
                                m('span', { class: 'title-large' }, [' ' + myWalletIndex.currency]),
                                m('span.cursor-pointer', {
                                    onclick: myWalletIndex.hideValue
                                }, [' 图标']),
                                m('br'),
                                m('span', { style: 'color:#9A9EAC' }, ['≈ ']),
                                m('span', { style: 'color:#9A9EAC' }, [myWalletIndex.totalCNY]),
                                m('span', { style: 'color:#9A9EAC' }, [' CNY'])
                            ])
                        ]),
                        m('div', { class: 'myWalletIndex-head-right column pa-5' }, [
                            // 充币  提币  内部转账  资金划转
                            m('div', { class: 'is-between  pt-8' }, [
                                myWalletIndex.Nav.firstNav.map((item, index) => {
                                    return m(`button.column button-large mx-3 border-radius-small cursor-pointer Operation${index}`, {
                                        class: item.title === '充币' ? 'has-bg-primary' : `bgNone has-text-primary has-line-level-2`,
                                        onclick: function () { myWalletIndex.toPage(item.to); },
                                        onmouseover: function() { myWalletIndex.changeBtnSty(index, 'show'); },
                                        onmouseleave: function() { myWalletIndex.changeBtnSty(index, 'hide'); }
                                    },
                                    [item.title]);
                                })
                            ])
                        ])
                    ]),
                    // 我的钱包  交易账户  其他账户
                    m('div', { class: 'myWalletIndex-switch columns-flex mt-7' }, [
                        myWalletIndex.Nav.secondNav.map((item, index) => {
                            return m('div.myAccount column border-radius-medium px-7 is-white py-7', {
                                class: (myWalletIndex.swValue === index ? 'has-bg-primary' : 'has-bg-level-2') + ' ' + item.sty,
                                onclick: function () {
                                    // 其他账户未开放
                                    if (index <= 1) {
                                        myWalletIndex.switchChange(index);
                                    }
                                }
                            }, [
                                m('div', {}, [
                                    m('div', { class: 'body-5 mb-1' }, [
                                        m('span', { }, [item.title])
                                    ]),
                                    m('div', { class: 'title-small ' }, [
                                        m('span', { style: { } }, [item.val]),
                                        m('span', {}, [' ' + myWalletIndex.currency])
                                    ])
                                ]),
                                m('div.cursor-pointer', {
                                    class: item.descCls,
                                    onmouseover: function () { myWalletIndex.switchDisplay('card' + index, 'show'); },
                                    onmouseleave: function () { myWalletIndex.switchDisplay('card' + index, 'hide'); }
                                }, [
                                    m('span', { class: 'card' + index }, '...')
                                ])
                            ]);
                        }),
                        m('div.tradeCard body-2 border-radius-medium py-1 px-3', {
                            style: { display: 'none' },
                            onmouseover: function () { myWalletIndex.switchDisplay('card1', 'show'); },
                            onmouseleave: function () { myWalletIndex.switchDisplay('card1', 'hide'); }
                        }, [
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
            m('div', { class: 'myWalletIndex-table container pb-7', style: { } }, [
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