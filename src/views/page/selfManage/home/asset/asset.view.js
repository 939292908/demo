const m = require('mithril');
const Echarts = require('@/libs/echarts');
const AssetData = require('./asset.logic');
require('./asset.scss');

module.exports = {
    oninit: function () {
        AssetData.oninit();
    },
    oncreate: function () {
        const myChart = Echarts.init(document.getElementById('AssetsPie'));
        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    type: 'pie',
                    left: 'center',
                    top: 'middle',
                    radius: [20, 110],
                    center: ['25%', '50%'],
                    roseType: 'radius',
                    label: {
                        show: false
                    },
                    data: [
                        { value: 10, name: 'rose1' },
                        { value: 5, name: 'rose2' },
                        { value: 15, name: 'rose3' },
                        { value: 25, name: 'rose4' },
                        { value: 20, name: 'rose5' }
                    ]
                }
            ]
        });
    },
    getallMoneyVnode: function () {
        return m.fragment(m('div.data-item mb-7', [
            m('div.data-text mb-1', '资产总额'),
            m('div.data-price mb-1', `${AssetData.AssetOverview.coinToBTC}BTC`)
        ]),
        m('div.dis-flex align-center', [
            m('div.data-item', [
                m('div.data-text mb-1', '资产估值'),
                m('div.data-price mb-1', `${AssetData.AssetOverview.coinToCNY}`)
            ])
        ]));
    },
    getContractVnode: function () {
        return m.fragment(m('div.data-item mb-7', [
            m('div.data-text mb-1', '账户权益'),
            m('div.data-price mb-1', `${AssetData.AssetOverview.coinToBTC}BTC`),
            m('div.data-text', `≈ ￥${AssetData.AssetOverview.coinToCNY}`)
        ]),
        m('div.dis-flex align-center', [
            m('div.data-item mr-9', [
                m('div.data-text mb-1', '保证金余额'),
                m('div.data-price mb-1', `${AssetData.AssetOverview.NLToBTC}BTC`),
                m('div.data-text', `≈ ￥${AssetData.AssetOverview.NLToCRN}`)
            ]),
            m('div.data-item', [
                m('div.data-text mb-1', '未实现盈亏'),
                m('div.data-price mb-1', `${AssetData.AssetOverview.UPNLToBTC}BTC`),
                m('div.data-text', `≈ ￥${AssetData.AssetOverview.UPNLToCRN}`)
            ])
        ]));
    },
    view: function () {
        return m('div.self-manage-content-block mb-5', [
            // block header
            m('.asset-header dis-flex justify-between align-center', [
                m('div.asset-title', [
                    m('span', '资产总览'),
                    m('i.iconfont icon-xiala')
                ]),
                m('div', m('i.iconfont icon-xiala'))
            ]),
            // 正文
            m('div.asset-content', [
                m('.asset-tabs dis-flex align-center', [
                    AssetData.walletList.map(item => m('div.tab mr-7', { onclick: () => { AssetData.handleChangeWallet(item); } }, [
                        m('span.circle', { class: AssetData.walletAcId === item.activeId ? 'activeCircle' : '' }),
                        m('span.name', { class: AssetData.walletAcId === item.activeId ? 'has-text-title' : '' }, item.label)
                    ]))
                ]),
                m('div.asset-data-block dis-flex justify-between align-center', [
                    m('div.asset-data', [
                        AssetData.walletAcId === '01' ? this.getContractVnode() : this.getallMoneyVnode(),
                        AssetData.walletAcId === 'all' || AssetData.walletAcId === '04' ? m('div.but-list dis-flex align-center mt-5', [
                            AssetData.LBList.map(item => m('div.but-item mr-3', { onclick: () => { AssetData.handleClickLBItem(item); } }, item.label))
                        ]) : null
                    ]),
                    m('div.data-echarts', m('div#AssetsPie', { style: 'width: 400px;height: 220px' }))
                ])
            ])
        ]);
    },
    onremove: function () {
        AssetData.onremove();
    }
};