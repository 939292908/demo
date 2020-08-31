const m = require('mithril');

require('./indexHeader.scss');

module.exports = {
    view: function (vnode) {
        const list = [];
        for (const i in vnode.attrs.navList) {
            list.push(m('div.header-my.mr-5.pt-3.cursor-pointer', {
                class: (vnode.attrs.highlightFlag === Number(i) ? 'header-highlight ' : ''),
                onclick: function () {
                    window.router.push(vnode.attrs.navList[i].to);
                }
            }, [vnode.attrs.navList[i].title])
            );
        }
        return m('div.views-pages-myassets-header.pl-3', { }, list);
    }
};