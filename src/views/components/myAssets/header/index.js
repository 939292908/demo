const m = require('mithril');
require('@/views/components/myAssets/header/header.scss');

module.exports = {
    // highlightFlag: 哪个高亮  0:第一个item高亮，1:第二个item高亮
    view: function (vnode) {
        return m('div', { class: 'views-pages-myassets-header pl-3' }, [
            vnode.attrs.navList.map((item, index) => {
                return m('div', {
                    class: (vnode.attrs.highlightFlag === index ? 'header-highlight ' : '') + 'header-my mr-5 pt-3 cursor-pointer',
                    onclick: function () {
                        m.route.set(item.to);
                    }
                }, [item.title]);
            })
        ]);
    }
};