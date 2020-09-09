const Http = require('@/api').webApi;
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const Qrcode = require('qrcode');
const I18n = require('@/languages/I18n').default;

const model = {
    pageData: [], // 所需数据
    USDTLabel: [], // 链名称
    selectList: [], // 下拉列表
    tips: '', // 提示
    uId: '', // 用户uId
    rechargeAddr: '', // 充币地址
    qrcodeDisplayFlag: false,
    btnCheckFlag: null, // 默认选中第一个
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
        this.selectList = []; // 初始化
        this.setUSDTLabelAndSelectList();
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
                    that.setTipsAndAddrAndCode();
                    m.redraw();
                }).catch(function(err) {
                    console.log('nzm', 'GetRechargeAddr error', err);
                });
            }
        }
    },
    chainAry: [],
    setUSDTLabelAndSelectList() {
        const that = this;
        if (wlt.coinInfo.USDT !== undefined) {
            this.chains = wlt.coinInfo.USDT.chains;
            for (const i of this.chains) {
                Http.GetRechargeAddr({
                    wType: i.attr
                }).then(function(arg) {
                    // console.log('nzm', 'GetRechargeAddr success', arg);
                    that.chainAry.push(arg);
                    m.redraw();
                }).catch(function(err) {
                    console.log('nzm', 'GetRechargeAddr error', err);
                });
            }
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
            this.btnCheckFlag = this.USDTLabel[0];
        }
        for (const i of wlt.wallet['03']) {
            if (i.Setting.canRecharge) {
                this.selectList.push({ label: i.wType + ' | ' + wlt.coinInfo[i.wType].name, id: i.wType });
                if (this.coinParam === null) {
                    if (this.option.currentId === 1) {
                        this.option.currentId = this.selectList[0].id;
                    }
                }
            }
        }
    },
    // 切换币种时的操作
    setTipsAndAddrAndCode() {
        for (const i in this.pageData) {
            if (this.pageData[i].wType === this.option.currentId) {
                let networkNum = null;
                if (this.option.currentId === 'USDT') {
                    for (const i of this.chainAry) {
                        if ((this.btnCheckFlag !== 'OMNI' ? 'USDT' + this.btnCheckFlag : 'USDT') === i.wType) {
                            networkNum = i.trade.networkNum;
                        }
                    }
                } else {
                    networkNum = this.pageData[i].networkNum;
                }

                this.tips = this.pageData[i].promptRecharge !== 0
                    ? this.pageData[i].promptRecharge +
                        // this.tips = '您只能向此地址充值' + this.option.currentId + '，其他资产充入' + this.option.currentId + '地址将无法找回' +
                        /* 禁止向{value}地址充币除{value}之外的资产,任何充入{value}地址的非{value}资产将不可找回 */
                        I18n.$t('10083', { value: this.option.currentId }) +

                        /* 使用{value1}地址充币需要{value2}个网络确认才能到账 */
                        '*' + I18n.$t('10084', { value1: this.option.currentId, value2: networkNum }) +

                        /* 关于标签{value}充币时同时需要一个充币地址和{value}标签。标签是一种保证您的充币地址唯一性的数字串，与充币地址成对出现并一一对应。请您务必遵守正确的{value}充币步骤，在提币时输入完整的信息，否则将面临丢失币的风险！ */
                        (this.option.currentId === 'EOS' || this.option.currentId === 'XRP' ? '*' + I18n.$t('10545', { value: this.option.currentId }) : '') +

                        /* '默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户' */
                        '*' + I18n.$t('10085')

                    : '' +
                        // this.tips = '您只能向此地址充值' + this.option.currentId + '，其他资产充入' + this.option.currentId + '地址将无法找回' +
                        /* 禁止向{value}地址充币除{value}之外的资产,任何充入{value}地址的非{value}资产将不可找回 */
                        I18n.$t('10083', { value: this.option.currentId }) +

                        /* 使用{value1}地址充币需要{value2}个网络确认才能到账 */
                        '*' + I18n.$t('10084', { value1: this.option.currentId, value2: networkNum }) +

                        /* 关于标签{value}充币时同时需要一个充币地址和{value}标签。标签是一种保证您的充币地址唯一性的数字串，与充币地址成对出现并一一对应。请您务必遵守正确的{value}充币步骤，在提币时输入完整的信息，否则将面临丢失币的风险！ */
                        (this.option.currentId === 'EOS' || this.option.currentId === 'XRP' ? '*' + I18n.$t('10545', { value: this.option.currentId }) : '') +

                        /* '默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户' */
                        '*' + I18n.$t('10085');

                this.memo = this.pageData[i].memo; // 当前选中币种的标签是否显示
                this.openChains = this.pageData[i].openChains; // 当前选中币种的链名称是否显示

                if (this.option.currentId !== 'USDT') {
                    this.rechargeAddr = this.pageData[i].rechargeAddr; // 当前选中币种的充币地址
                } else {
                    this.changeBtnflag(this.btnCheckFlag);
                }
                this.setQrCodeImg(); // 当前选中币种的二维码
                this.setLabelTips(); // 当前选中币种的标签提示语句
            }
        }
    },
    setLabelTips() {
        /* '充值' + this.option.currentId + '同时需要一个充币地址和' + this.option.currentId + '标签；警告：如果未遵守正确的' + this.option.currentId + '充币步骤，币会有丢失风险！'; */
        this.labelTips = I18n.$t('10518', { VALUE: this.option.currentId });
    },
    rechargeAddrSrc: '', // 充币地址二维码
    setQrCodeImg() {
        Qrcode.toDataURL(this.rechargeAddr || '无')
            .then(url => {
                this.rechargeAddrSrc = url;
            }).catch(err => {
                console.log(err);
            });
    },
    // 是否显示二维码
    changeQrcodeDisplay(type) {
        type === 'show' ? this.qrcodeDisplayFlag = true : this.qrcodeDisplayFlag = false;
    },
    // 复制文本
    copyText() {
        const ele = document.getElementsByClassName('addrText')[0];
        if (ele.value) {
            ele.select(); // 选择对象
            document.execCommand("copy", false, null);
            return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10546') /* '复制成功' */, type: 'success' });
        }
    },
    // 链名称切换
    changeBtnflag(title) {
        this.btnCheckFlag = title;
        for (const i of this.chainAry) {
            if ((this.btnCheckFlag !== 'OMNI' ? 'USDT' + this.btnCheckFlag : 'USDT') === i.wType) {
                this.rechargeAddr = i.rechargeAddr;
            }
        }
        m.redraw();
    },
    // 币种 菜单配置
    option: {
        evenKey: "optionkey",
        showMenu: false,
        currentId: 1,
        setOption (option) {
            this.showMenu = option.showMenu;
            this.currentId = option.currentId ? option.currentId : this.currentId;
        },
        menuClick(item) {
            // model.selectCheck = item.id;
            model.setTipsAndAddrAndCode();
            m.redraw();
        },
        renderHeader(item) {
            return m('div', { class: `selectDiv` }, [
                m('span', { class: `has-text-primary` }, item?.label)
            ]);
        },
        menuList() {
            return model.selectList;
        }
    },
    initFn: function () {
        const currencyType = window.router.getUrlInfo().params.wType;
        if (currencyType !== undefined) {
            this.coinParam = currencyType;
            this.option.currentId = currencyType;
            this.setPageData();
        }

        this.nameTips =
        [I18n.$t('10400') /* 'USDT-ERC20是Tether泰达公司基于ETH网络发行的USDT，充币地址是ETH地址，充提币走ETH网络，USDT-ERC20使用的是ERC20协议。' */,
            I18n.$t('10507') /* 'USDT-TRC20(USDT-TRON)是Tether泰达公司基于TRON网络发行的USDT，充币地址是TRON地址，充提币走TRON网络，USDT-TRC20(USDT-TRON)使用的是TRC20协议。' */,
            I18n.$t('10508')/* 'USDT-Omni是Tether泰达公司基于BTC网络发行的USDT，充币地址是BTC地址，充提币走BTC网络，USDT-Omni使用的协议是建立在BTC区块链网络上的omni layer协议。' */];

        wlt.init();

        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.MSG_WLT_READY,
            cb: () => {
                this.setPageData();
            }
        });
        this.setPageData();

        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: (arg) => {
                this.setTipsAndAddrAndCode();
            }
        });
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
module.exports = model;