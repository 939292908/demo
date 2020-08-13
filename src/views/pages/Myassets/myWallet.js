const m = require('mithril');

const wlt = require('@/models/wlt/wlt');

require('@/styles/pages/Myassets/myWallet.scss');
require('@/styles/pages/Myassets/walletTableStyle.scss');

const myWallet = {
    currency: 'BTC',
    setCurrency: function (param) {
        this.currency = param;
    },
    valuation: 'valueForBTC', // 哪种类型的估值
    setValuation: function (param) {
        this.valuation = param;
    },
    assetList: [],
    notZeroAssetList: [], // 不包含0资产
    showAssetList: 'assetList',
    hideZeroFlag: false, // 是否隐藏0资产
    changeHideZeroFlag: function () {
        this.hideZeroFlag = !this.hideZeroFlag;
        if (this.hideZeroFlag) {
            this.setShowAssetList('notZeroAssetList');
        } else {
            this.setShowAssetList('assetList');
        }
    },
    setShowAssetList: function (param) {
        this.showAssetList = param;
    },
    copyAry: function (ary, type) {
        const res = [];
        if (type === 'zero') {
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
    initAssetList: function () {
        myWallet.assetList = myWallet.copyAry(wlt.wallet['03'], 'all');
        myWallet.notZeroAssetList = myWallet.copyAry(wlt.wallet['03'], 'zero');
        m.redraw();
    },
    search: function (searchContent) {
        window._console.clear();
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
    }
};

module.exports = {
    oninit: function () {
        window.gBroadcast.onMsg({
            key: 'myWallet',
            cmd: window.gBroadcast.CHANGE_SW_CURRENCY,
            cb: function (arg) {
                myWallet.setCurrency(arg);
                arg === 'BTC' ? myWallet.setValuation('valueForBTC') : myWallet.setValuation('valueForUSDT');
            }
        });
        myWallet.initAssetList();
    },
    view: function () {
        return m('div', {
            class: 'views-pages-myassets-myWallet'
        }, [
            m('div', { class: 'myWallet-nav' }, [
                m('div', {}, [
                    m('input', {
                        placeholder: '请输入需搜索币种',
                        oninput: function () {
                            myWallet.search(this.value);
                        }
                    }, []),
                    m('label.checkbox', { onclick: function () { myWallet.changeHideZeroFlag(); } }, [
                        m('input[type=checkbox]', { checked: myWallet.hideZeroFlag }),
                        '隐藏0资产'
                    ])
                ]),
                m('div', {}, [m('img', { src: 'zijinjilu' }), m('span', {}, '资金记录')])
            ]),
            m('div.wallet-tableSty', {}, [
                m('table', { style: { border: '1px solid #ccc' } }, [
                    m('thead', {}, [
                        m('tr', {}, [
                            m('td', {}, '币种'),
                            m('td', {}, '总额'),
                            m('td', {}, '可用'),
                            m('td', {}, '锁定'),
                            m('td', {}, myWallet.currency + '估值'),
                            m('td', {}, '操作')
                        ])
                    ]),
                    m('tbody', {}, [
                        myWallet[myWallet.showAssetList].map(item => {
                            return m('tr', {}, [
                                m('td', {}, item.wType),
                                m('td', {}, item.TOTAL),
                                m('td', {}, item.NL),
                                m('td', {}, item.depositLock),
                                m('td', {}, item[myWallet.valuation] + ' ' + myWallet.currency),
                                m('td', {}, [
                                    m('a', {}, ['充值']),
                                    m('a', {}, ['提现']),
                                    m('a', {}, ['划转'])
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
    },
    oncreate: function () {
        setTimeout(function () {
            wlt.init();
            myWallet.initAssetList();
        }, '100');
        m.redraw();
    },
    onremove: function () {
        wlt.remove();
        window.gBroadcast.offMsg({
            key: 'myWallet',
            isall: true
        });
    }
};