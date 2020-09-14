const m = require('mithril');
const Echarts = require('@/libs/echarts');
const AssetData = require('./asset.logic');
const options = require('./pir');
const I18n = require('@/languages/I18n').default;
require('./asset.scss');

const assetView = {
    myChart: null,
    highlight: 9,
    oninit: function () {
        AssetData.oninit();
    },
    oncreate: function () {
        this.myChart = Echarts.init(document.getElementById('AssetsPie'));
        this.myChart.setOption(options);
        this.myChart.on('mouseout', this.echartMouseout.bind(this));
    },
    echartMouseover: function (e) {
        this.myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: this.highlight
        });
    },
    echartMouseout: function (e) {
        this.myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: this.highlight
        });
    },
    handleActivePir: function (item) {
        if (!item) return;
        this.echartMouseover();
        if (item[1] === 0) return AssetData.handleChangeWallet(item[0]);
        AssetData.handleChangeWallet(item[0]);
        this.highlight = item[1] - 1;
        this.myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: this.highlight
        });
    },
    getallMoneyVnode: function () {
        return m.fragment(m('div.data-item mb-7', [
            m('div.data-text mb-1', I18n.$t('10212') /* '资产总额' */),
            m('div.data-price mb-1', `${AssetData.AssetOverview.coinToBTC}BTC`)
        ]),
        m('div.dis-flex align-center', [
            m('div.data-item', [
                m('div.data-text mb-1', I18n.$t('10213') /* '资产估值' */),
                m('div.data-price mb-1', `${AssetData.AssetOverview.coinToCNY}CNY`)
            ])
        ]));
    },
    getContractVnode: function () {
        return m.fragment(m('div.data-item mb-7', [
            m('div.data-text mb-1', I18n.$t('10076') /* '账户权益' */),
            m('div.data-price mb-1', `${AssetData.AssetOverview.coinToBTC}BTC`),
            m('div.data-text', `≈ ￥${AssetData.AssetOverview.coinToCNY}CNY`)
        ]),
        m('div.dis-flex align-center', [
            m('div.data-item mr-9', [
                m('div.data-text mb-1', I18n.$t('10219') /* '保证金余额' */),
                m('div.data-price mb-1', `${AssetData.AssetOverview.NLToBTC}BTC`),
                m('div.data-text', `≈ ￥${AssetData.AssetOverview.NLToCRN}CNY`)
            ]),
            m('div.data-item', [
                m('div.data-text mb-1', I18n.$t('10077') /* '未实现盈亏' */),
                m('div.data-price mb-1', `${AssetData.AssetOverview.UPNLToBTC}BTC`),
                m('div.data-text', `≈ ￥${AssetData.AssetOverview.UPNLToCRN}CNY`)
            ])
        ]));
    },
    view: function () {
        return m('div.self-manage-content-block mb-5', [
            // block header
            m('.asset-header dis-flex justify-between align-center', [
                m('div.asset-title', { onclick: () => { AssetData.handleEditShow(); } }, [
                    m('span', I18n.$t('10152') /* '资产总览' */),
                    AssetData.isShow ? m('i.iconfont icon-yincang  cur-pri') : m('i.iconfont icon-zichanzhengyan  cur-pri')
                ]),
                m('div.cur-pri', m('i.iconfont icon-arrow-right'))
            ]),
            // 正文
            m('div.asset-content', [
                m('.asset-tabs dis-flex align-center', [
                    AssetData.walletList.map((item, i) => m('div.tab mr-7', { onclick: this.handleActivePir.bind(this, [item, i]) }, [
                        m('span.circle', { class: AssetData.walletAcId === item.activeId ? 'activeCircle' : '' }),
                        m('span.name', { class: AssetData.walletAcId === item.activeId ? 'has-text-primary' : '' }, item.label)
                    ]))
                ]),
                m('div.asset-data-block dis-flex justify-between align-center', [
                    m('div.asset-data', [
                        AssetData.walletAcId === '01' ? this.getContractVnode() : this.getallMoneyVnode(),
                        AssetData.walletAcId === 'all' ? m('div.but-list dis-flex align-center mt-5', [
                            AssetData.LBList.map(item => m('div.but-item mr-3', { onclick: () => { AssetData.handleClickLBItem(item); } }, item.label))
                        ]) : null,
                        AssetData.walletAcId === '04' ? m('div.but-list dis-flex align-center mt-5', [
                            AssetData.legalList.map(item => m('div.but-item mr-3', { onclick: () => { AssetData.handleClickLBItem(item); } }, item.label))
                        ]) : null
                    ]),
                    m('div.data-echarts', m('div#AssetsPie', { style: 'width: 528px;height: 220px' }))
                ])
            ])
        ]);
    },
    onremove: function () {
        AssetData.onremove();
    }
};

module.exports = assetView;