const m = require('mithril');
const Layout = require('../../home/layout');
const Header = require('@/views/components/indexHeader/indexHeader.view');
const HeaContent = require('../headerContent/headerContent.view');
const Main = require('../main/main.view');
const I18n = require('@/languages/I18n').default;
require('./index.scss');

module.exports = {
    view: function () {
        return m('div.self-manage-safety', [
            m(Layout,
                {
                    nav: m(Header, {
                        highlightFlag: 2,
                        navList: [
                            { to: '/selfManage', title: I18n.$t('10052') },
                            { to: '/selfManage', title: I18n.$t('10052') },
                            { to: '/selfManage', title: I18n.$t('10052') },
                            { to: '/selfManage', title: I18n.$t('10052') },
                            { to: '/selfManage', title: I18n.$t('10052') }
                        ]
                    }),
                    content: m(HeaContent)
                },
                m(Main)
            )
        ]);
    }
};