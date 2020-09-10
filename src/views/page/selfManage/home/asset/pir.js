module.exports = {
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
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
            radius: [30, 80],
            center: ['25%', '50%'],
            roseType: 'radius',
            label: {
                show: false
            },
            data: [
                { value: 10, name: '我的钱包' },
                { value: 5, name: '合约钱包' },
                { value: 15, name: '币币账户' },
                { value: 25, name: '法币账户' }
            ]
        }
    ]
};