import m from 'mithril';
import header from './components/header';
import footer from './components/footer';
import message from './components/message';

export default {
    view: function () {
        return m('section.section' + (this.themeDark ? " .theme--dark" : " .theme--light"), [
            m(header),
            m('div.route-box'),
            m(footer),
            m(message)
        ]);
    }
};