const m = require('mithril');
// const Block = require('../../home/block');
module.exports = {
    view: function () {
        return m('div.safety-man', [
            m('div.liftingBox dis-flex justify-between align-stretch', [
                m('div.leftBox', [
                    // m('div', m(Block, {
                    //     Icon: m('img', { src: item.leftVnode.icon }),
                    //     title: item.leftVnode.title,
                    //     subhead: item.leftVnode.subhead
                    // }, m('i', { class: item.rightVnode })))
                ]),
                m('div.rightBox', '999')
            ])
        ]);
    }
};