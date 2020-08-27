/*
 * @Author: your name
 * @Date: 2020-08-26 14:43:08
 * @LastEditTime: 2020-08-26 17:54:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\pages\page\extractCoin\index.js
 */
const m = require("mithril");
const Header = require('../../myAssets/header/HeaderIndex');
require('./index.scss');
module.exports = {
    view: function () {
        return m('div', { class: `page-extract-Coin-index content-width` }, [
            m(Header),
            m('div.theme--light', [
                m('div')
            ])
        ]);
    }
};