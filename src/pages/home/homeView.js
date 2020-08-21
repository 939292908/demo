import m from 'mithril';
import header from '../header/index';
import footer from '../footer/index';
import message from '../message/index';

export default function() {
    return m('section.section' + (this.themeDark ? " .theme--dark" : " .theme--light"), [
        m(header),
        m('div.route-box'),
        m(footer),
        m(message)
    ]);
}