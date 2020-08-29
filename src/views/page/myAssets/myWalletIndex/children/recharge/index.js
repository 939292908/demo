const wlt = require('@/models/wlt/wlt');
const Http = require('@/api').webApi;

module.exports = {
    pageData: [],
    tips: '*您只能向此地址充值BTC，其他资产充入BTC地址将无法找回 *使用BTC地址充值需要1个网络确认才能到账 *默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户',
    setSelData: function(arg) {
        console.log(arg);
    },
    initFn: function () {
        wlt.init();
        setTimeout(() => {
            for (const i in wlt.wallet['03']) {
                // this.selData.push(wlt.wallet['03'][i].wType);
                Http.GetRechargeAddr({
                    wType: wlt.wallet['03'][i].wType
                }).then(function(arg) {
                    console.log('nzm', 'GetRechargeAddr success', arg);
                }).catch(function(err) {
                    console.log('nzm', 'GetRechargeAddr error', err);
                });
            }
        }, 200);
    },
    updateFn: function (vnode) {
    },
    removeFn: function () {
        wlt.remove();
    }
};