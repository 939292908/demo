// table 组件
var m = require("mithril")
// {
//     columns: [], // 表头
//     data : [] // 表格
// }
export default {
    tableWidth: 0,
    // 设置table宽
    setTableWidth (vnode, w) {
        w = w * 1
        if (vnode.attrs.width) {
            this.tableWidth = vnode.attrs.width
        } else {
            this.tableWidth += w
        }
    },
    // 生成colgroup元素
    getColgroup (vnode) {
        this.tableWidth = 0
        return m('colgroup', vnode.attrs.columns.map(item => {
            // 设置table宽
            let w = item.width + ''.replace("px", "")
            if (w > 0) this.setTableWidth(vnode, w)

            // 生成colgroup元素
            return m('col', { width: item.width || '1*' }) // 元素
        }))
        // console.log(this.tableWidth);
    },
    // 数据排序 与头部一致
    getSortData (vnode) {
        let columns = vnode.attrs.columns
        let data = vnode.attrs.data
        return data.map(item => {
            let newItem = {}
            columns.forEach(ele => newItem[ele.key] = item[ele.key])
            return newItem
        })
    },
    oninit (vnode) {
    },
    oncreate (vnode) {
        console.log(vnode.attrs.data, 7777777777);
        console.log(this.getSortData(vnode), 88888888888888);
    },
    view (vnode) {

        // table
        return m('div', { class: " table-container" }, [
            // tHeader
            m('div', { class: "pub-table-head-box", style: (this.tableWidth ? `width: ${this.tableWidth}px;` : ``) + `min-width: 100%; overflow-y: visible;` }, [
                m("table", { class: "table is-hoverable ", cellpadding: 0, cellspacing: 0 }, [
                    this.getColgroup(vnode),
                    m("tr", { class: "" }, [
                        vnode.attrs.columns.map((item, i) => {
                            return m("th", { class: `${item.class}`, key: `headItem${i}` }, [
                                item.title
                            ])
                        })
                    ])
                ]),
            ]),
            // tBody
            m('div', { class: "pub-table-body-box" }, [
                m("table", { class: "table is-hoverable ", cellpadding: 0, cellspacing: 0 }, [
                    this.getColgroup(vnode),
                    vnode.attrs.data.map((item, index) => {
                        return m("tr", { class: "", key: `tableTr${index}` }, 
                        vnode.attrs.columns.map((ele, index1) => {
                            return m("td", { class: "table-tr-td-vertical", key: `tableTd${index}-${index1}` }, item[ele.key])
                        }))
                    })
                    // vnode.attrs.data.map((item, i) => {
                    //     return m("tr", { class: "" , key: `tableItem${i}` }, [
                    //         m("td", { class: " table-tr-td-vertical" }, [
                    //             item.state
                    //         ]),
                    //         m("td", { class: "table-tr-td-vertical cursor-pointer" }, [
                    //             item.sym
                    //         ]),
                    //         m("td", { class: "table-tr-td-vertical" }, [
                    //             item.direction
                    //         ]),
                    //         m("td", { class: " table-tr-td-vertical" }, [
                    //             item.lever
                    //         ]),
                    //         m("td", { class: " table-tr-td-vertical" }, [
                    //             item.num
                    //         ]),
                    //         m("td", { class: " table-tr-td-vertical" }, [
                    //             item.openPic
                    //         ]),
                    //         m("td", { class: " table-tr-td-vertical" }, [
                    //             item.closePic
                    //         ]),
                    //         m("td", { class: " table-tr-td-vertical" }, [
                    //             item.closeProfitAndLoss
                    //         ]),
                    //         m("td", { class: " table-tr-td-vertical" }, [
                    //             item.commissionCharge
                    //         ]),
                    //         m("td", { class: "table-tr-td-vertical" }, [
                    //             item.insuranceAmount
                    //         ]),
                    //         m("td", { class: "table-tr-td-vertical" }, [
                    //             item.compensationAmount
                    //         ]),
                    //         m("td", { class: "table-tr-td-vertical" }, [
                    //             item.openTime
                    //         ]),
                    //         m("td", { class: "table-tr-td-vertical" }, [
                    //             item.closeTime
                    //         ]),
                    //         m("td", { class: "table-tr-td-vertical" }, [
                    //             item.orderNum
                    //         ])
                    //     ])
                    // })
                ])
            ]),
        ])
    },
    onbeforeremove (vnode) {

    }
}