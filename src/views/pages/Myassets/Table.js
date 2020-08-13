// table 组件
// 参数1：columns 表头
// columns: [
//     {
//         title: '', // 表头文字
//         key: 'state', // data中对应的字段
//         width: 100, // 列宽 px 或 %
//         className: '', // 列类名
//         align: 'left', // 列对齐
//         render (params) { // 自定义 列内容
//             return m('div', {
//                 class: `hehe`, onclick () {
//                     console.log("row数据", params);
//                 }
//             }, params.state)
//         }
//     },
// ]

// 参数2：data 表格
// data : [
//     {
//         state: 'xxxx',
//     },
// ]

// 参数3：table宽 默认columns中width总和
// width : 500 ;

// 参数4：默认每列宽
// defaultColumnWidth: 150

// 参数5：table加类名
// class: ''

const m = require('mithril');
module.exports = {
    tableWidth: 0,
    defaultColumnWidth: 150, // 默认每列宽
    // 设置table宽
    setTableWidth (vnode, w) {
        if (vnode.attrs.width) { // 使用参数 width
            var attrW = vnode.attrs.width;
            this.tableWidth = attrW.toString().replace("px", "");
        } else { // 累加表头 width;
            if (!w) w = this.defaultColumnWidth;
            w = w.toString().replace("px", "");
            if (w > 0) this.tableWidth += w * 1;
        }
    },
    // 生成colgroup元素
    getColgroup (vnode) {
        return m('colgroup', vnode.attrs.columns.map((item, index) => {
            // 宽：最后一个col为'1*'（用于弹性调节一些多余的空间）, 其他col使用column里面width 或者 默认defaultColumnWidth
            return m('col', { width: index === vnode.attrs.columns.length - 1 ? '1*' : item.width || (vnode.attrs.defaultColumnWidth || this.defaultColumnWidth) });
        }));
    },
    // tableBox 样式
    getTableBoxStyle () {
        return (this.tableWidth ? `width: ${this.tableWidth}px;` : ``) +
            `min-width: 100%; overflow-y: visible;`;
    },
    // tr,td 样式
    getTrTdStyle (headerItem) {
        return headerItem.align ? `text-align: ${headerItem.align};` : ``;
    },
    oninit (vnode) {
        this.tableWidth = 0;
        vnode.attrs.columns.map(item => {
            this.setTableWidth(vnode, item.width); // 设置table宽
        });
    },
    oncreate (vnode) {
    },
    view (vnode) {
        // table
        return m('div', { class: `table-container ${vnode.attrs.class ? vnode.attrs.class : ''}` }, [
            // tHead
            m('div', { class: "pub-table-head-box", style: this.getTableBoxStyle() }, [
                m("table", { class: "table is-hoverable ", cellpadding: 0, cellspacing: 0 }, [
                    this.getColgroup(vnode),
                    // 表头
                    m("tr", { class: "" }, [
                        vnode.attrs.columns.map((headerItem, i) => {
                            return m("th", { class: `${headerItem.className ? headerItem.className : ''}`, style: this.getTrTdStyle(headerItem), key: `headItem${i}` }, [
                                headerItem.title
                            ]);
                        })
                    ])
                ])
            ]),
            // tBody
            m('div', { class: "pub-table-body-box", style: this.getTableBoxStyle() }, [
                m("table", { class: "table is-hoverable ", cellpadding: 0, cellspacing: 0 }, [
                    this.getColgroup(vnode),
                    // 表格
                    vnode.attrs.data.map((item, index) => {
                        return m("tr", { class: "", key: `tableTr${index}` },
                            // td 顺序, 根据表头 key 的顺序渲染
                            vnode.attrs.columns.map((headerItem, index1) => {
                                return m("td", { class: `${headerItem.className ? headerItem.className : ''}`, style: this.getTrTdStyle(headerItem), key: `tableTd${index}-${index1}` }, [
                                    // 默认显示对应 key 字段; 如果 columns 有 render() 优先使用（插槽功能）
                                    headerItem.render ? headerItem.render(item) : item[headerItem.key]
                                ]);
                            }));
                    })
                ])
            ])
        ]);
    }
};