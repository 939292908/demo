const Http = require('@/api').webApi;
const { Conf, webApi } = require('@/api');
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
    labelTips: '', // 标签提示
    memo: null, // 是否显示标签
    coinInfo: {},
    setWalletData() {
        const that = this;
        this.pageData = []; // 初始化
        this.setUSDTLabel();
        for (const i in wlt.wallet['03']) {
            if (wlt.wallet['03'][i].Setting.canRecharge) { // 能否充值
                const item = {};
                const walletI = wlt.wallet['03'][i];
                that.uId = this.uId || walletI.uid;
                item.canRecharge = walletI.Setting.canRecharge; // 能否充值
                item.promptRecharge = walletI.promptRecharge; // 充值提示
                item.wType = walletI.wType; // 币种
                item.memo = walletI.Setting.memo; // 是否显示标签
                if (walletI.wType === 'USDT') {
                    for (const i in walletI.Setting) {
                        if (i.search('-') !== -1) {
                            if (!walletI.Setting[i]) {
                                this.USDTLabel.pop(i.split('-')[1]);
                            }
                        }
                    }
                }
                Http.GetRechargeAddr({
                    wType: walletI.wType
                }).then(function(arg) {
                    console.log('nzm', 'GetRechargeAddr success', arg);
                    item.rechargeAddr = arg.rechargeAddr; // 充币地址
                    item.zh = arg.trade.fullName.zh; // 中文
                    item.en = arg.trade.fullName.en; // 英文
                    item.networkNum = arg.trade.networkNum; // 网络数
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
    setUSDTLabel() {
        const params = { locale: 'zh', vp: Conf.exchId };
        webApi.getCoinInfo(params).then(res => {
            if (res.result.code === 0) {
                this.USDTLabel = Array.from(res.result.data.USDT.chains);
                const ary = [];
                for (let i = 0; i < this.USDTLabel.length; i++) {
                    ary.push(this.USDTLabel[i].name);
                }
                this.USDTLabel = ary;
                console.log(this.USDTLabel);
            }
        });
    },
    setTipsAndAddrAndCode() {
        for (const i in this.pageData) {
            if (this.pageData[i].wType === this.selectCheck) {
                const networkNum = this.pageData[i].networkNum;
                if (this.pageData[i].promptRecharge) {
                    this.tips = this.pageData[i].promptRecharge + '*您只能向此地址充值' + this.selectCheck + '，其他资产充入' + this.selectCheck + '地址将无法找回 *使用' + this.selectCheck + '地址充值需要' + networkNum + '个网络确认才能到账 *默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户';
                } else {
                    this.tips = '您只能向此地址充值' + this.selectCheck + '，其他资产充入' + this.selectCheck + '地址将无法找回 *使用' + this.selectCheck + '地址充值需要' + networkNum + '个网络确认才能到账 *默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户';
                }
                this.memo = this.pageData[i].memo;
                this.rechargeAddr = this.pageData[i].rechargeAddr;
                this.setQrCodeImg();
                this.setLabelTips();
            }
        }
        m.redraw();
    },
    setLabelTips() {
        this.labelTips = '充值' + this.selectCheck + '同时需要一个充币地址和' + this.selectCheck + '标签；警告：如果未遵守正确的' + this.selectCheck + '充币步骤，币会有丢失风险！';
    },
    // 币种发生变化切换充币地址
    modifySelect() {
        var myselect = document.getElementsByClassName('coinSel')[0];
        var value = myselect.options[myselect.selectedIndex].value.split('|')[0].trim();
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
    changeBtnflag(index, title) {
        this.btnCheckFlag = index;
        let wType = 'USDT';
        if (title !== 'Omni') {
            wType = wType + title;
        }
        Http.GetRechargeAddr({
            wType: wType
        }).then(function(arg) {
            // console.log('nzm', 'GetRechargeAddr success', arg);
            this.rechargeAddr = arg.rechargeAddr;
            m.redraw();
        }).catch(function(err) {
            console.log('nzm', 'GetRechargeAddr error', err);
        });
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