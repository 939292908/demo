
const m = require('mithril');
const myWalletTable = require('@/views/pages/Myassets/assetRecords/myWalletTable');

require('@/styles/pages/Myassets/assetRecords.scss');
const myWallet = {
    assetValuation: function () {
        return m('div', {
            class: 'views-pages-Myassets-assetRecords-myWallet-wrapper'
        }, [
            m('div', { class: 'cursor-pointer  mb-3 has-text-primary' }, [
                m('span', {}, ['我的钱包'])
            ]),
            m('div', { class: 'columns-flex-justify mb-3 body-2' }, [
                m('div', { class: 'mr-6' }, [
                    m('p', { class: 'mb-2' }, ['时间']),
                    m('input[type=date]', { class: 'has-line-level-1 identicalInput border-radius-small body-2' })
                ]),
                m('div', { class: 'mr-6' }, [
                    m('p', { class: 'mb-2' }, ['币种']),
                    m('select.select ', { class: 'has-line-level-1 identicalInput border-radius-small body-2' }, [
                        m('option', {}, ['全部'])
                    ])
                ]),
                m('div', { class: 'mr-6' }, [
                    m('p', { class: 'mb-2' }, ['类型']),
                    m('select.select ', { class: 'has-line-level-1 identicalInput border-radius-small body-2' }, [
                        m('option', {}, ['全部类型'])
                    ])
                ])
            ]),
            m(myWalletTable)
        ]);
    }
};
module.exports = {
    oninit: function () {
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-myWallet' }, [
            myWallet.assetValuation()
        ]);
    }
};