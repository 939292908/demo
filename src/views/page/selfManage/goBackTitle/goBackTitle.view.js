const m = require('mithril');
module.exports = {
    view(vnode) {
        return m('div.has-bg-level-2.py-4', {}, [
            m('div.container', {}, [
                m('span.cursor-pointer.mr-7', {
                    onclick: () => {
                        window.router.go(-1);
                    }
                }, [
                    m('i.iconfont.icon-Return.iconfont-large', {}, [])
                ]),
                m('span.title-small', {
                    style: 'vertical-align: top;'
                }, [vnode.attrs.title])
            ])
        ]);
    }
};
