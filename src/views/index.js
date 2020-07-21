let m = require('mithril')

let header = require('@/views/header')

module.exports = {
    oncreate: function(){

    },
    view: function(){
        return m('div.application.has-navbar-fixed-top', [
            m(header),
            m('div.content')
        ])
    }
}