const m = require('mithril');

require('@/styles/pages/Myassets/assetRecords.scss');

const commonSelectionBox = {
    timeValue: null,
    currencyValue: null,
    typeValue: [
        {
            name: '资金划转'
        },
        {
            name: 'UTC'
        }
    ],
    timestampToTime: function () {
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        return year + "-" + month + "-" + day;
    },
    assetValuation: function () {
        return m('div', { class: 'columns-flex-justify mb-3 body-2' }, [
            m('div', { class: 'mr-6' }, [
                m('p', { class: 'mb-2' }, ['时间']),
                m('input[type=date]', {
                    value: commonSelectionBox.timeValue ? commonSelectionBox.timeValue : commonSelectionBox.timestampToTime(),
                    class: 'has-line-level-1 identicalInput border-radius-small body-2',
                    id: 'fname',
                    required: 'required',
                    onchange: function () {
                        window.utils.setItem('timeValue', this.value);
                        window.gBroadcast.emit({ cmd: window.gBroadcast.CHANGE_SW_CURRENCY, data: this.value });
                        commonSelectionBox.timeValue = window.utils.getItem('timeValue');
                        console.log(commonSelectionBox.timeValue);
                    }
                })
            ]),
            m('div', { class: 'mr-6' }, [
                m('p', { class: 'mb-2' }, ['币种']),
                m('select.select ', {
                    class: 'has-line-level-1 identicalInput border-radius-small body-2',
                    onchange: function () {
                        commonSelectionBox.currencyValue = this.value;
                        window.utils.setItem('currencyValue', this.value);
                        window.gBroadcast.emit({ cmd: window.gBroadcast.CHANGE_SW_CURRENCY, data: this.value });
                    }
                }, [
                    m('option', {}, ['全部']),
                    m('option', {}, ['局部'])
                ])
            ]),
            m('div', { class: 'mr-6' }, [
                m('p', { class: 'mb-2' }, ['类型']),
                m('select.select ', {
                    class: 'has-line-level-1 identicalInput border-radius-small body-2',
                    onchange: function () {
                        window.utils.setItem('typeValue', this.value);
                        // commonSelectionBox.typeValue.name = window.utils.getItem('typeValue') ? window.utils.getItem('typeValue') : this.value;
                        window.gBroadcast.emit({ cmd: window.gBroadcast.CHANGE_SW_CURRENCY, data: this.value });
                    }
                }, [
                    commonSelectionBox.typeValue.map(item => {
                        m('option', {}, [window.utils.getItem('typeValue') ? window.utils.getItem('typeValue') : item.name]);
                    })
                ])
            ])
        ]);
    }
};
module.exports = {
    oninit: function () {
        console.log(commonSelectionBox.timestampToTime());
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-commonSelectionBox' }, [
            commonSelectionBox.assetValuation()
        ]);
    }
};