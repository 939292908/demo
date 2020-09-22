const webApi = require('../api/webApi');
const globalModels = require('./globalModels');
const config = require('../config');
const broadcast = require('../broadcast/broadcast');
const errCode = require('../util/errCode').default;
const utils = require('../util/utils').default;
const I18n = require('@/languages/I18n').default;

module.exports = {
    getFunList() {
        webApi.getFunList({
            exchannel: config.exchId
        }).then(data => {
            globalModels.setFunctions(data.result.items);
            globalModels.setForexRate({
                rate: data.result.forex.CNY,
                name: 'CNY',
                symbol: '￥'
            });
            broadcast.emit({ cmd: broadcast.GET_FUNLIST_READY, data: data.result.items });
        }
        ).catch(
            () => {
            }
        );
    },
    getUserInfo(needTip = false) {
        webApi.getUserInfo({}).then(data => {
            self.loading = false;
            if (data.result.code === 0) {
                // 获取个人信息成功
                globalModels.setAccount(data.account);
                utils.setItem('userAccount', data.account.accountName);
                utils.setItem('loginState', true);
                broadcast.emit({ cmd: broadcast.GET_USER_INFO_READY, data: data.account });
                // window.router.push('/home');
            } else {
                if (needTip) {
                    window.$message({
                        content: errCode.getWebApiErrorCode(data.result.code),
                        type: 'danger'
                    });
                } else {
                    this.logout();
                }
                // 获取个人信息不成功
            }
        }).catch(err => {
            console.log(err);
            if (needTip) {
                window.$message({
                    content: I18n.$t('10340')/* '网络异常，请稍后重试' */,
                    type: 'danger'
                });
            } else {
                this.logout();
            }
        });
    },
    logout() {
        window.$message({
            content: I18n.$t('10440')/* '登录过期，请重新登录' */,
            type: 'danger'
        });
        utils.removeItem('ex-session');
        utils.setItem('loginState', false);
        globalModels.setAccount({});

        window.router.checkRoute({ path: window.router.path });
        broadcast.emit({
            cmd: broadcast.MSG_LOG_OUT,
            data: {
                cmd: broadcast.MSG_LOG_OUT
            }
        });
    }
};
