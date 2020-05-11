import m from "mithril";

let nodeApp = document.getElementById("app");



import main from '../views/main'

//引入合约记录三个组件
import delegation from '../views/components/contractRrecord/historicalDelegation'
import deal from '../views/components/contractRrecord/historicalDeal'
import contractbill from '../views/components/contractRrecord/contractBill'

switch(0){
    case 0:
        m.route(document.body, "/future",{
            "/future": {
                render: function (vnode) {
                    return m(main,vnode.attrs)
                }
            },
            "/delegation": {
                render: function (vnode){
                    return m(delegation,vnode.attrs)
                }
            },
            "/deal": {
                render:function (vnode){
                    return m(deal,vnode.attrs)
                }
            },
            "/contractbill": {
                render:function (vnode){
                    return m(contractbill,vnode.attrs)
                }
            }
        }) 
        break;
}

