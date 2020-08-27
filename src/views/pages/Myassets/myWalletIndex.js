const m = require('mithril');

require('@/styles/pages/Myassets/myWalletIndex.scss');

const tradingAccount = require('@/views/pages/Myassets/tradingAccount');
const myWallet = require('@/views/pages/Myassets/myWallet');
const wlt = require('@/models/wlt/wlt');
const header = require('@/pages/page/myAssets/header/HeaderIndex');
const broadcast = require('@/broadcast/broadcast');
const Http = require('@/newApi/index');

const myWalletIndex = {
    currency: 'BTC',
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
    switchChange: function (val, type) {
        console.log('type', type);
        if (type) {
            this.wltIdx = val;
        }
        myWalletIndex.swValue = val;
    },
    wltIdx: 0,
    switchContent: function () {
        broadcast.emit({ cmd: broadcast.CHANGE_SW_CURRENCY, data: myWalletIndex.currency });
        switch (myWalletIndex.swValue) {
        case 0:
            return m(myWallet);
        case 1:
            return m(tradingAccount, { idx: this.wltIdx });
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
        ]
    },
    toPage: function (val) {
        if (val === "") {
            return;
        }
        window.location.href = val;
    },
    switchDisplay: function (param, flag) {
        if (param === 'tradeCard') {
            if (flag === 'show') {
                document.getElementsByClassName('tradeCard')[0].style.display = '';
            } else if (flag === 'hide') {
                document.getElementsByClassName('tradeCard')[0].style.display = 'none';
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
        broadcast.emit({ cmd: broadcast.CHANGE_SW_CURRENCY, data: item });
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
    changeTradeAccount: function(param) {
        console.log('param-------------------------', param);
        // 点击交易账户(...)中则显示对应page
        myWalletIndex.switchChange(1);
        this.wltIdx = param;
        window.event.stopPropagation();
        myWalletIndex.switchContent();
        // broadcast.emit({ cmd: broadcast.MA_CHANGE_TRADE_PAGE, data: param });
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
                                m('div', {}, [
                                    m(`button.cursor-pointer`, { onclick: myWalletIndex.setSelectOpFlag, style: { color: `#FF8B00` } }, myWalletIndex.selectOpText + ' ▼'),
                                    m('ul.border-radius-small ml-3 has-bg-level-2', { style: { display: 'none' } }, [
                                        myWalletIndex.selectOp.map(item => {
                                            return m('li.cursor-pointer pl-3', { class: item === myWalletIndex.selectOpText ? 'has-text-primary' : '', onclick: function() { myWalletIndex.selectOpHideUl(item); } }, item);
                                        })
                                    ])
                                ])
                            ]),
                            m('div', { class: 'number-hide', style: 'color:white' }, [
                                m('span', { class: 'title-large' }, [myWalletIndex.totalValue]),
                                // m('span', { class: 'title-large', style: { fontFamily: 'Arial', border: '1px solid red', fontSize: '32px', fontWeight: '600' } }, ['1234567890']),
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
                                    return m(`button.column button-large mx-3 border-radius-small cursor-pointer Operation${index} has-line-level-2`, {
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
                    m('div', { class: 'myWalletIndex-switch columns-flex mt-7 is-between' }, [
                        m('div.wallet border-radius-medium px-7 py-7 column', {
                            class: (myWalletIndex.swValue === 0 ? 'has-bg-primary' : 'has-bg-level-2'),
                            onclick: function() { myWalletIndex.switchChange(0); }
                        }, [
                            m('div', { class: 'body-5 mb-1 has-text-level-3' }, [
                                m('span', { }, '我的钱包')
                            ]),
                            m('div', { class: 'title-small ' }, [
                                m('span', {}, myWalletIndex.walletTotalValue),
                                m('span', {}, [' ' + myWalletIndex.currency])
                            ])
                        ]),
                        m('div.trade border-radius-medium px-7 py-7 mx-5 column', {
                            class: (myWalletIndex.swValue === 1 ? 'has-bg-primary' : 'has-bg-level-2'),
                            onclick: function() { myWalletIndex.switchChange(1, true); }
                        }, [
                            m('div.left', {}, [
                                m('div', { class: 'body-5 mb-1 has-text-level-3' }, [
                                    m('span', { }, '交易账户')
                                ]),
                                m('div', { class: 'title-small ' }, [
                                    m('span', {}, myWalletIndex.tradingAccountTotalValue),
                                    m('span', {}, [' ' + myWalletIndex.currency])
                                ])
                            ]),
                            m('div.right', {
                                onmouseover: function () { myWalletIndex.switchDisplay('tradeCard', 'show'); },
                                onmouseleave: function () { myWalletIndex.switchDisplay('tradeCard', 'hide'); }
                            }, [
                                m('div.cursor-pointer', {
                                }, [
                                    m('span', { class: 'card1 title-medium' }, '...')
                                ]),
                                m('div.tradeCard body-2 border-radius-medium pa-7 has-bg-level-2', {
                                    style: { display: 'none' }
                                }, [
                                    m('span.mb-1', '合约账户'),
                                    m('a.mb-5 has-text-level-3', { onclick: function () { myWalletIndex.changeTradeAccount(1); } }, myWalletIndex.contractTotal + ' ' + myWalletIndex.currency),
                                    m('span.mb-1', '币币账户'),
                                    m('a.mb-5 has-text-level-3', { onclick: function () { myWalletIndex.changeTradeAccount(2); } }, myWalletIndex.coinTotal + ' ' + myWalletIndex.currency),
                                    m('span.mb-1', '法币账户'),
                                    m('a.has-text-level-3', { onclick: function () { myWalletIndex.changeTradeAccount(4); } }, myWalletIndex.legalTotal + ' ' + myWalletIndex.currency)
                                ])
                            ])
                        ]),
                        m('div.other border-radius-medium px-7 py-7 column has-bg-level-2', {}, [
                            m('div', { class: 'body-5 mb-1 has-text-level-3' }, [
                                m('span', { }, '其他账户')
                            ]),
                            m('div', { class: 'title-small ' }, [
                                m('span', {}, '0.00000000 '),
                                m('span', {}, [' ' + myWalletIndex.currency])
                            ])
                        ])
                    ])
                ])
            ]),
            m('div', { class: 'myWalletIndex-table container pb-7' }, [
                myWalletIndex.switchContent()
            ])
        ]);
    },
    DelayDataAcquisition: function() {
        myWalletIndex.setTotalValue(wlt.totalValueForBTC);
        myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForBTC);
        myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForBTC);
        myWalletIndex.setLegalTotal(wlt.legalTotalValueForBTC);
        myWalletIndex.setContractTotal(wlt.contractTotalValueForBTC);
        myWalletIndex.setCoinTotal(wlt.coinTotalValueForBTC);
        myWalletIndex.setTotalCNY(wlt.totalCNYValueForBTC);
        m.redraw();
    }
};
module.exports = {
    oninit: function() {
        Http.getWallet({
            exChannel: 30
        }).then(function(arg) {
            console.log(arg, '11111');
        });
    },
    oncreate: function() {
        // wlt.init();
        setTimeout(myWalletIndex.DelayDataAcquisition, '100');
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