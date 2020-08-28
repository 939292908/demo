const webApi = require('../newApi2/webApi');
const globalModels = require('./globalModels');
const config = require('../config');
const broadcast = require('../broadcast/broadcast');
const errCode = require('../util/errCode');

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
        }
        ).catch(
            () => {
            }
        );
    },
    getUserInfo() {
        webApi.getUserInfo({}).then(data => {
            self.loading = false;
            if (data.result.code === 0) {
            // 获取个人信息成功
                broadcast.emit({ cmd: 'getUserInfo', data: data.account });
                globalModels.setAccount(data.account);
                // window.router.push('/home');
            } else {
                window.$message({
                    content: errCode.getWebApiErrorCode(data.result.code),
                    type: 'danger'
                });
                // 获取个人信息不成功
                broadcast.emit({ cmd: 'getUserInfo', data: false });
            }
        }).catch(err => {
            window.$message({
                content: `网络异常，请稍后重试 ${err}`,
                type: 'danger'
            });
            broadcast.emit({ cmd: 'getUserInfo', data: false });
        });
    }
};