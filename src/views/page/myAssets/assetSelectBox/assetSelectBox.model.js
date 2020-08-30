const laydate = require('@/../node_modules/layui-laydate/src/laydate');

module.exports = {
    oncreate(vnode) {
        laydate.render({
            elem: '#asset-select-box-time-selector',
            type: 'date',
            range: true,
            trigger: 'click',
            done: function(value, date, endDate) {
                const time = value.split(' - ');
                if (!time) {
                    vnode.attrs.onSelectTime([]);
                    return;
                }
                time[0] = new Date(time[0]).valueOf() / 1000;
                time[1] = new Date(time[1]).valueOf() / 1000;
                vnode.attrs.onSelectTime(time);
            }
        });
    }
};