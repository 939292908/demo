
var m = require("mithril");
const Dropdown = require('./Dropdown.view.js');
const I18n = require('@/languages/I18n').default;

const obj = {
    // 下拉1
    option1: {
        evenKey: "option2key",
        currentId: 1,
        showMenu: false,
        setOption (option) {
            this.showMenu = option.showMenu;
            this.currentId = option.currentId ? option.currentId : this.currentId;
        },
        menuList() {
            return [
                {
                    id: 1,
                    label: I18n.$t('10063') + "1"
                },
                {
                    id: 2,
                    label: I18n.$t('10063') + "2"
                }
            ];
        }
    },
    // 下拉2
    option2: {
        evenKey: "option1key",
        currentId: 2,
        btnWidth: 200,
        menuWidth: 200,
        // menuHeight: 100,
        showMenu: false,
        type: "hover",
        renderHeader(item) {
            return m('div', { class: `has-text-primary` }, [
                "我是自定义",
                item.id
            ]);
        },
        setOption (option) {
            this.showMenu = option.showMenu;
            this.currentId = option.currentId ? option.currentId : this.currentId;
        },
        menuList() {
            return [
                {
                    id: 1,
                    render(params) {
                        return m('div', { class: `` }, [
                            m('span', { class: `` }, I18n.$t('10063')),
                            m('span', { class: `` }, ` | option1-${params.id}`)
                        ]);
                    }
                },
                {
                    id: 2,
                    render(params) {
                        return m('div', { class: `` }, [
                            m('span', { class: `` }, I18n.$t('10063')),
                            m('span', { class: `` }, ` | option1-${params.id}`)
                        ]);
                    }
                }
            ];
        }
    }
};
module.exports = {
    oninit() {},
    oncreate() {},
    view (vnode) {
        return m('div', { class: `is-flex` }, [
            m(Dropdown, obj.option1),
            m(Dropdown, obj.option2)
        ]);
    }
};
