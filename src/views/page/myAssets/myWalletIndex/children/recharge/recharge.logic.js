const Http = require('@/api').webApi;
const { Conf, webApi } = require('@/api');
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const Qrcode = require('qrcode');
const l180n = require('@/languages/I18n').default;

module.exports = {
    pageData: [], // 所需数据
    USDTLabel: [], // 链名称
    selectList: [], // 下拉列表
    form: {
        selectCheck: '' // 当前币种选中值
    },
    tips: '', // 提示
    uId: '', // 用户uId
    rechargeAddr: '', // 充币地址
    qrcodeDisplayFlag: false,
    btnCheckFlag: 0, // 默认选中第一个
    labelTips: '', // 标签提示
    memo: null, // 是否显示标签
    openChains: null, // 是否显示链名称
    showCurrencyMenu: false, // show币种菜单
    setPageData() {
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
                item.openChains = walletI.Setting.openChains;
                item.wType = walletI.wType; // 币种
                item.memo = walletI.Setting.memo; // 是否显示标签
                if (walletI.wType === 'USDT') {
                    for (const i in walletI.Setting) {
                        if (i.search('-') !== -1) {
                            // 去掉为false的链名称
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
                    that.form.selectCheck = that.pageData[0].wType;
                    that.setTipsAndAddrAndCode();
                    that.selectList.push({ label: walletI.wType + ' | ' + arg.trade.fullName.zh, id: walletI.wType });

                    // 数组去重
                    const tempJson = {};
                    const res = [];
                    if (this.selectList) {
                        for (let i = 0; i < this.selectList.length; i++) {
                            tempJson[JSON.stringify(this.selectList[i])] = true; // 取出每一个对象当做key
                        }
                        for (let j = 0; j < Object.keys(tempJson).length; j++) {
                            res.push(JSON.parse(Object.keys(tempJson)[j]));
                        }
                    }
                    this.selectList = res;

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
                console.log('nzm', this.USDTLabel);
            }
        });
    },
    setTipsAndAddrAndCode() {
        console.log('nzm', this.form.selectCheck);
        for (const i in this.pageData) {
            if (this.pageData[i].wType === this.form.selectCheck) {
                const networkNum = this.pageData[i].networkNum;
                if (this.pageData[i].promptRecharge) {
                    this.tips = this.pageData[i].promptRecharge +
                    '*您只能向此地址充值' + this.form.selectCheck + '，其他资产充入' + this.form.selectCheck + '地址将无法找回' +
                    /* 使用{value1}地址充币需要{value2}个网络确认才能到账 */
                    '*' + l180n.$t('10084', { value1: this.form.selectCheck, value2: networkNum }) +
                    /* '默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户' */
                    '*' + l180n.$t('10085');
                } else {
                    this.tips = '您只能向此地址充值' + this.form.selectCheck + '，其他资产充入' + this.form.selectCheck + '地址将无法找回' +
                    /* 使用{value1}地址充币需要{value2}个网络确认才能到账 */
                    '*' + l180n.$t('10084', { value1: this.form.selectCheck, value2: networkNum }) +
                    (this.form.selectCheck === 'EOS' || this.form.selectCheck === 'XRP' ? '*关于标签{value}充币时同时需要一个充币地址和{value}标签。标签是一种保证您的充币地址唯一性的数字串，与充币地址成对出现并一一对应。请您务必遵守正确的{value}充币步骤，在提币时输入完整的信息，否则将面临丢失币的风险！' : '') +
                    /* '默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户' */
                    '*' + l180n.$t('10085');
                }
                this.memo = this.pageData[i].memo;
                this.openChains = this.pageData[i].openChains;
                this.rechargeAddr = this.pageData[i].rechargeAddr;
                this.setQrCodeImg();
                this.setLabelTips();
            }
        }
    },
    setLabelTips() {
        this.labelTips = '充值' + this.form.selectCheck + '同时需要一个充币地址和' + this.form.selectCheck + '标签；警告：如果未遵守正确的' + this.form.selectCheck + '充币步骤，币会有丢失风险！';
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
            console.log('nzm', err);
        });
    },
    // 币种 菜单配置
    getCurrencyMenuOption() {
        const that = this;
        return {
            evenKey: `rechargeSelect${Math.floor(Math.random() * 10000)}`,
            menuWidth: 384,
            showMenu: that.showCurrencyMenu,
            setShowMenu: type => {
                that.showCurrencyMenu = type;
            },
            activeId: cb => cb(that.form, 'selectCheck'),
            onClick (item) {
                that.setTipsAndAddrAndCode();
                that.setQrCodeImg();
                m.redraw();
            },
            getList () {
                return that.selectList;
            }
        };
    },
    changeQrcodeDisplay(type) {
        type === 'show' ? this.qrcodeDisplayFlag = true : this.qrcodeDisplayFlag = false;
    },
    copyText() {
        const ele = document.getElementsByClassName('addrText')[0];
        if (ele.value) {
            ele.select(); // 选择对象
            document.execCommand("copy", false, null);
            alert('复制成功');
        }
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
                    this.setPageData();
                }
            });
        } else {
            this.setPageData();
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