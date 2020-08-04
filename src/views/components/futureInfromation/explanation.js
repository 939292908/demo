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
          ]),
        ])
    }
}