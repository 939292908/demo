const m = require('mithril');
const Header = require('@/views/components/indexHeader/indexHeader.view');
const I18n = require('@/languages/I18n').default;

const model = {
    highlightFlag: null,
    oninit() {
        const key = window.router.getUrlInfo().path.split('/')[1];
        // console.log(key);
        const indexZero = [
            'securityManage',
            'openGoogleVerify',
            'closeGoogleVerify',
            'bindPhone',
            'bindEmail',
            'antiFishingCode',
            'modifyFundPassword',
            'modifyLoginPassword'
        ];
        if (key === 'selfManage') {
            model.highlightFlag = 0;
        } else if (indexZero.includes(key)) {
            model.highlightFlag = 1;
        } else if (key === 'apiManager') {
            model.highlightFlag = 3;
        }
    },
    view() {
        return m(Header, {
            highlightFlag: model.highlightFlag,
            navList: [
                { to: '/selfManage', title: I18n.$t('10051') /* '个人总览' */ },
                { to: '/securityManage', title: I18n.$t('10181') /* '账户安全' */ },
                // { to: '', title: I18n.$t('10182') /* '身份认证' */ },
                { to: '/apiManager', title: I18n.$t('10183') /* 'API管理' */ }
                // { to: '', title: I18n.$t('10184') /* '邀请返佣' */ }
            ]
        });
    }
};
module.exports = model;