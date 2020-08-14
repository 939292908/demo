const m = require('mithril');

require('@/styles/pages/Myassets/header.scss');

module.exports = {
    // highlightFlag: 哪个高亮  0:我的资产高亮，1:资产记录高亮
    view: function (vnode) {
        return m('div', { class: 'views-pages-myassets-header' }, [
            m('div', {
                class: (vnode.attrs.highlightFlag === 0 ? 'header-highlight has-text-primary ' : '') + 'header-my navbar-item cursor-pointer',
                onclick: function () {
                    window.location.href = '#!/myWalletIndex';
                }
            }, ['我的资产']),
            m('div', {
                class: (vnode.attrs.highlightFlag === 1 ? 'header-highlight has-text-primary ' : '') + 'header-record navbar-item cursor-pointer',
                onclick: function () {
                    window.location.href = '#!/assetRecords';
                }
            }, ['资产记录'])
        ]);
    }
};