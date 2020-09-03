// const m = require('mithril');
const Lightpick = require('lightpick');
const I18n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');

module.exports = {
    picker: null,
    oncreate(vnode) {
        this.initPicker(vnode);
        broadcast.onMsg({
            key: 'assetSelectBox',
            cmd: 'setLanguage',
            cb: lang => {
                if (this.picker) {
                    this.picker.destroy();
                }
                this.picker = null;
                this.initPicker(vnode);
            }
        });
    },
    initPicker(vnode) {
        const self = this;
        this.picker = new Lightpick({
            field: document.getElementById('asset-select-box-time-selector'),
            singleDate: false,
            numberOfMonths: 2,
            lang: I18n.getLocale(),
            locale: {
                buttons: {
                    prev: '←',
                    next: '→',
                    close: '×',
                    reset: '清除',
                    apply: '确定'
                },
                tooltip: {
                    one: '天',
                    other: '天'
                },
                tooltipOnDisabled: null,
                pluralize: function(i, locale) {
                    if (typeof i === "string") i = parseInt(i, 10);

                    if (i === 1 && 'one' in locale) return locale.one;
                    if ('other' in locale) return locale.other;

                    return '';
                }
            },
            onSelect: (start, end) => {
                self.onSelect(vnode, start, end);
            }
        });
    },
    onSelect(vnode, start, end) {
        let str = '';
        str += start ? start.format('yyyy-MM-DD') + ' - ' : '';
        str += end ? end.format('yyyy-MM-DD') : '...';
        if (!start || !end) {
            vnode.attrs.onSelectTime([]);
            return;
        }
        const time = [];
        time[0] = start / 1000;
        time[1] = end / 1000 + 24 * 60 * 60;
        vnode.attrs.onSelectTime(time);
        vnode.attrs.setDateStr(str);
    },
    onremove() {
        this.picker.destroy();
        this.picker = null;
        this.date = '';
        broadcast.offMsg({
            key: 'assetSelectBox',
            cmd: 'setLanguage',
            isall: true
        });
    }
};