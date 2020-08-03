var m = require("mithril")



let obj = {


    //下拉列表
    getDownloadFuture:function(){

    },
  
}


export default {
    oninit: function(vnode){
        
    },
    oncreate: function(vnode){
        
    },
    view: function(vnode) {
        return m("div",{class: ""}, [
          m('div',{class:""},[
            m('span',[
              '合约',
            ]),
            //下拉列表
            // obj.getDownloadFuture(),
            m('div',{class:"dropdown is-active"},[
              m('div',{class:"dropdown-trigger"},[
                m('button',{class:"button dropdown-menu",},[
                  m('span',['BTC/USDT 永续']),
                  m('span',{class:"icon is-small"},[
                    m('i',{class:"my-trigger-icon iconfont iconxiala1 has-text-primary"})
                  ])
                ])
              ])
            ])
          ]),
        ])
    }
}