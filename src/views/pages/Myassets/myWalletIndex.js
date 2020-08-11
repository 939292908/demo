const m = require('mithril');

require('@/styles/pages/Myassets/myWalletIndex.scss');

const tradingAccount = require('@/views/pages/Myassets/tradingAccount');
const myWallet = require('@/views/pages/Myassets/myWallet');

const myWalletIndex = {
    currency: 'BTC',
    currencyChange: function (val) {
        this.setCurrency(val);
        window.gBroadcast.emit({ cmd: window.gBroadcast.CHANGE_SW_CURRENCY, data: val });
    },
    setCurrency: function (param) {
        this.currency = param;
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
                to: ''
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
        secondNav: [
            {
                title: '我的钱包',
                val: '0.00000000 ' + this.currency,
                descCls: 'hide-desc',
                divBg: 'is-primary'
            },
            {
                title: '交易账户',
                val: '0.00000000 ' + this.currency,
                descCls: 'show-desc cursor-pointer',
                divBg: 'is-primary',
                otherSty: 'cen'
            },
            {
                title: '其他账户',
                val: '0.00000000 ' + this.currency,
                descCls: 'hide-desc',
                divBg: 'is-primary'
            }
        ]
    },
    toPage: function (val) {
        if (val === "") {
            return;
        }
        window.location.href = val;
    },
    assetValuation: function () {
        return m('div', { class: 'myWalletIndex-warpper' }, [
            m('div', { class: 'myWalletIndex-nav columns-flex' }, [
                m('div', { class: 'myWalletIndex-nav-my navbar-item has-text-primary cursor-pointer' }, ['我的资产']),
                m('div', { class: 'myWalletIndex-nav-record navbar-item cursor-pointer' }, ['资产记录'])
            ]),
            m('div', { class: 'myWalletIndex-head columns-flex' }, [
                m('div', { class: 'myWalletIndex-head-left column' }, [
                    m('div', { class: 'myWalletIndex-head-left-total columns' }, [
                        m('span', { class: '', style: 'padding:10px' }, ['总资产估值']),
                        m('span.navbar-item.has-dropdown.is-hoverable', {}, [
                            m('select.select', { onchange: function () { myWalletIndex.currencyChange(this.value); } }, [
                                m('option', {}, ['BTC']),
                                m('option', {}, ['USDT'])
                            ])
                        ])
                    ]),
                    m('div', { class: 'number-hide' }, [
                        m('span', {}, ['0.000000000']),
                        m('span', {}, [this.currency]),
                        m('span', {}, ['图标']),
                        m('br'),
                        m('span', {}, ['≈ ']),
                        m('span', {}, ['0.00 ']),
                        m('span', {}, ['CNY'])
                    ])
                ]),
                m('div', { class: 'myWalletIndex-head-right column', style: 'padding:20px;' }, [
                    // 充币  提币  内部转账  资金划转
                    m('div', { class: 'is-between' }, [
                        myWalletIndex.Nav.firstNav.map(item => {
                            return m('div', { class: 'column cursor-pointer' }, [item.title]);
                        })
                    ])
                ])
            ]),
            // 我的钱包  交易账户  其他账户
            m('div', { class: 'myWalletIndex-switch columns-flex' }, [
                myWalletIndex.Nav.secondNav.map((item, index) => {
                    return m('div.myAccount column', {
                        class: myWalletIndex.swValue === index ? item.divBg : '',
                        onclick: function () {
                            // 其他账户未开放
                            if (index <= 1) {
                                myWalletIndex.switchChange(index);
                            }
                        },
                        style: { border: '1px solid #ccc' }
                    }, [
                        m('div', {}, [
                            m('span', {}, [item.title]),
                            m('br'),
                            m('span', {}, ['0.00000000']),
                            m('span', {}, [' ' + this.currency])
                        ]),
                        m('div', { class: item.descCls }, ['...'])
                    ]);
                })
            ]),
            myWalletIndex.switchContent()
        ]);
    }
};
module.exports = {
    view: function () {
        return m('div', { class: 'views-pages-myassets-myWalletIndex common-width' }, [
            myWalletIndex.assetValuation()
        ]);
    }
};