const m = require('mithril');

const personal = require('./myself/personal');
const accountSecurity = require('./accountVerify/accountSecurity');
const authentication = require('./identity/authentication');

// let closeGoogleVerify = require('./accountVerify/closeGoogleVerify');
// let modifyLoginPwd = require('./accountVerify/modifyLoginPwd');
// let fishCode = require('./accountVerify/fishCode');
// let modifyFishCode = require('./accountVerify/modifyFishCode');
// let modifyMoneyPwd = require('./accountVerify/modifyMoneyPwd');
// let mobileVerify = require('./accountVerify/mobileVerify');
// let mailboxVerify = require('./accountVerify/mailboxVerify');

const obj = {
    menuVal: 0, // 左侧菜单导航
    setMenuVal: function (param) {
        this.menuVal = param;
    },
    switchPageWithLeft: function () {
        // menuVal == 0 :'个人总览' menuVal == 1 :'账户安全' menuVal == 2 :'身份认证' menuVal == 3 :'API管理' menuVal == 4 :'邀请返佣'
        switch (this.menuVal) {
        case 0:
            return m(personal);
        case 1:
            return m(accountSecurity);
        case 2:
            return m(authentication);
        // case 3:
        // return m(personal)
        // case 4:
        // return m(personal)
        }
    }
};

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.container', [
            m('aside.container.left.menu', { style: { width: '15%', textAlign: 'center', float: 'left' } }, [
                m('ul.menu-list', [
                    m('li', { onclick: function () { obj.setMenuVal(0); } }, [
                        m('a', { class: "" + (obj.menuVal === 0 ? "is-active" : '') }, '个人总览')
                    ]),
                    m('li', { onclick: function () { obj.setMenuVal(1); } }, [
                        m('a', { class: "" + (obj.menuVal === 1 ? "is-active" : '') }, '账户安全')
                    ]),
                    m('li', { onclick: function () { obj.setMenuVal(2); } }, [
                        m('a', { class: "" + (obj.menuVal === 2 ? "is-active" : '') }, '身份认证')
                    ]),
                    m('li', { onclick: function () { obj.setMenuVal(3); } }, [
                        m('a', { class: "" + (obj.menuVal === 3 ? "is-active" : '') }, 'API管理')
                    ]),
                    m('li', { onclick: function () { obj.setMenuVal(4); } }, [
                        m('a', { class: "" + (obj.menuVal === 4 ? "is-active" : '') }, '邀请返佣')
                    ])
                ])
            ]),
            obj.switchPageWithLeft(),
            m('div', { style: { clear: 'both' } })
        ]);
    }
};