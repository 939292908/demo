const Http = require('@/api').webApi;
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');

module.exports = {
    pageData: [],
    tips: '*您只能向此地址充值BTC，其他资产充入BTC地址将无法找回 *使用BTC地址充值需要1个网络确认才能到账 *默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户',
    getCoinType() {
        for (const i in wlt.wallet['03']) {
            Http.GetRechargeAddr({
                wType: wlt.wallet['03'][i].wType
            }).then(function(arg) {
                console.log('nzm', 'GetRechargeAddr success', arg);
                const item = {};
                item.rechargeAddr = arg.rechargeAddr;
                item.zh = arg.trade.fullName.zh;
                item.en = arg.trade.fullName.en;
                item.networkNum = arg.trade.networkNum;
                item.wType = arg.wType;
                this.pageData.push(item);
                console.log(this.pageData, '-----------');
            }).catch(function(err) {
                console.log('nzm', 'GetRechargeAddr error', err);
            });
        }
    },
    initFn: function () {
        wlt.init();
        if (!wlt.wallet['01'].toString()) {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.MSG_WLT_READY,
                cb: self.getCoinInfo
            });
        } else {
            self.getCoinInfo();
        }
        // const that = this;
        // for (const i in wlt.wallet['03']) {
        //     // this.selData.push(wlt.wallet['03'][i].wType);
        //     Http.GetRechargeAddr({
        //         wType: wlt.wallet['03'][i].wType
        //     }).then(function(arg) {
        //         console.log('nzm', 'GetRechargeAddr success', arg);
        //         const item = {};
        //         item.rechargeAddr = arg.rechargeAddr;
        //         item.zh = arg.trade.fullName.zh;
        //         item.en = arg.trade.fullName.en;
        //         item.networkNum = arg.trade.networkNum;
        //         item.wType = arg.wType;
        //         that.pageData.push(item);
        //         console.log(this.pageData, '-----------');
        //     }).catch(function(err) {
        //         console.log('nzm', 'GetRechargeAddr error', err);
        //     });
        // }
    },
    updateFn: function (vnode) {
    },
    removeFn: function () {
        wlt.remove();
    }
};