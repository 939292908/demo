const m = require('mithril');

require('@/styles/pages/Myassets/header.scss');
// const Header = require('@/pages/page/myAssets/header/HeaderIndex');

module.exports = function (props, vnode) {
    const { Header } = props;
    // highlightFlag: 哪个高亮  0:我的资产高亮，1:资产记录高亮
    return m('div', { class: 'views-pages-myassets-header pl-3 tabs' }, [
        m('ul', {}, [
            m('li', {
                class: (vnode.attrs.highlightFlag === 0 ? 'is-active ' : '') + 'header-my pt-3 cursor-pointer',
                onclick: function () {
                    Header.toPage('myWalletIndex');
                }
            }, m('a', {}, '我的资产')),
            m('li', {
                class: (vnode.attrs.highlightFlag === 1 ? 'is-active ' : '') + 'header-record pt-3 cursor-pointer',
                onclick: function () {
                    Header.toPage('assetRecords');
                }
            }, m('a', { style: { color: '#9A9EAC' } }, '资金记录'))
        ])

        // m('div', {
        //     class: (vnode.attrs.highlightFlag === 0 ? 'header-highlight ' : '') + 'header-my mr-5 pt-3 cursor-pointer',
        //     onclick: function () {
        //         Header.toPage('myWalletIndex');
        //     }
        // }, ['我的资产']),
        // m('div', {
        //     class: (vnode.attrs.highlightFlag === 1 ? 'header-highlight ' : '') + 'header-record mr-5 pt-3 cursor-pointer',
        //     onclick: function () {
        //         Header.toPage('assetRecords');
        //     }
        // }, ['资产记录'])
    ]);
};