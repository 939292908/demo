const Http = require('@/api').webApi;
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');

const rechargeIndex = {
    pageData: [],
    tips: '*您只能向此地址充值BTC，其他资产充入BTC地址将无法找回 *使用BTC地址充值需要1个网络确认才能到账 *默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户',
    selectCheck: 'this.pageData[0].wType,',
    setWalletData() {
        this.pageData = []; // 初始化
        for (const i in wlt.wallet['03']) {
            if (wlt.wallet['03'][i].Setting.canRecharge) {
                const item = {};
                const walletI = wlt.wallet['03'][i];
                item.wType = walletI.wType; // 币种
                item.canRecharge = walletI.Setting.canRecharge; // 能否充值
                item.memo = walletI.Setting.memo; // 是否显示标签
                console.log(walletI.wType);
                Http.GetRechargeAddr({
                    wType: walletI.wType
                }).then(function(arg) {
                    // console.log('nzm', 'GetRechargeAddr success', arg);
                    item.rechargeAddr = arg.rechargeAddr; // 充币地址
                    item.zh = arg.trade.fullName.zh; // 中文
                    item.en = arg.trade.fullName.en; // 英文
                    item.networkNum = arg.trade.networkNum; // 网络数
                    const walletI = wlt.wallet['03'][i];
                    item.canRecharge = walletI.Setting.canRecharge; // 能否充值
                    item.memo = walletI.Setting.memo; // 是否显示标签
                    rechargeIndex.pageData.push(item);
                    m.redraw();
                }).catch(function(err) {
                    console.log('nzm', 'GetRechargeAddr error', err);
                });
            }
        }
    },
    modifySelect() {
    },
    copyText() {
        const ele = document.getElementsByClassName('addrText')[0];
        ele.select(); // 选择对象
        document.execCommand("copy", false, null);
        alert('复制成功');
    },
    initFn: function () {
        wlt.init();
        if (!wlt.wallet['03'].toString()) {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.MSG_WLT_READY,
                cb: () => {
                    this.setWalletData();
                    m.redraw();
                }
            });
        } else {
            this.setWalletData();
        }
        // setTimeout(() => {
        //     for (const i in wlt.wallet['03']) {
        //         Http.GetRechargeAddr({
        //             wType: wlt.wallet['03'][i].wType
        //         }).then(function(arg) {
        //             console.log('nzm', 'GetRechargeAddr success', arg);
        //             const item = {};
        //             item.rechargeAddr = arg.rechargeAddr; // 充币地址
        //             item.zh = arg.trade.fullName.zh; // 中文
        //             item.en = arg.trade.fullName.en; // 英文
        //             item.networkNum = arg.trade.networkNum; // 网络数
        //             item.wType = arg.wType; // 币种
        //             const walletI = wlt.wallet['03'][i];
        //             item.canRecharge = walletI.Setting.canRecharge; // 能否充值
        //             item.memo = walletI.Setting.memo; // 是否显示标签
        //             rechargeIndex.pageData.push(item);
        //             console.log('nzm', rechargeIndex.pageData, arg);
        //             that.name = 'ufo';
        //         }).catch(function(err) {
        //             console.log('nzm', 'GetRechargeAddr error', err);
        //         });
        //     }
        // }, 200);
    },
    updateFn: function (vnode) {
    },
    removeFn: function () {
        wlt.remove();
    }
};
module.exports = rechargeIndex;