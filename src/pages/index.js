import m from 'mithril';
import header from '@/views/page/main/header';
import footer from '@/views/page/main/footer';
import message from './components/message';
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