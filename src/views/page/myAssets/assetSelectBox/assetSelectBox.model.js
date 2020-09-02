const bulmaCalendar = require('bulma-calendar');
const I18n = require('@/languages/I18n').default;

module.exports = {
    oncreate(vnode) {
        // Initialize all input of date type.
        const calendars = bulmaCalendar.attach('[type="date"]', {
            isRange: true,
            dateFormat: 'YYYY-MM-DD',
            lang: I18n.getLocale() === 'zh' ? 'zh_cn' : I18n.getLocale(),
            todayLabel: '今天',
            nowLabel: '现在',
            clearLabel: '清除',
            cancelLabel: '取消',
            'icons.date': ''
        });

        // Loop on each calendar initialized
        calendars.forEach(calendar => {
            // Add listener to date:selected event
            calendar.on('date:selected', date => {
                console.log(date);
            });
        });

        // To access to bulmaCalendar instance of an element
        const element = document.querySelector('#asset-select-box-time-selector');
        if (element) {
            // bulmaCalendar instance is available as element.bulmaCalendar
            element.bulmaCalendar.on('select', datepicker => {
                const time = datepicker.data.value().split(' - ');
                if (!time) {
                    vnode.attrs.onSelectTime([]);
                    return;
                }
                time[0] = new Date(time[0]).valueOf() / 1000;
                time[1] = new Date(time[1]).valueOf() / 1000;
                vnode.attrs.onSelectTime(time);
            });
        }
    }
};