/*
 * @Author: your name
 * @Date: 2020-09-15 17:54:03
 * @LastEditTime: 2020-09-15 17:56:20
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\views\page\selfManage\home\index\index.js
 */
const m = require('mithril');
const Layout = require('../layout');
const User = require('../user/user.view');
const Skip = require('../skip/skip');
const Asset = require('../asset/asset.view');
const Invitation = require('../invitation/invitation.view');
const LogSsheet = require('../logSheet/logSheet.view');
const Transfer = require('@/views/page/myAssets/transfer/transfer.view.js');
const header = require('@/views/page/selfManage/header/header');
require('./index.scss');

module.exports = {
    view: function () {
        return m('div.theme--light self-manage-home',
            m(Layout,
                {
                    nav: m(header),
                    content: m('div', m(User))
                },
                m('div.liftingBox', m('.lifting', m(Skip))),
                m(Asset),
                m('div.dis-flex justify-between align-stretch', [
                    m(Invitation),
                    m(LogSsheet)
                ]),
                m(Transfer)
            )
        );
    }
};
