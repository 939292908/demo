let m = require('mithril')

let layout = require('./components/layout').default
let layout_m = require('./components/layout_m').default

let obj = {
    
    getLayout: function () {
        let type = window.$config.views.layout.type
        let mobile = window.$config.mobile
        switch (type) {
            case 0:
                if(window.isMobile && mobile){
                    return m(layout_m)
                }else{
                    return m(layout)
                }
                
            case 1:
                return this.customLayout()
            default:
                return null
        }
    },
    
}

module.exports = {
    oninit: function(vnode) {
        
    },
    oncreate: function(vnode) {
        document.body.addEventListener('click', function(){
            gEVBUS.emit(gEVBUS.EV_ClICKBODY, { ev: gEVBUS.EV_ClICKBODY})
        }, false)
    },
    onupdate: function(vnode) {
        
    },
    onremove: function(vnode) {

    },
    view: function(){
        return m('section', [
            obj.getLayout(),
        ])
    }
}