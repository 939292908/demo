const m = require('mithril');

require('@/styles/pages/Myassets/header.scss');

module.exports = {
    oninit (vnode) {
        console.log(vnode.attrs.dataArrObj);
        console.log(vnode.attrs);
    },
    view: function (vnode) {
        console.log(vnode.attrs.dataArrObj);
        return m('table', { class: 'table' }, [
            m('tbody', {}, [
                vnode.attrs.dataArrObj.map(items => {
                    return m('tr', {}, [
                        m('td', {}, [items.category]),
                        m('td', {}, [items.type]),
                        m('td', {}, [items.num]),
                        m('td', {}, [items.state]),
                        m('td', {}, [items.time]),
                        m('td', { style: 'width:100px' }, [items.remarks])
                    ]);
                })
            ]),
            m('table', {}, [
                m('tbody', { class: 'tbody' }, [
                    vnode.attrs.grossValue.map((item, index) => {
                        return m('tr', { class: 'pb-3 pl-2 columns-flex-justify1' }, [
                            m('td', {}, [item.wType]),
                            m('td', {}, [item.addr]),
                            m('td', {}, [item.num]),
                            m('td', {}, [item.timestamp]),
                            m('td', {}, [item.stat]),
                            m('td', { class: '', style: 'width:100px' }, ['--'])
                        ]);
                    })
                ])
            ])
        ]);
    }
};