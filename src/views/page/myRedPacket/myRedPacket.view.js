const m = require('mithril');
require('./myRedPacket.scss');
const logic = require('./myRedPacket.logic');
const Header = require('@/views/components/common/Header/Header.view');
// const FormItem = require('@/views/components/common/FormItem/FormItem.view');
// const Button = require('@/views/components/common/Button/Button.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-layout` }, [
                "我的红包!"
            ])
        ]);
    }
};