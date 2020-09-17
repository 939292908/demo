const Http = require('@/api').webApi;
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const Qrcode = require('qrcode');
const I18n = require('@/languages/I18n').default;
const gM = require('@/models/globalModels');

const model = {
    pageData: [], // 所需数据
    USDTLabel: [], // 链名称
    selectList: [], // 下拉列表
    tips: '', // 提示
    tipsAry: [], // 提示数组
    uId: '', // 用户uId
    rechargeAddr: '', // 充币地址
    btnCheckFlag: null, // 默认选中第一个
    labelTips: '', // 标签提示
    nameTips: null,
    memo: null, // 是否显示标签
    openChains: null, // 是否显示链名称
    showCurrencyMenu: false, // show币种菜单
    coinParam: null, // 传过来的币种
    chains: null, // 链名称
    chainAry: [], // 链名称数组
    flagReq: false, // 优化请求
    pageIsShow: false, // loading
    setPageData() {
        console.log(1);
        if (JSON.stringify(wlt.wallet['03']) !== '[]') {
            if (model.flagReq) {
                return;
            }
            model.pageData = []; // 初始化
            model.setUSDTLabelAndSelectList();
            model.initSelectList();
            for (const i in wlt.wallet['03']) {
                if (wlt.wallet['03'][i].Setting.canRecharge) { // 能否充值
                    const item = {};
                    const walletI = wlt.wallet['03'][i];
                    item.canRecharge = walletI.Setting.canRecharge; // 能否充值
                    item.promptRecharge = walletI.promptRecharge; // 充值提示
                    item.openChains = walletI.Setting.openChains; // 是否显示链名称
                    item.wType = walletI.wType; // 币种
                    item.memo = walletI.Setting.memo; // 是否显示标签
                    Http.GetRechargeAddr({
                        wType: walletI.wType
                    }).then(function(arg) {
                        // console.log('nzm', 'GetRechargeAddr success', arg);
                        item.rechargeAddr = arg.rechargeAddr; // 充币地址
                        item.networkNum = arg.trade.networkNum; // 网络数
                        model.pageData.push(item);
                        model.setTipsAndAddrAndCode();
                        model.pageIsShow = true;
                        m.redraw();
                    }).catch(function(err) {
                        console.log('nzm', 'GetRechargeAddr error', err);
                    });
                }
            }
            model.flagReq = true;
        }
    },
    setUSDTLabelAndSelectList() {
        if (wlt.coinInfo.USDT !== undefined) {
            model.chains = wlt.coinInfo.USDT.chains;
            for (const i of model.chains) {
                Http.GetRechargeAddr({
                    wType: i.attr
                }).then(function(arg) {
                    // console.log('nzm', 'GetRechargeAddr success', arg);
                    model.chainAry.push(arg);
                    m.redraw();
                }).catch(function(err) {
                    console.log('nzm', 'GetRechargeAddr error', err);
                });
            }
            model.USDTLabel = Array.from(wlt.coinInfo.USDT.chains);
            const ary = [];
            for (let i = 0; i < model.USDTLabel.length; i++) {
                ary.push(model.USDTLabel[i].name);
            }
            model.USDTLabel = ary;
            // 需按顺序显示
            for (const i of wlt.wallet['03']) {
                if (i.wType === 'USDT') {
                    for (const j in i.Setting) {
                        if (j.search('canRechargeUSDT-') > -1) {
                            if (!i.Setting[j]) {
                                model.USDTLabel = model.USDTLabel.filter((x) => x !== j.split('canRechargeUSDT-')[1]);
                            }
                        }
                    }
                }
            }
            model.btnCheckFlag = model.USDTLabel[0];
        }
    },
    // 初始化币种
    initSelectList() {
        model.selectList = []; // 初始化
        for (const i of wlt.wallet['03']) {
            if (i.Setting.canRecharge) {
                model.selectList.push({ label: i.wType + ' | ' + wlt.coinInfo[i.wType].name, id: i.wType });
                if (model.coinParam === null) {
                    if (model.option.currentId === 1) {
                        model.option.currentId = model.selectList[0].id;
                    }
                }
            }
        }
    },
    // 切换币种时的操作
    setTipsAndAddrAndCode(txt) {
        if (txt) {
            this.btnCheckFlag = txt;
        }
        // console.log('setTipsAndAddrAndCode', JSON.stringify(model.pageData));
        for (const i in model.pageData) {
            if (model.pageData[i].wType === model.option.currentId) {
                let networkNum = null;
                if (model.option.currentId === 'USDT') {
                    // 链名称与USDT
                    for (const i of model.chainAry) {
                        if ((model.btnCheckFlag !== 'OMNI' ? 'USDT' + model.btnCheckFlag : 'USDT') === i.wType) {
                            networkNum = i.trade.networkNum;
                        }
                    }
                } else {
                    // 未点击链名称
                    networkNum = model.pageData[i].networkNum;
                }

                /* 清空温馨提示 */
                model.tips = '';

                // 小部分温馨提示
                const fractionTip =
                    /* 禁止向{value}地址充币除{value}之外的资产,任何充入{value}地址的非{value}资产将不可找回 */
                    I18n.$t('10083', { value: model.option.currentId }) +

                    /* 使用{value1}地址充币需要{value2}个网络确认才能到账 */
                    '*' + I18n.$t('10084', { value1: model.option.currentId, value2: networkNum }) +

                    /* 关于标签{value}充币时同时需要一个充币地址和{value}标签。标签是一种保证您的充币地址唯一性的数字串，与充币地址成对出现并一一对应。请您务必遵守正确的{value}充币步骤，在提币时输入完整的信息，否则将面临丢失币的风险！ */
                    (model.option.currentId === 'EOS' || model.option.currentId === 'XRP' ? '*' + I18n.$t('10545', { value: model.option.currentId }) : '') +

                    /* '默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户' */
                    '*' + I18n.$t('10085');

                model.tips = model.pageData[i].promptRecharge !== 0 ? model.pageData[i].promptRecharge + fractionTip : fractionTip;

                const ary = [];
                for (const i of model.tips.split('*')) {
                    if (i !== '') {
                        ary.push(i);
                    }
                }
                model.tipsAry = ary;

                model.memo = model.pageData[i].memo; // 当前选中币种的标签是否显示
                model.openChains = model.pageData[i].openChains; // 当前选中币种的链名称是否显示

                model.option.currentId !== 'USDT' ? model.rechargeAddr = model.pageData[i].rechargeAddr /* 当前选中币种的充币地址 */ : model.changeBtnflag(model.btnCheckFlag); /* USDT选中链名称的充币地址 */

                model.setQrCodeImg(); // 当前选中币种的二维码
                model.setLabelTips(); // 当前选中币种的标签提示语句
            }
        }
    },
    setLabelTips() {
        /* '充值{VALUE}同时需要一个充币地址和{VALUE}标签；警告：如果未遵守正确的{VALUE}充币步骤，币会有丢失风险！'; */
        model.labelTips = I18n.$t('10518', { VALUE: model.option.currentId });
    },
    rechargeAddrSrc: '', // 充币地址二维码
    setQrCodeImg() {
        Qrcode.toDataURL(model.rechargeAddr || '无')
            .then(url => {
                model.rechargeAddrSrc = url;
            }).catch(err => {
                console.log(err);
            });
    },
    // 复制文本
    copyText() {
        var div = document.getElementsByClassName('currencyAddr-text')[0];
        if (this.rechargeAddr !== '') {
            if (document.body.createTextRange) {
                const range = document.body.createTextRange();
                range.moveToElementText(div);
                range.select();
            } else if (window.getSelection) {
                var selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(div);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                console.warn("none");
            }
            document.execCommand("Copy"); // 执行浏览器复制命令
            return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10546') /* '复制成功' */, type: 'success' });
        }
    },
    // 链名称切换
    changeBtnflag(title) {
        model.btnCheckFlag = title;
        for (const i of model.chainAry) {
            if ((model.btnCheckFlag !== 'OMNI' ? 'USDT' + model.btnCheckFlag : 'USDT') === i.wType) {
                model.rechargeAddr = i.rechargeAddr;
            }
        }
        m.redraw();
    },
    // 币种 菜单配置
    option: {
        evenKey: "optionkey",
        showMenu: false,
        currentId: 1,
        updateOption (option) {
            this.showMenu = option.showMenu;
            this.currentId = option.currentId ? option.currentId : this.currentId;
        },
        menuClick() {
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
        this.pageIsShow = false;
        const currencyType = window.router.getUrlInfo().params.wType;
        if (currencyType !== undefined) {
            model.coinParam = currencyType;
            model.option.currentId = currencyType;
            model.setPageData();
        }

        if (JSON.stringify(this.pageData) !== '[]') {
            model.pageIsShow = true;
        }

        wlt.init();

        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.MSG_WLT_READY,
            cb: () => {
                model.setPageData();
            }
        });
        model.setPageData();

        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: () => {
                model.setTipsAndAddrAndCode();
            }
        });

        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.GET_USER_INFO_READY,
            cb: () => {
                model.uId = gM.getAccount().uid;
            }
        });
        model.uId = gM.getAccount().uid;
    },
    copyEditText: function (e) {
        this.rechargeAddr = '123';
        console.log(window.clipboardData);
        window.event.clipboardData.setData('text/plain', this.rechargeAddr);
        window.event.e.preventDefault();
        window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10546') /* '复制成功' */, type: 'success' });
    },
    updateFn: function (vnode) { },
    removeFn: function () {
        broadcast.offMsg({
            key: 'index',
            isall: true
        });
        wlt.remove();
    }
};
module.exports = model;