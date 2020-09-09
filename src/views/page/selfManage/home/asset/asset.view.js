const m = require('mithril');
require('./asset.scss');

module.exports = {
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
                    m('div.tab mr-7', [
                        m('span.circle'),
                        m('span.name', '资产总览')
                    ]),
                    m('div.tab mr-7', [
                        m('span.circle'),
                        m('span.name', '资产总览')
                    ]),
                    m('div.tab mr-7', [
                        m('span.circle'),
                        m('span.name', '资产总览')
                    ]),
                    m('div.tab mr-7', [
                        m('span.circle'),
                        m('span.name', '资产总览')
                    ])
                ]),
                m('div.asset-data-block dis-flex justify-between align-center', [
                    m('div.asset-data', [
                        m('div.data-item mb-7', [
                            m('div.data-text mb-1', '账户权益'),
                            m('div.data-price mb-1', '9.000000 BTC'),
                            m('div.data-text', '≈ ￥0.00')
                        ]),
                        m('div.dis-flex align-center', [
                            m('div.data-item mr-9', [
                                m('div.data-text mb-1', '保证金余额'),
                                m('div.data-price mb-1', '9.000000 BTC'),
                                m('div.data-text', '≈ ￥0.00')
                            ]),
                            m('div.data-item', [
                                m('div.data-text mb-1', '未实现盈亏'),
                                m('div.data-price mb-1', '9.000000 BTC'),
                                m('div.data-text', '≈ ￥0.00')
                            ])
                        ]),
                        m('div.but-list dis-flex align-center mt-5', [
                            m('div.but-item mr-3', '充币'),
                            m('div.but-item mr-3', '充币'),
                            m('div.but-item mr-3', '充币'),
                            m('div.but-item mr-3', '充币'),
                            m('div.but-item mr-3', '充币')
                        ])
                    ]),
                    m('div.data-echarts', '图表')
                ])
            ])
        ]);
    }
};