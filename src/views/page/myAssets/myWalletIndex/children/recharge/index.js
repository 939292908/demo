const Http = require('@/api').webApi;
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const Qrcode = require('qrcode');

module.exports = {
    pageData: [],
    USDTLabel: [],
    selectCheck: '', // 当前币种选中值
    tips: '', // 提示
    uId: '', // 用户uId
    rechargeAddr: '', // 充币地址
    qrcodeDisplayFlag: false,
    btnCheckFlag: 0, // 默认选中第一个
    setWalletData() {
        const that = this;
        this.pageData = []; // 初始化
        this.USDTLabel = []; // 初始化
        for (const i in wlt.wallet['03']) {
            if (wlt.wallet['03'][i].Setting.canRecharge) { // 能否充值
                const item = {};
                const walletI = wlt.wallet['03'][i];
                item.canRecharge = walletI.Setting.canRecharge; // 能否充值
                // usdt 标签
                if (walletI.wType === 'USDT') {
                    for (const i in walletI.Setting) {
                        if (i.search('-') !== -1) {
                            const value = {};
                            value.title = i.split('-')[1];
                            value.flag = walletI.Setting[i];
                            this.USDTLabel.push(value);
                        }
                    }
                    // for (let i = 0; i < this.USDTLabel.length; i++) {
                    //     if (this.USDTLabel[i].title === this.USDTLabel[i + 1].title) {
                    //         this.USDTLabel[i].pop();
                    //     }
                    // }
                    // console.log(this.USDTLabel);
                }
                item.promptRecharge = walletI.promptRecharge; // 充值提示
                item.wType = walletI.wType; // 币种
                item.memo = walletI.Setting.memo; // 是否显示标签
                Http.GetRechargeAddr({
                    wType: walletI.wType
                }).then(function(arg) {
                    // console.log('nzm', 'GetRechargeAddr success', arg);
                    item.rechargeAddr = arg.rechargeAddr; // 充币地址
                    item.zh = arg.trade.fullName.zh; // 中文
                    item.en = arg.trade.fullName.en; // 英文
                    item.networkNum = arg.trade.networkNum; // 网络数
                    that.uId = walletI.uid; // 用户uId
                    that.pageData.push(item);
                    that.selectCheck = that.pageData[0].wType;
                    that.setTipsAndAddrAndCode();
                    m.redraw();
                }).catch(function(err) {
                    console.log('nzm', 'GetRechargeAddr error', err);
                });
            }
        }
    },
    setTipsAndAddrAndCode() {
        m.redraw();
        for (const i in this.pageData) {
            if (this.pageData[i].wType === this.selectCheck) {
                const networkNum = this.pageData[i].networkNum;
                if (this.pageData[i].promptRecharge) {
                    this.tips = this.pageData[i].promptRecharge + '*您只能向此地址充值' + this.selectCheck + '，其他资产充入' + this.selectCheck + '地址将无法找回 *使用' + this.selectCheck + '地址充值需要' + networkNum + '个网络确认才能到账 *默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户';
                } else {
                    this.tips = '您只能向此地址充值' + this.selectCheck + '，其他资产充入' + this.selectCheck + '地址将无法找回 *使用' + this.selectCheck + '地址充值需要' + networkNum + '个网络确认才能到账 *默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户';
                }
                this.rechargeAddr = this.pageData[i].rechargeAddr;
                this.setQrCodeImg();
            }
        }
    },
    // 币种发生变化切换充币地址
    modifySelect() {
        var myselect = document.getElementsByClassName('coinSel')[0];
        var value = myselect.options[myselect.selectedIndex].value;
        this.selectCheck = value;
        this.setTipsAndAddrAndCode();
        this.setQrCodeImg();
    },
    setQrCodeImg() {
        document.getElementsByClassName('QrCodeImg')[0].innerHTML = '';
        Qrcode.toCanvas(this.rechargeAddr || '暂无地址', {
            errorCorrectionLevel: "L", // 容错率L（低）H(高)
            margin: 1, // 二维码内边距，默认为4。单位px
            height: 100, // 二维码高度
            width: 100 // 二维码宽度
        }).then(canvas => {
            document.getElementsByClassName('QrCodeImg')[0].appendChild(canvas);
        }).catch((err) => {
            console.log(err);
        });
    },
    changeQrcodeDisplay(type) {
        type === 'show' ? this.qrcodeDisplayFlag = true : this.qrcodeDisplayFlag = false;
    },
    copyText() {
        const ele = document.getElementsByClassName('addrText')[0];
        ele.select(); // 选择对象
        document.execCommand("copy", false, null);
        alert('复制成功');
    },
    changeBtnflag(index) {
        this.btnCheckFlag = index;
    },
    initFn: function () {
        wlt.init();
        if (!wlt.wallet['03'].toString()) {
            broadcast.onMsg({
                key: 'index',
                cmd: broadcast.MSG_WLT_READY,
                cb: () => {
                    this.setWalletData();
                }
            });
        } else {
            this.setWalletData();
        }
    },
    updateFn: function (vnode) {
    },
    removeFn: function () {
        broadcast.offMsg({
            key: 'index',
            isall: true
        });
        wlt.remove();
    }
};