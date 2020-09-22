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
const header = require('@/views/page/selfManage/header/header');
const HeaContent = require('../headerContent/headerContent.view');
const Main = require('../main/main.view');
// const BindingOrNot = require('@/views/components/theBindingOrNot/theBindingOrNot.view');
require('./index.scss');

module.exports = {
    view: function () {
        return m('div.self-manage-safety theme--light', [
            m(Layout,
                {
                    nav: m(header),
                    content: m(HeaContent)
                },
                m(Main)
            )
        ]);
    }
};
