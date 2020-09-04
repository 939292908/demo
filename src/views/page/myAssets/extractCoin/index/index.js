/*
 * @Author: leez
 * @Date: 2020-08-26 14:43:08
 * @LastEditTime: 2020-08-26 17:54:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\pages\page\extractCoin\index.js
 */
const m = require("mithril");
const LeveL3 = require('../nav');
const From = require('../form/form.view');
const Header = require('../../../../components/indexHeader/indexHeader.view');
const AssetRecords = require('@/models/asset/assetsRecords');
const assetTable = require('../../assetTable/assetTable.view');
const Tooltip = require('@/views/components/common/Tooltip/Tooltip.view');
const I18n = require('@/languages/I18n').default;

require('./index.scss');
module.exports = {
    oninit() {
        AssetRecords.init('03', 'withdraw', 10);
        AssetRecords.setLanguageListen();
    },
    onremove() {
        AssetRecords.destroy();
    },
    view: function () {
        return m('div', { class: `page-extract-Coin-index` }, [
            m('nav', m('div.content-width marg-auto', m(Header, {
                highlightFlag: 0,
                navList: [{ to: '/myWalletIndex', title: '我的资产' }, { to: '/myWalletIndex', title: '资金记录' }]
            }))),
            m('div.theme--light extract-coin-contont', [
                m(LeveL3),
                m('div.content-width marg-auto', [
                    m('div.extract-coin-from', m(From)),
                    m('div.w100.has-bg-level-2', {}, [
                        m('div.pa-5', {}, [
                            m('span.title-small', {}, ['近期提币记录']),
                            m(Tooltip, {
                                label: m('i.iconfont.icon-Tooltip.iconfont-large'),
                                content: '只展示近期十条记录',
                                hiddenArrows: false
                            }),
                            m('span.all-records', {
                                class: `has-text-primary cursor-pointer`,
                                onclick: () => { window.router.push('/assetRecords'); }
                            }, I18n.$t('10087') /* '全部记录' */)
                        ]),
                        m('hr.ma-0'),
                        m(assetTable, {
                            class: 'pa-5',
                            list: AssetRecords.showList,
                            loading: AssetRecords.loading,
                            aType: AssetRecords.aType
                        })
                    ])
                ])
            ])
        ]);
    }
};