
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
            if (option.currentId) this.currentId = option.currentId;
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
        showMenu: false,
        setOption (option) {
            this.showMenu = option.showMenu;
            if (option.currentId) this.currentId = option.currentId;
        },
        menuList() {
            return [
                {
                    id: 1,
                    render() {
                        return m('div', { class: `` }, [
                            m('span', { class: `has-text-primary` }, I18n.$t('10063')),
                            m('span', { class: `` }, " | option1-1")
                        ]);
                    }
                },
                {
                    id: 2,
                    render() {
                        return m('div', { class: `` }, [
                            m('span', { class: `has-text-primary` }, I18n.$t('10063')),
                            m('span', { class: `` }, " | option1-2")
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
