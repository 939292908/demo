/*
 * @Author: your name
 * @Date: 2020-09-15 17:54:03
 * @LastEditTime: 2020-09-15 17:56:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\views\page\selfManage\safety\index\index.js
 */
const m = require('mithril');
const Layout = require('../../home/layout');
const Header = require('@/views/components/indexHeader/indexHeader.view');
const HeaContent = require('../headerContent/headerContent.view');
const Main = require('../main/main.view');
const I18n = require('@/languages/I18n').default;
// const BindingOrNot = require('@/views/components/theBindingOrNot/theBindingOrNot.view');
require('./index.scss');

module.exports = {
    view: function () {
        return m('div.self-manage-safety theme--light', [
            m(Layout,
                {
                    nav: m(Header, {
                        highlightFlag: 1,
                        navList: [
                            { to: '/selfManage', title: I18n.$t('10051') /* '个人总览' */ },
                            { to: '/securityManage', title: I18n.$t('10181') /* '账户安全' */ }
                            // { to: '', title: I18n.$t('10182') /* '身份认证' */ },
                            // { to: '', title: I18n.$t('10183') /* 'API管理' */ },
                            // { to: '', title: I18n.$t('10184') /* '邀请返佣' */ }
                        ]
                    }),
                    content: m(HeaContent)
                },
                m(Main)
            )
        ]);
    }
};