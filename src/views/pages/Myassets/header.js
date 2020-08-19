const m = require('mithril');

require('@/styles/pages/Myassets/header.scss');

module.exports = {
    // highlightFlag: 哪个高亮  0:我的资产高亮，1:资产记录高亮
    view: function (vnode) {
        return m('div', { class: 'views-pages-myassets-header pl-3' }, [
            m('div', {
                class: (vnode.attrs.highlightFlag === 0 ? 'header-highlight has-text-primary ' : '') + 'header-my ml-2 cursor-pointer',
                class: (vnode.attrs.highlightFlag === 0 ? 'header-highlight ' : '') + 'header-my mr-5 pt-3 cursor-pointer',
                onclick: function () {
                    window.location.href = '#!/myWalletIndex';
                }
            }, ['我的资产']),
            m('div', {
                class: (vnode.attrs.highlightFlag === 1 ? 'header-highlight ' : '') + 'header-record mr-5 pt-3 cursor-pointer',
                onclick: function () {
                    window.location.href = '#!/assetRecords';
                }
            }, ['资产记录'])
        ]);
    }
};