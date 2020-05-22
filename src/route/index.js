import m from "mithril";




import main from '../views/main'

//引入合约记录三个组件
import delegation from '../views/components/contractRrecord/historicalDelegation'
import deal from '../views/components/contractRrecord/historicalDeal'
import contractbill from '../views/components/contractRrecord/contractBill'
import details from '../views/components/contractRrecord/details'
import languages from '../views/components/contractRrecord/languages'

m.route(document.body, "/future",{
    "/future": {
        render: function (vnode) {
            return m(main,vnode.attrs)
        }
    },
    "/delegation": {
        render: function (vnode){
            return m(delegation,vnode.attrs)
        },
    },
    "/details:item":{
        render:function(vnode){
            return m(details,vnode.attrs)
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
    },
    "/setlanguages": {
        render:function (vnode){
            return m(languages,vnode.attrs)
        }
    },
})

