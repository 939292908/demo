const m = require('mithril');
// const img = require('./Image.png').default;
const UserInfo = require('./user.logic');
const utils = require('@/util/utils').default;
const l180n = require('@/languages/I18n').default;
require('./user.scss');

module.exports = {
    oninit: function () {
        UserInfo.oninit();
    },
    oncreate: function () {
        document.getElementById('copyUid').addEventListener('copy', this.copyEditText);
    },
    copyEditText: function (e) {
        e.clipboardData.setData('text/plain', UserInfo.info.uid);
        e.preventDefault();
        window.$message({ title: l180n.$t('10410') /* '提示' */, content: l180n.$t('10546') /* '复制成功' */, type: 'success' });
    },
    handleEditCopy: function (e) {
        document.execCommand('copy');
    },
    view: function () {
        return m('div.self-manage-user dis-flex justify-between align-center', [
            m('div.userInfo dis-flex align-center', [
                m('.headPortrait', m('.imgBox.title-large', m('div', UserInfo.info?.accountName?.split('')[0]))),
                m('.userMessage', [
                    m('.name title-large', [
                        m('span', `${utils.hideAccountNameInfo(UserInfo.info.accountName)}`)
                        // m('span', 'VIP8')
                    ]),
                    m('.user-uid', { onclick: this.handleEditCopy, id: 'copyUid' }, [
                        m('span.mr-2', `UID：${UserInfo.info.uid}`),
                        m('i.iconfont icon-copy')
                    ])
                ])
            ]),
            m('div.logInLog.body-4', [
                m('div', `${l180n.$t('10148') /* '上次登录时间' */} ${UserInfo.ExtList[0]?.strs[0] || '--'}`),
                m('div', `IP: ${UserInfo.ExtList[0]?.strs[1].indexOf('::ffff:') >= 0 ? UserInfo.ExtList[0]?.strs[1].split('::ffff:')[1] : UserInfo.ExtList[0]?.strs[1] || '--'}`)
            ])
        ]);
    },
    onremove: function () {
        UserInfo.onremove();
        document.getElementById('copyUid').removeEventListener('copy', this.copyEditText);
    }
};