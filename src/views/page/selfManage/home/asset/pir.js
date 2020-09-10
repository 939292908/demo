module.exports = {
    // tooltip: {
    //     trigger: 'item',
    //     formatter: '{b} : {c} BTC ({d}%)'
    // },
    // toolbox: {
    //     show: true,
    //     feature: {
    //         mark: { show: true },
    //         dataView: { show: true, readOnly: false },
    //         magicType: {
    //             show: true,
    //             type: ['pie', 'funnel']
    //         },
    //         restore: { show: true },
    //         saveAsImage: { show: true }
    //     }
    // },
    color: ['#FF8B00', '#FFC700', '#6B7EA0', '#3C4C66'],
    series: [
        {
            type: 'pie',
            left: 'center',
            top: 'middle',
            radius: [40, 70],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            label: {
                show: true,
                position: 'outer',
                formatter: '{b} {c} BTC ({d})%',
                textStyle: {
                    fontSize: 10
                }
            },
            data: [
                { value: 6, name: '我的钱包' },
                { value: 15, name: '合约钱包' },
                { value: 2, name: '币币账户' },
                { value: 9, name: '法币账户' }
            ]
        }
    ]
};