const m = require('mithril');
const QRCode = require('qrcode');

require('@/styles/pages/Myassets/chargeMoney.scss');

const Back = require('../../../assets/img/temImg/toLeft.png').default;

const QuickMark = function (code = '这是个二维码！') {
    const self = this;
    return QRCode.toDataURL(code).then(res => {
        self.data.QRSrc = res;
        m.redraw();
    });
};

module.exports = {
    data: {
        QRSrc: "",
        selectVal: '',
        coinList: [
            'BTC 比特币',
            "XRR 瑞波币",
            "ETH 以太坊"
        ]
    },
    oninit: function (vNode) {
        QuickMark.call(this);
    },
    view: function (vNode) {
        const { coinList, QRSrc } = this.data;
        console.log(this, this.data);
        return m('div', { class: 'views-pages-myassets-chargeMoney' }, [
            m('div', { class: 'back' }, [
                m('img', { src: Back, class: 'back-Icon' }),
                m('span', '充币')
            ]),
            m('div', { class: 'select' }, [
                m('select', { onchange: function (e) { console.log(e); } }, [
                    coinList.map(item => m('option', { value: item }, item))
                ])
            ]),
            m('div', { class: 'columns' }, [
                m('div', { class: 'column' }, [
                    m('div', '充币地址'),
                    m('img', { src: QRSrc })
                ]),
                m('div', { class: 'column' }, '温馨提示')
            ])
        ]);
    }
};