// 账户交易>法币账户
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');

require('@/styles/pages/Myassets/walletTableStyle.scss');
// require('@/styles/pages/Myassets/tradingAccount_legal.scss');

const legal = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    valuation: 0,
    setValuation: function (param) {
        this.valuation = param;
    },
    legalList: [],
    notZeroAssetList: [], // 不包含0资产
    showAssetList: 'legalList',
    hideZeroFlag: false, // 是否隐藏0资产
    changeHideZeroFlag: function () {
        this.hideZeroFlag = !this.hideZeroFlag;
        if (this.hideZeroFlag) {
            this.setShowAssetList('notZeroAssetList');
        } else {
            this.setShowAssetList('legalList');
        }
    },
    setShowAssetList: function (param) {
        this.showAssetList = param;
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
        legal.legalList = legal.copyAry(wlt.wallet['04'], 'all');
        legal.notZeroAssetList = legal.copyAry(wlt.wallet['04'], 'zero');
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
            for (var j = 0; j < rowsLength; j++) {
                table.rows[j].style.display = '';
            }
        }
    }
};
module.exports = {
    oninit: function () {
        window.gBroadcast.onMsg({
            key: 'tradingAccount_legal',
            cmd: window.gBroadcast.CHANGE_SW_CURRENCY,
            cb: function (arg) {
                legal.setCurrency(arg);
                arg === 'BTC' ? legal.setValuation(wlt.legalTotalValueForBTC) : legal.setValuation(wlt.legalTotalValueForUSDT);
            }
        });
    },
    view: function () {
        return m('div', { class: 'views-pages-myassets-legal' }, [
            m('div.tradingAccount_legal wallet-tableSty', [
                m('div', { class: 'tradingAccount_legal wallet-nav' }, [
                    m('div', {}, [
                        m('input', {
                            placeholder: '请输入需搜索币种',
                            oninput: function () {
                                legal.search(this.value);
                            }
                        }, []),
                        m('label.checkbox', { onclick: function () { legal.changeHideZeroFlag(); } }, [
                            m('input[type=checkbox]', { checked: legal.hideZeroFlag }),
                            '隐藏0资产'
                        ])
                    ]),
                    m('div', {}, [m('img', { src: 'zijinjilu' }), m('span', {}, '资金记录')]),
                    m('div', { style: { marginLeft: 'auto' } }, [m('span', {}, '法币账户：' + legal.valuation + ' ' + legal.currency)])
                ]),
                m('div', { style: { display: legal.showNotDataDiv ? 'none' : '' } }, ['暂无数据']),
                m('div', {}, [
                    m('table', { style: { border: '1px solid #ccc' } }, [
                        m('thead', {}, [
                            m('tr', {}, [
                                m('td', {}, '币种'),
                                m('td', {}, '总额'),
                                m('td', {}, '可用'),
                                m('td', {}, '冻结'),
                                m('td', {}, legal.currency + '估值'),
                                m('td', {}, '操作')
                            ])
                        ]),
                        m('tbody', {}, [
                            legal[legal.showAssetList].map(item => {
                                return m('tr', {}, [
                                    m('td', {}, item.wType),
                                    m('td', {}, item.TOTAL),
                                    m('td', {}, item.NL),
                                    m('td', {}, item.otcLock),
                                    m('td', {}, item[legal.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT'] + ' ' + legal.currency),
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
            legal.initTableData();
            m.redraw();
        }, '100');
    },
    onremove: function () {
        window.gBroadcast.offMsg({
            key: 'tradingAccount_legal',
            isall: true
        });
    }
};