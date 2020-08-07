const m = require('mithril')

const methods = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        methods.openNavbarDropdown = !methods.openNavbarDropdown
    }
}

module.exports = {
    view:  function(){
        // return m('footer.footer', {}, [
            // m('div.content', {}, [
                // m('p.has-text-centered', {}, [
                //     m('strong', {}, [
                //         'Bulma'
                //     ]),
                //     ' by ',
                //     m('a', {href:""}, [
                //         'Jeremy Thomas'
                //     ]),
                //     '. The source code is licensed',
                //     m('a', {href:""}, [
                //         'MIT'
                //     ]),
                //     '. The website content is licensed ',
                //     m('a', {href:""}, [
                //         'CC BY NC SA 4.0'
                //     ]),
                //     '.'
                // ])
            // ])
        // ])
    }
}