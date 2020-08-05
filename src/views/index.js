let m = require('mithril')

let header = require('./components/header').default
let footer = require('./components/footer').default
let message = require('./components/message')

let obj = {
    getHeader: function () {
        let type = window.$config.views.header.type
        switch (type) {
            case 0:
                return (!window.isMobile?m(header):'')
            case 1:
                return this.customHeader()
            default:
                return null
        }
    },
    customHeader: function () {

    },

    getFooter: function () {
        let type = window.$config.views.footer.type
        switch (type) {
            case 0:
                return m(footer)
            case 1:
                return this.customFooter()
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
            obj.getHeader(),
            m('div.route-box'),
            obj.getFooter(),
            m(message)
        ])
    }
}