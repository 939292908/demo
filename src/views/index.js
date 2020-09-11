import m from 'mithril';
import header from './page/main/header/header.view';
import footer from './page/main/footer/footer.view.js';
import message from './page/main/message';
import broadcast from '../broadcast/broadcast';
import utils from '../util/utils';
import config from '../config';

export default {
    themeDark: utils.getItem('themeDark') == null ? config.themeDark : utils.getItem('themeDark'),
    oninit() {
        const self = this;
        broadcast.onMsg({
            key: 'index',
            cmd: 'setTheme',
            cb: () => {
                self.themeDark = utils.getItem('themeDark');
            }
        });
    },
    oncreate() {
        document.querySelector('body').onclick = () => {
            broadcast.emit({ cmd: broadcast.EV_ClICKBODY });
        };
    },
    onremove() {
        broadcast.offMsg({ key: 'index', cmd: 'setTheme', isall: true });
    },
    view: function () {
        return m('section.section' + (this.themeDark ? " .theme--dark" : " .theme--light"), [
            m(header),
            m('div.route-box'),
            m(footer),
            m(message)
        ]);
    }
};