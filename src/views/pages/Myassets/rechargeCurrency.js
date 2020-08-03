//充币
let m = require('mithril')

// require('@/styles/Myassets/rechargeCurrency.css')

let rechargeCurrency = {
    rechargePage:function(){
        return m('div',{style:'border:1px solid red'},[
            m('div',{},[
                m('div',{},[]),
                m('div',{},[])
            ])
        ])
    }
}

module.exports = {
    view:function(){
        return rechargeCurrency.rechargePage(); 
    }
}