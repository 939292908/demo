const m = require('mithril');
const Header = require('./HeaderModel');

require('@/styles/pages/Myassets/header.scss');

module.exports = {
    view: function (vnode) {
        return m('div', { class: 'views-pages-myassets-header pl-3' }, [
            m('div', {
                class: (vnode.attrs.highlightFlag === 0 ? 'header-highlight ' : '') + 'header-my mr-5 pt-3 cursor-pointer',
                onclick: function () {
                    Header.toPage('myWalletIndex');
                }
            }, ['我的资产']),
            m('div', {
                class: (vnode.attrs.highlightFlag === 1 ? 'header-highlight ' : '') + 'header-record mr-5 pt-3 cursor-pointer',
                onclick: function () {
                    Header.toPage('assetRecords');
                }
            }, ['资产记录'])
        ]);
    }
};