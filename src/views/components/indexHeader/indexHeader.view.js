const m = require('mithril');

require('./indexHeader.scss');

module.exports = {
    view: function (vnode) {
        const list = [];
        for (const i in vnode.attrs.navList) {
            list.push(m('li', { class: vnode.attrs.highlightFlag === Number(i) ? 'has-line-primary' : '' }, [
                m('a', {
                    onclick: e => {
                        window.router.push(vnode.attrs.navList[i].to);
                    },
                    class: vnode.attrs.highlightFlag === Number(i) ? 'has-text-primary' : 'has-text-level-4'
                }, [vnode.attrs.navList[i].title])])
            );
        }
        return m('div.views-pages-myassets-header.tabs', {}, [
            m('ul', {}, [
                list
            ])
        ]);
    }
};