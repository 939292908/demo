/*
 * @Author: your name
 * @Date: 2020-08-26 14:43:08
 * @LastEditTime: 2020-08-26 17:54:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\pages\page\extractCoin\index.js
 */
const m = require("mithril");
const LeveL3 = require('../nav');
const Header = require('../../myAssets/header/header.view');
const From = require('../form');
require('./index.scss');
module.exports = {
    view: function () {
        return m('div', { class: `page-extract-Coin-index` }, [
            m('nav', { class: 'boder' }, m('div.content-width marg-auto', m(Header))),
            m('div.theme--light extract-coin-contont', [
                m(LeveL3),
                m('div.content-width marg-auto', [
                    m('div.extract-coin-from', m(From)),
                    m('div.log-sheet ', '提币记录')
                ])
            ])
        ]);
    }
};