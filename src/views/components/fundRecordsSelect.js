const m = require('mithril');

require('@/styles/pages/Myassets/assetRecords.scss');

module.exports = {
    oninit (vnode) {
        console.log(vnode.attrs.dataArrObj);
        console.log(vnode.attrs.num);
    },
    view: function (vnode) {
        return m('div', {}, [
            m('table', {}, [
                m('tbody', { class: 'tbody' }, [
                    vnode.attrs.dataArrObj.map(items => {
                        return m('tr', { class: ' pl-2 pb-2 pt-2 columns-flex-justify1  has-text-level-2 border-radius-small body-4' }, [
                            m('td', {}, [items.category]),
                            m('td', {}, [items.type]),
                            m('td', {}, [items.num]),
                            m('td', { class: !vnode.attrs.num ? 'dropdown-menu2' : 'dropdown-menu1' }, [items.ServiceCharge]),
                            m('td', {}, [items.state]),
                            m('td', {}, [items.time]),
                            m('td', { style: 'width:100px' }, [items.remarks])
                        ]);
                    })
                ])
            ]),
            m('table', {}, [
                m('tbody', { class: 'tbody' }, [
                    vnode.attrs.grossValue.map((item, index) => {
                        return m('tr', { class: 'pb-3 pl-2 columns-flex-justify1 body-4' }, [
                            m('td', {}, [item.wType]),
                            m('td', {}, [item.status]),
                            m('td', {}, [item.num]),
                            m('td', {}, [item.num]),
                            m('td', {}, [item.stat]),
                            m('td', {}, [item.time]),
                            m('td', { class: 'dropdown-menu1', style: 'width:100px' }, ['--']),
                            m('td', { class: 'has-text-primary cursor-pointer ', style: 'width:100px' }, [
                                m('div', { class: 'dropdown is-right is-active' }, [
                                    m('div', {
                                        class: 'dropdown-trigger'
                                        // onclick: function () {
                                        //     myWalletTable.displayEvnet(index);
                                        // }
                                    }, [
                                        m('span', { ariaHaspopup: 'true', ariaControls: 'dropdown-menu6' }, ['详情']),
                                        m('span', { class: 'icon is-small' }, [
                                            m('i', { class: 'fas fa-angle-down', ariaHidden: 'true' }, [])
                                        ])
                                    ]),
                                    m('div', { class: 'dropdown-menu1', id: 'dropdown-menu6', role: 'menu' }, [
                                        m('div', { class: 'dropdown-content' }, [
                                            m('div', { class: 'dropdown-item' }, [
                                                m('div', { class: '' }, [
                                                    m('div', { class: 'mb-3' }, [
                                                        m('span', { class: 'pr-7' }, ['提币地址:']),
                                                        m('span', {}, ['链类型:' + item.wType])
                                                    ]),
                                                    m('div', {}, [
                                                        m('span', { class: 'pr-7' }, ['提币地址:']),
                                                        m('span', {}, ['链类型:' + item.wType])
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ])
                                ])
                            ])
                        ]);
                    })
                ])
            ])
        ]);
    }
};