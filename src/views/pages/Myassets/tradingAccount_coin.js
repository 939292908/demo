// 账户交易>币币账户
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');

require('@/styles/pages/Myassets/walletTableStyle.scss');
// require('@/styles/pages/Myassets/tradingAccount_coin.scss');

const coin = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    valuation: 0,
    setValuation: function (param) {
        this.valuation = param;
    },
    coinList: [],
    notZeroAssetList: [], // 不包含0资产
    showAssetList: 'coinList',
    hideZeroFlag: false, // 是否隐藏0资产
    setShowAssetList: function (param) {
        this.showAssetList = param;
    },
    changeHideZeroFlag: function () {
        this.hideZeroFlag = !this.hideZeroFlag;
        if (this.hideZeroFlag) {
            this.setShowAssetList('notZeroAssetList');
        } else {
            this.setShowAssetList('coinList');
        }
    },
    copyAry: function (ary, type) {
        const res = [];
        if (type === 'zero') {
            this.valueForBTC = 0;
            this.valueForUSDT = 0;
            for (let i = 0; i < ary.length; i++) {
                if (ary[i].TOTAL === "0.00000000") {
                    continue;
                } else {
                    res.push(ary[i]);
                }
            }
        } else if (type === 'all') {
            for (let i = 0; i < ary.length; i++) {
                res.push(ary[i]);
            }
        }
        return res;
    },
    initTableData: function () {
        coin.coinList = coin.copyAry(wlt.wallet['02'], 'all');
        coin.notZeroAssetList = coin.copyAry(wlt.wallet['02'], 'zero');
        m.redraw();
    },
    search: function (searchContent) {
        window._console.clear();
        const table = document.getElementsByTagName('table')[0];
        const rowsLength = table.rows.length;
        window._console.log('nzm', 'table---', table);
        window._console.log('nzm', 'rowsLength---', rowsLength);
        let count = 1;
        if (searchContent !== "") {
            for (var i = 1; i < rowsLength; i++) {
                var searchText = table.rows[i].cells[0].innerHTML;
                if (searchText.toUpperCase().indexOf(searchContent.toUpperCase()) !== -1) {
                    // 显示行操作
                    table.rows[i].style.display = '';
                } else {
                    // 隐藏行操作
                    table.rows[i].style.display = 'none';
                    count = count + 1;
                }
            }
            if (count === rowsLength) {
                table.rows[rowsLength - 1].style.display = '';
            }
        } else if (searchContent === "") {
            table.rows[rowsLength - 1].style.display = 'none';
            for (var j = 1; j < rowsLength - 1; j++) {
                table.rows[j].style.display = '';
            }
        }
    }
};
module.exports = {
    oninit: function () {
        window.gBroadcast.onMsg({
            key: 'tradingAccount_coin',
            cmd: window.gBroadcast.CHANGE_SW_CURRENCY,
            cb: function (arg) {
                coin.setCurrency(arg);
                arg === 'BTC' ? coin.setValuation(wlt.coinTotalValueForBTC) : coin.setValuation(wlt.coinTotalValueForUSDT);
            }
        });
        coin.initTableData();
    },
    view: function () {
        return m('div', { class: 'views-pages-myassets-coin' }, [
            m('div.tradingAccount_coin wallet-tableSty', [
                m('div', { class: 'tradingAccount_coin wallet-nav' }, [
                    m('div', {}, [
                        m('input', {
                            placeholder: '请输入需搜索币种',
                            oninput: function () {
                                console.log(this.value);
                                coin.search(this.value);
                            }
                        }, []),
                        m('label.checkbox', { onclick: function () { coin.changeHideZeroFlag(); } }, [
                            m('input[type=checkbox]', { checked: coin.hideZeroFlag }),
                            '隐藏0资产'
                        ])
                    ]),
                    m('div', {}, [m('img', { src: 'zijinjilu' }), m('span', {}, '资金记录')]),
                    m('div', { style: { marginLeft: 'auto' } }, [m('span', {}, '币币账户：' + coin.valuation + ' ' + coin.currency)])
                ]),
                m('div', {}, [
                    m('table', { style: { border: '1px solid #ccc' } }, [
                        m('thead', {}, [
                            m('tr', {}, [
                                m('td', {}, '币种'),
                                m('td', {}, '总额'),
                                m('td', {}, '可用'),
                                m('td', {}, '冻结'),
                                m('td', {}, coin.currency + '估值'),
                                m('td', {}, '操作')
                            ])
                        ]),
                        m('tbody', {}, [
                            coin[coin.showAssetList].map(item => {
                                return m('tr', {}, [
                                    m('td', {}, item.wType),
                                    m('td', {}, item.TOTAL),
                                    m('td', {}, item.NL),
                                    m('td', {}, item.Frz),
                                    m('td', {}, item[coin.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT'] + ' ' + coin.currency),
                                    m('td', {}, [
                                        m('a', {}, ['划转']),
                                        m('a', {}, ['去交易'])
                                    ])
                                ]);
                            }),
                            m('tr', { style: { display: 'none' } }, [
                                m('td', { colspan: 6, style: { textAlign: 'center' } }, '暂无数据')
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    },
    oncreate: function () {
        setTimeout(function () {
            wlt.init();
            coin.initTableData();
            m.redraw();
        }, '100');
    },
    onremove: function () {
        window.gBroadcast.offMsg({
            key: 'tradingAccount_coin',
            isall: true
        });
    }
};