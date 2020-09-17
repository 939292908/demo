
var m = require("mithril");
const I18n = require('@/languages/I18n').default;
const Dropdown = require('@/views/components/common/Dropdown/Dropdown.view');

const obj = {
    // ================= 菜单1 简单使用 =================
    option1: {
        // 1.事件广播key (必填 随意唯一即可)
        evenKey: "option1key",
        // 2.选中id (必填)
        currentId: 1,
        // 3.下拉开关 (必填)
        showMenu: false,
        // 4.组件内部 自动维护上面两个值 (必填)
        updateOption (option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
        },
        // 5.菜单列表 (必填)
        menuList() {
            return obj.list1;
        },
        // 菜单点击事件 (选填)
        menuClick(item) {
            console.log('菜单一Click', item);
        }
    },

    // ================= 菜单2 自定义内容使用 =================
    option2: {
        evenKey: "option2key", // 1.事件广播key (必填 随意唯一即可)
        currentId: 2, // 2.选中id (必填)
        showMenu: false, // 3.下拉开关 (必填)
        updateOption (option) { // 4.组件内部 自动维护上面两个值 (必填)
            Object.keys(option).forEach(key => (this[key] = option[key]));
        },
        menuList() { // 5.菜单列表 (必填)
            return obj.list2;
        },
        menuClick(item) { // 菜单点击事件 (选填)
            console.log('菜单二Click', item);
        },
        // btnWidth: 200,
        // menuWidth: 200,
        // menuHeight: 100,
        // type: "hover",
        renderHeader(item, currentId) { // 自定义头部
            return m('div', { class: `has-text-primary` }, [
                `我是自定义 ${item?.id}`
            ]);
        }
    },

    // ================= 菜单3 参数绑定其他变量使用 =================
    form: {
        value3: 2, // 其他变量1
        showMenu3: false // 其他变量2
    },
    // 菜单option
    option3: {
        evenKey: "option3key",
        currentId: 2,
        showMenu: false,
        updateOption (option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
            // 同时更新其他变量
            obj.form.showMenu3 = option.showMenu;
            if (option.currentId) {
                obj.form.value3 = option.currentId;
            }
        },
        menuList() {
            return obj.list1;
        }
    },

    // ================= 数据 =================
    list1: [
        {
            id: 1,
            label: I18n.$t('10063') + "1"
        },
        {
            id: 2,
            label: I18n.$t('10063') + "2"
        }
    ],

    list2: [
        {
            id: 1,
            render(params) { // 自定义每个菜单列表
                return m('div', { class: `` }, [
                    m('span', { class: `` }, I18n.$t('10063')),
                    m('span', { class: `` }, ` | option-${params.id}`)
                ]);
            }
        },
        {
            id: 2,
            render(params) { // 自定义每个菜单列表
                return m('div', { class: `` }, [
                    m('span', { class: `` }, I18n.$t('10063')),
                    m('span', { class: `` }, ` | option-${params.id}`)
                ]);
            }
        }
    ]
};
module.exports = {
    view (vnode) {
        return m('div', { class: `` }, [
            m('div', [
                m('div', `ID: ${obj.option1.currentId}`), // ID
                m(Dropdown, obj.option1) // 菜单1 简单使用
            ]),
            m('div', [
                m('div', `ID: ${obj.option2.currentId}`), // ID
                m(Dropdown, obj.option2) // 菜单2 自定义使用
            ]),
            m('div', [
                m('div', `ID: ${obj.form.value3 + JSON.stringify(obj.form)}`), // ID
                m(Dropdown, obj.option3) // 菜单3 绑定其他变量使用
            ])
        ]);
    }
};
