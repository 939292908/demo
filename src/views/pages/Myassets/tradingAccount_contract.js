// 账户交易>合约账户
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');

require('@/styles/pages/Myassets/walletTableStyle.scss');
// require('@/styles/pages/Myassets/tradingAccount_contract.scss');

const contract = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    valuation: 0,
    setValuation: function (param) {
        this.valuation = param;
    },
    contractList: [],
    notZeroAssetList: [], // 不包含0资产
    showAssetList: 'contractList',
    hideZeroFlag: false, // 是否隐藏0资产
    changeHideZeroFlag: function () {
        this.hideZeroFlag = !this.hideZeroFlag;
        if (this.hideZeroFlag) {
            this.setShowAssetList('notZeroAssetList');
        } else {
            this.setShowAssetList('contractList');
        }
    },
    setShowAssetList: function (param) {
        this.showAssetList = param;
    },
    copyAry: function (ary, type) {
        const res = [];
        if (type === 'zero') {
            this.valueForBTC = 0;
            this.valueForlUSDT = 0;
            for (let i = 0; i < ary.length; i++) {
                if (ary[i].MgnBal === "0.00000000") {
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
        contract.contractList = contract.copyAry(wlt.wallet['01'], 'all');
        contract.notZeroAssetList = contract.copyAry(wlt.wallet['01'], 'zero');
        m.redraw();
    },
    search: function (searchContent) {
        const table = document.getElementsByTagName('table')[0];
        const rowsLength = table.rows.length;
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
    },
    contractIndex: function () {
        return m('div.tradingAccount_contract wallet-tableSty', [
            m('div', { class: 'tradingAccount_contract wallet-nav' }, [
                m('div', {}, [
                    m('input', {
                        placeholder: '请输入需搜索币种',
                        oninput: function () {
                            contract.search(this.value);
                        }
                    }, []),
                    m('label.checkbox', { onclick: function () { contract.changeHideZeroFlag(); } }, [
                        m('input[type=checkbox]', { checked: contract.hideZeroFlag }),
                        '隐藏0资产'
                    ])
                ]),
                m('div', {}, [m('img', { src: 'zijinjilu' }), m('span', {}, '资金记录')]),
                m('div', {}, [m('img', { src: 'yingkuifenxi' }), m('span', {}, '盈亏分析')]),
                m('div', { style: { marginLeft: 'auto' } }, [m('span', {}, '合约账户：' + contract.valuation + ' ' + contract.currency)])
            ]),
            m('div', {}, [
                m('table', { style: { border: '1px solid #ccc' } }, [
                    m('thead', {}, [
                        m('tr', {}, [
                            m('td', {}, '币种'),
                            m('td', {}, '账户权益'),
                            m('td', {}, '未实现盈亏'),
                            m('td', {}, '可用保证金'),
                            m('td', {}, this.currency + '估值'),
                            m('td', {}, '操作')
                        ])
                    ]),
                    m('tbody', {}, [
                        contract[contract.showAssetList].map(item => {
                            return m('tr', {}, [
                                m('td', {}, item.wType),
                                m('td', {}, item.MgnBal),
                                m('td', {}, item.UPNL),
                                m('td', {}, item.NL),
                                m('td', {}, item[contract.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT'] + ' ' + contract.currency),
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
        ]);
    }
};
module.exports = {
    oninit: function () {
        window.gBroadcast.onMsg({
            key: 'tradingAccount_contract',
            cmd: window.gBroadcast.CHANGE_SW_CURRENCY,
            cb: function (arg) {
                contract.setCurrency(arg);
                arg === 'BTC' ? contract.setValuation(wlt.contractTotalValueForBTC) : contract.setValuation(wlt.contractTotalValueForUSDT);
            }
        });
    },
    view: function () {
        return m('div', { class: 'views-pages-myassets-contract' }, [
            contract.contractIndex()
        ]);
    },
    oncreate: function () {
        setTimeout(function () {
            wlt.init();
            contract.initTableData();
            m.redraw();
        }, '100');
    },
    onremove: function () {
        window.gBroadcast.offMsg({
            key: 'tradingAccount_contract',
            isall: true
        });
    }
};