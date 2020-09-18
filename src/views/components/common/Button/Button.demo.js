
var m = require("mithril");
const Button = require('@/views/components/common/Button/Button.view');

const obj = {
    option1: {
        // width: 0.8
    },
    option2: {
        class: 'is-info is-outlined',
        width: 0.5,
        label: '同意',
        loading: false,
        onclick(params) {
            console.log(params);
        }
    },
    option3: {
        width: 400,
        label: '取消',
        onclick(params) {
            console.log(params);
        }
    }
};
module.exports = {
    view (vnode) {
        return m('div', { class: `mt-8 pt-8` }, [
            m('div.is-around', [
                m(Button, obj.option1)
            ]),
            m('div.is-around.my-5', [
                m(Button, obj.option2),
                m(Button, obj.option3)
            ])
        ]);
    }
};
