module.exports = {
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
                formatter: '{b} ({d})%',
                textStyle: {
                    fontSize: 10
                }
            },
            data: []
        }
    ]
};