const Http = require('@/api').webApi;
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const Qrcode = require('qrcode');
const I18n = require('@/languages/I18n').default;

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
    nameTips: null,
    memo: null, // 是否显示标签
    openChains: null, // 是否显示链名称
    showCurrencyMenu: false, // show币种菜单
    coinParam: null, // 传过来的币种
    chains: null, // 链名称
    setPageData() {
        const that = this;
        this.pageData = []; // 初始化
        that.selectList = []; // 初始化
        for (const i in wlt.wallet['03']) {
            if (wlt.wallet['03'][i].Setting.canRecharge) { // 能否充值
                const item = {};
                const walletI = wlt.wallet['03'][i];
                that.uId = that.uId || walletI.uid;
                item.canRecharge = walletI.Setting.canRecharge; // 能否充值
                item.promptRecharge = walletI.promptRecharge; // 充值提示
                item.openChains = walletI.Setting.openChains;
                item.wType = walletI.wType; // 币种
                item.memo = walletI.Setting.memo; // 是否显示标签
                Http.GetRechargeAddr({
                    wType: walletI.wType
                }).then(function(arg) {
                    // console.log('nzm', 'GetRechargeAddr success', arg);
                    item.rechargeAddr = arg.rechargeAddr; // 充币地址
                    item.networkNum = arg.trade.networkNum; // 网络数
                    that.pageData.push(item);
                    that.coinParam ? that.form.selectCheck = that.coinParam : that.form.selectCheck = that.pageData[0].wType;
                    that.setTipsAndAddrAndCode();
                    m.redraw();
                }).catch(function(err) {
                    console.log('nzm', 'GetRechargeAddr error', err);
                });
            }
        }
        this.setUSDTLabelAndSelectList();
    },
    setUSDTLabelAndSelectList() {
        if (wlt.coinInfo.USDT !== undefined) {
            this.chains = wlt.coinInfo.USDT.chains;
            this.USDTLabel = Array.from(wlt.coinInfo.USDT.chains);
            const ary = [];
            for (let i = 0; i < this.USDTLabel.length; i++) {
                ary.push(this.USDTLabel[i].name);
            }
            this.USDTLabel = ary;
            // 需按顺序显示
            for (const i of wlt.wallet['03']) {
                if (i.wType === 'USDT') {
                    for (const j in i.Setting) {
                        if (j.search('canRechargeUSDT-') > -1) {
                            if (!i.Setting[j]) {
                                this.USDTLabel = this.USDTLabel.filter((x) => x !== j.split('canRechargeUSDT-')[1]);
                            }
                        }
                    }
                }
            }
        }
        for (const i of wlt.wallet['03']) {
            if (i.Setting.canRecharge) {
                this.selectList.push({ label: i.wType + ' | ' + wlt.coinInfo[i.wType].name, id: i.wType });
            }
        }
    },
    // 切换币种时的操作
    setTipsAndAddrAndCode() {
        for (const i in this.pageData) {
            if (this.pageData[i].wType === this.form.selectCheck) {
                const networkNum = this.pageData[i].networkNum;
                if (this.pageData[i].promptRecharge) {
                    this.tips = this.pageData[i].promptRecharge +
                    '*您只能向此地址充值' + this.form.selectCheck + '，其他资产充入' + this.form.selectCheck + '地址将无法找回' +

                    /* 使用{value1}地址充币需要{value2}个网络确认才能到账 */
                    '*' + I18n.$t('10084', { value1: this.form.selectCheck, value2: networkNum }) +

                    /* '默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户' */
                    '*' + I18n.$t('10085');
                } else {
                    this.tips = '您只能向此地址充值' + this.form.selectCheck + '，其他资产充入' + this.form.selectCheck + '地址将无法找回' +

                    /* 使用{value1}地址充币需要{value2}个网络确认才能到账 */
                    '*' + I18n.$t('10084', { value1: this.form.selectCheck, value2: networkNum }) +

                    (this.form.selectCheck === 'EOS' || this.form.selectCheck === 'XRP' ? '*关于标签' + this.form.selectCheck + '充币时同时需要一个充币地址和' + this.form.selectCheck + '标签。标签是一种保证您的充币地址唯一性的数字串，与充币地址成对出现并一一对应。请您务必遵守正确的' + this.form.selectCheck + '充币步骤，在提币时输入完整的信息，否则将面临丢失币的风险！' : '') +

                    /* '默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户' */
                    '*' + I18n.$t('10085');
                }
                this.memo = this.pageData[i].memo; // 当前选中币种的标签是否显示
                this.openChains = this.pageData[i].openChains; // 当前选中币种的链名称是否显示
                this.rechargeAddr = this.pageData[i].rechargeAddr; // 当前选中币种的充币地址
                this.setQrCodeImg(); // 当前选中币种的二维码
                this.setLabelTips(); // 当前选中币种的标签提示语句
            }
        }
    },
    setLabelTips() {
        this.labelTips = '充值' + this.form.selectCheck + '同时需要一个充币地址和' + this.form.selectCheck + '标签；警告：如果未遵守正确的' + this.form.selectCheck + '充币步骤，币会有丢失风险！';
    },
    setQrCodeImg() {
        if (document.getElementsByClassName('QrCodeImg')[0].innerHTML !== '') {
            document.getElementsByClassName('QrCodeImg')[0].innerHTML = '';
        }
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
            // menuWidth: 384,
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
            return window.$message({ title: I18n.$t('10410') /* '提示' */, content: '复制成功', type: 'success' });
        }
    },
    changeBtnflag(index, title) {
        this.btnCheckFlag = index;
        let wType = null;
        for (const i of this.chains) {
            if (i.name === title) {
                wType = i.attr;
            }
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
        // 获取当前网址，如：http://localhost:8080/#!/recharge?wType=USDT
        const currencyType = window.document.location.href.toString().split('=')[1];
        if (currencyType) {
            this.coinParam = currencyType;
            this.setPageData();
        }
        this.nameTips =
        ['USDT-ERC20是Tether泰达公司基于ETH网络发行的USDT，充币地址是ETH地址，充提币走ETH网络，USDT-ERC20使用的是ERC20协议。',
            'USDT-TRC20(USDT-TRON)是Tether泰达公司基于TRON网络发行的USDT，充币地址是TRON地址，充提币走TRON网络，USDT-TRC20(USDT-TRON)使用的是TRC20协议。',
            'USDT-Omni是Tether泰达公司基于BTC网络发行的USDT，充币地址是BTC地址，充提币走BTC网络，USDT-Omni使用的协议是建立在BTC区块链网络上的omni layer协议。'];
        wlt.init();
        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.MSG_WLT_READY,
            cb: () => {
                this.setPageData();
            }
        });
        this.setPageData();
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