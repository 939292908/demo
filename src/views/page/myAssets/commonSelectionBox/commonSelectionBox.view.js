const m = require('mithril');
const utils = require('@/util/utils').default;
import('@/../node_modules/layui-laydate/src/theme/default/laydate.css');
const CommonSelectionBox = require('./commonSelectionBox.model');

module.exports = {
    oncreate: function(vnode) {
        CommonSelectionBox.oncreate(vnode);
    },
    view: function() {
        return m('div', { class: 'views-pages-Myassets-assetRecords-commonSelectionBoxView' }, [
            m('div', { class: 'columns-flex-justify mb-7 body-2' }, [
                m('div', { class: 'mr-6' }, [
                    m('p', { class: 'mb-2' }, ['时间']),
                    m('input[type=text]', {
                        class: 'has-line-level-1 px-3  identicalInput border-radius-small body-2',
                        id: 'test10',
                        placeholder: '请选择时间',
                        required: 'required',
                        onchange: function (e) {
                            CommonSelectionBox.selectTime(this.value);
                        }
                    })
                ]),
                m('div', { class: 'mr-6' }, [
                    m('p', { class: 'mb-2' }, ['币种']),
                    m('div.dropdown is-active', {}, [
                        m('div.dropdown-trigger', {}, [
                            m('button', {
                                class: 'has-line-level-1 px-3 has-bg-level-2 identicalInput border-radius-small body-2 columns-flex-justify2',
                                ariaHaspopup: 'true',
                                ariaControls: "dropdown-menu",
                                onclick: function() {
                                    CommonSelectionBox.dispalySelectEvent1();
                                }
                            }, [
                                m('span', { class: '' }, [utils.getItem('currencyValue') ? utils.getItem('currencyValue') : CommonSelectionBox.currencyValueChange]),
                                m('i', { class: 'iconfont icon-xiala' })
                            ])
                        ]),
                        m('div.dropdown-menu', { id: "dropdown-menu", class: CommonSelectionBox.displaySelect ? 'displaySelect' : 'noDisplaySelect', style: 'width:234px', role: "menu" }, [
                            m('div.dropdown-content', [
                                CommonSelectionBox.currencyValue.map(item => {
                                    return m('div.dropdown-item.has-text-primary-hover has-text-primary-hover1', {
                                        class: utils.getItem('currencyValue') ? 'has-text-primary-hover1' : '',
                                        onclick: function () {
                                            CommonSelectionBox.onDropdownClick(item);
                                        }
                                    }, [item.value]);
                                })
                            ])
                        ])
                    ])
                ]),
                m('div', { class: 'mr-6' }, [
                    m('p', { class: 'mb-2' }, ['类型']),
                    m('div.dropdown is-hoverable', {}, [
                        m('div.dropdown-trigger', {}, [
                            m('button', {
                                class: 'has-line-level-1 px-3 has-bg-level-2 identicalInput border-radius-small body-2 columns-flex-justify2',
                                ariaHaspopup: 'true',
                                ariaControls: "dropdown-menu",
                                onclick: function() {
                                    CommonSelectionBox.dispalySelectEvent2();
                                }
                            }, [
                                m('span', { class: '' }, [utils.getItem('typeValue') ? utils.getItem('typeValue') : CommonSelectionBox.typeValueChange]),
                                m('i', { class: 'iconfont icon-xiala' })
                            ])
                        ]),
                        m('div.dropdown-menu', { id: "dropdown-menu", class: CommonSelectionBox.displaySelect2 ? 'displaySelect1' : 'noDisplaySelect1', style: 'width:234px', role: "menu" }, [
                            m('div.dropdown-content', [
                                CommonSelectionBox.typeValue.map(item => {
                                    return m('div.dropdown-item.has-text-primary-hover has-text-primary-hover1', {
                                        onclick: function () {
                                            CommonSelectionBox.onnMenuClick(item);
                                        }
                                    }, [item.value]);
                                })
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    },
    onremove() {
        CommonSelectionBox.onremove();
    }
};