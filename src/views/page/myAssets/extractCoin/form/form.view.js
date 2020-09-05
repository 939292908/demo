const m = require('mithril');
require('./index.scss');
const FromDataMode = require('./form.logic');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const Tooltip = require('@/views/components/common/Tooltip/Tooltip.view');
// const Dropdown = require('@/views/components/common/Dropdown');
const l180n = require('@/languages/I18n').default;

module.exports = {
    oninit () {
        const initWType = m.parseQueryString(m.route.get().split('?')[1])?.wType;
        FromDataMode.oninit(initWType);
    },
    handleSelectChange: function (e) {
        FromDataMode.currentSelect = FromDataMode.selectList[e.target.selectedIndex];
        FromDataMode.getlinkButtonListData();
    },
    handleLabelVal: function (e) {
        FromDataMode.extractCoin.linkName = e.target.value;
    },
    handleLinNameButClick: function (e) {
        FromDataMode.currenLinkBut = e.attr;
        FromDataMode.getCurrentFeesChange(true);
    },
    handleAddressVal: function (e) {
        FromDataMode.extractCoin.address = e.target.value;
        FromDataMode.errorShow.address.show = !e.target.value.toString();
        FromDataMode.errorShow.address.text = l180n.$t('10401')/* '提币地址不能为空' */;
    },
    handleExtractCoinNameVal: function (e) {
        console.log(e);
        FromDataMode.extractCoin.coinNum = e.target.value;
        if (e.target.value - FromDataMode.currentFees.withdrawMin < 0 || e.target.value - FromDataMode.currentExtractableNum > 0) {
            FromDataMode.errorShow.unmber.show = true;
            if (e.target.value - FromDataMode.currentFees.withdrawMin < 0) {
                FromDataMode.errorShow.unmber.text = l180n.$t('10397')/* '不可小于最小提币量 ' */;
            } else {
                FromDataMode.errorShow.unmber.text = l180n.$t('10398')/* '不可超过可提数量' */;
            }
        } else {
            FromDataMode.errorShow.unmber.show = false;
        }
    },
    handleClickAll: function () {
        FromDataMode.extractCoin.coinNum = FromDataMode.currentExtractableNum;
        FromDataMode.errorShow.unmber.show = false;
    },
    handleCloseDialog: function () {
        FromDataMode.popUpData.show = false;
    },
    handleBack: function () {
        window.router.go(-1);
    },
    view: function () {
        return m('div.page-extract-coin-from border-radius-small has-bg-level-2', [
            m('div.form-block', [
                m('div.formModule', [
                    m('div.topLabel has-text-title body-5', l180n.$t('10063') /* '币种' */),
                    m('div.control changeCoin', [
                        m('div', { class: `my-dropdown dropdown ${FromDataMode.showCurrencyMenu ? " is-active" : ''}` }, [
                            m('div', { class: "dropdown-trigger has-text-1" }, [
                                m('button', {
                                    class: `button`,
                                    onclick: (e) => {
                                        FromDataMode.showCurrencyMenu = !FromDataMode.showCurrencyMenu;
                                    }
                                }, [
                                    m('p', { class: `my-trigger-text` }, [
                                        m('span', { class: `has-text-level-4` }, FromDataMode.currentSelect.label)
                                    ]),
                                    m('i', { class: "my-trigger-icon iconfont icon-xiala has-text-primary" }) // icon
                                ])
                            ]),
                            m('div', { class: "dropdown-menu " }, [
                                m('div', { class: "dropdown-content", style: "max-height: 400px; overflow: auto;" },
                                    FromDataMode.selectList.map((item, index) => {
                                        return m('a', {
                                            class: `dropdown-item has-hover ${FromDataMode.selectActiveId.wType === item.id ? 'has-active' : ''}`,
                                            key: item.id + index,
                                            onclick () {
                                                FromDataMode.selectActiveId.wType = item.id; // 修改选中id
                                                FromDataMode.currentSelect = item;
                                                FromDataMode.showCurrencyMenu = false; // 关闭菜单
                                                FromDataMode.getlinkButtonListData();
                                            }
                                        }, [
                                            m('span', { class: `my-menu-label` }, [
                                                m('span', { class: `mr-2` }, item.label),
                                                m('span', { class: `has-text-level-4` }, item.coinName)
                                            ]),
                                            m('i', { class: `my-menu-icon iconfont icon-fabijiaoyiwancheng ${FromDataMode.selectActiveId.wType === item.id ? '' : 'is-hidden'}` }) // icon
                                        ]);
                                    })
                                )
                            ])
                        ])
                    ])
                ]),
                FromDataMode.currentSelect.Setting && FromDataMode.currentSelect.Setting.memo ? m('div.formModule', [
                    m('div.topLabel has-text-title body-5', [
                        m('span', l180n.$t('10098') /* '标签' */),
                        m(Tooltip, { label: m('i.iconfont icon-Tooltip'), content: l180n.$t('10399') /* 填写错误可能导致资产丢失，请仔细核对 */ })
                    ]),
                    m('div.control line-label', [
                        m('input.input body-5 border-radius-small', { type: 'text', placeholder: l180n.$t('10098'), onchange: this.handleLabelVal, value: FromDataMode.extractCoin.linkName })
                    ])
                ]) : null,
                FromDataMode.linkButtonList.length > 0 ? m('div.formModule', [
                    m('div.topLabel has-text-title body-5', [
                        m('span', l180n.$t('10100') /* '链名称' */),
                        m(Tooltip, {
                            label: m('i.iconfont icon-Tooltip'),
                            content: m('div.min-width-250', {}, [
                                m('p', {}, [
                                    'USDT-ERC20是Tether泰达公司基于ETH网络发行的USDT，充币地址是ETH地址，充提币走ETH网络，USDT-ERC20使用的是ERC20协议。'
                                ]),
                                m('p', {}, [
                                    'USDT-TRC20(USDT-TRON)是Tether泰达公司基于TRON网络发行的USDT，充币地址是TRON地址，充提币走TRON网络，USDT-TRC20(USDT-TRON)使用的是TRC20协议。USDT-Omni是Tether泰达公司基于BTC网络发行的USDT，充币地址是BTC地址，充提币走BTC网络，USDT-Omni使用的协议是建立在BTC区块链网络上的omni layer 协议。'
                                ]),
                                m('p', {}, [
                                    'USDT-Omni是Tether泰达公司基于BTC网络发行的USDT，充币地址是BTC地址，充提币走BTC网络，USDT-Omni使用的协议是建立在BTC区块链网络上的omni layer 协议。'
                                ])
                            ])
                            // `USDT-ERC20是Tether泰达公司基于ETH网络发行的USDT，充币地址是ETH地址，充提币走ETH网络，USDT-ERC20使用的是ERC20协议。'USDT-TRC20(USDT-TRON)是Tether泰达公司基于TRON网络发行的USDT，充币地址是TRON地址，充提币走TRON网络，USDT-TRC20(USDT-TRON)使用的是TRC20协议。'USDT-Omni是Tether泰达公司基于BTC网络发行的USDT，充币地址是BTC地址，充提币走BTC网络，USDT-Omni使用的协议是建立在BTC区块链网络上的omni layer 协议。`
                        })
                    ]),
                    m('div.control dis-flex', [
                        FromDataMode.linkButtonList.map(item => m(`div.butItem`, { class: item.attr === FromDataMode.currenLinkBut ? 'butItemActive' : '', onclick: this.handleLinNameButClick.bind(this, item) }, m('div', item.name)))
                    ])
                ]) : null,
                m('div.formModule', [
                    m('div.topLabel has-text-title body-5', l180n.$t('10103') /* '提币地址' */),
                    m('div.control address', [
                        m('input.input body-5 border-radius-small', { type: 'text', placeholder: '', onchange: this.handleAddressVal, value: FromDataMode.extractCoin.address })
                    ]),
                    FromDataMode.errorShow.address.show ? m('div.errorToTal body-4', FromDataMode.errorShow.address.text) : null
                ]),
                m('div.formModule', [
                    m('div.topLabel has-text-title body-5', [
                        m('span', l180n.$t('10089') /* '数量' */),
                        m(Tooltip, { label: m('i.iconfont icon-Tooltip'), content: l180n.$t('10406') })
                    ]),
                    m('div.control extract-num', [
                        m('input.input body-5 border-radius-small', { type: 'number', placeholder: `${l180n.$t('10105') /* '最小提币量' */}：${FromDataMode.currentFees.withdrawMin}`, onchange: this.handleExtractCoinNameVal, value: FromDataMode.extractCoin.coinNum }),
                        m('div.icon-right-all', [
                            m('span', FromDataMode.currentSelect.wType),
                            m('span.clickAll', { onclick: this.handleClickAll }, l180n.$t('10106') /* '全部' */)
                        ])
                    ]),
                    FromDataMode.errorShow.unmber.show ? m('div.errorToTal body-4', FromDataMode.errorShow.unmber.text) : null,
                    m('div.dis-flex item-space charge body-4', [
                        m('div', `${l180n.$t('10107') /* '可提' */}：${FromDataMode.currentExtractableNum}${FromDataMode.currentSelect.wType}`),
                        m('div', `${l180n.$t('10099') /* '手续费' */}：${FromDataMode.currentFees.withdrawFee}${FromDataMode.currentSelect.wType}`)
                    ])
                ]),
                m('button.button is-info is-fullwidth', { onclick: () => { FromDataMode.handleSubmit(); } }, l180n.$t('10337') /* '确定' */)
            ]),
            FromDataMode.popUpData.show ? m(VerifyView, { close: FromDataMode.isChangeClose ? this.handleBack : this.handleCloseDialog, ...FromDataMode.popUpData }) : null,
            m('div.promptText', [
                m('div.promptTitle body-5', l180n.$t('10082') /* '温馨提示' */),
                // FromDataMode.promptText.split('*').map(item => m('div.rulesText body-4', '*' + item))
                l180n.$t('10407').split('*').map(item => m('div.rulesText body-4', '*' + item))
            ])
        ]);
    },
    onremove: function() {
        FromDataMode.onremove();
        this.handleCloseDialog();
    }
};