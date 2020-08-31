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
const Header = require('../../../../components/indexHeader/indexHeader.view');
const AssetRecords = require('@/models/asset/assetsRecords');
const assetTable = require('../../assetTable/assetTable.view');
const From = require('../form');
require('./index.scss');
module.exports = {
    oninit() {
        AssetRecords.init('03', 'withdraw');
    },
    view: function () {
        return m('div', { class: `page-extract-Coin-index` }, [
            m('nav', { class: 'boder' }, m('div.content-width marg-auto', m(Header))),
            m('div.theme--light extract-coin-contont', [
                m(LeveL3),
                m('div.content-width marg-auto', [
                    m('div.extract-coin-from', m(From)),
                    m('div.w100.has-bg-level-2', {}, [
                        m('div.pa-5', {}, [
                            m('span.title-small', {}, ['近期提币记录']),
                            m('i.iconfont.icon-Tooltip', {}, [])
                        ]),
                        m('hr.ma-0'),
                        m(assetTable, { class: 'pa-5', list: AssetRecords.showList })
                    ])
                ])
            ])
        ]);
    }
};