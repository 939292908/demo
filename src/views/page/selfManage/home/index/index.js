const m = require('mithril');
const I18n = require('@/languages/I18n').default;

const Header = require('../../../../components/indexHeader/indexHeader.view');
const Layout = require('../layout');
const User = require('../user/user.view');
const Skip = require('../skip/skip');
const Asset = require('../asset/asset.view');
const Invitation = require('../invitation/invitation.view');
const LogSsheet = require('../logSheet/logSheet.view');
require('./index.scss');

module.exports = {
    view: function () {
        return m('div.theme--light self-manage-home',
            m(Layout,
                {
                    nav: m(Header, {
                        highlightFlag: 0,
                        navList: [
                            { to: '/selfManage', title: I18n.$t('10052') },
                            { to: '/selfManage', title: I18n.$t('10052') },
                            { to: '/selfManage', title: I18n.$t('10052') },
                            { to: '/selfManage', title: I18n.$t('10052') },
                            { to: '/selfManage', title: I18n.$t('10052') }
                        ]
                    }),
                    content: m('div', m(User))
                },
                m('div.liftingBox', m('.lifting', m(Skip))),
                m(Asset),
                m('div.dis-flex justify-between align-stretch', [
                    m(Invitation),
                    m(LogSsheet)
                ])
            )
        );
    }
};