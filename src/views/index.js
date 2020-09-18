import m from 'mithril';
// import header from './components/common/header/header.view';
// import footer from './page/main/footer/footer.view.js';
import message from './page/main/message/message.view';
import broadcast from '../broadcast/broadcast';
// import utils from '../util/utils';
import config from '../config';
import l180n from '@/languages/I18n';

export default {
    name: 'views_index',
    oninit() {
        // const self = this;
        // broadcast.onMsg({
        //     key: this.name,
        //     cmd: 'setTheme',
        //     cb: () => {
        //         self.themeDark = utils.getItem('themeDark');
        //     }
        // });
    },
    oncreate() {
        document.querySelector('body').onclick = () => {
            broadcast.emit({ cmd: broadcast.EV_ClICKBODY });
        };

        // 设置网页title
        if (l180n.getLocale() === 'zh') {
            document.title = config.DOCTitle;
        } else {
            document.title = config.DOCTitleEn;
        }
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: res => {
                if (l180n.getLocale() === 'zh') {
                    document.title = config.DOCTitle;
                } else {
                    document.title = config.DOCTitleEn;
                }
            }
        });
    },
    onremove() {
        broadcast.offMsg({ key: this.name, cmd: 'setTheme', isall: true });
    },
    view: function () {
        return m('section.section.container' + (config.themeDark ? " .theme--dark" : " .theme--light"), [
            // m(header),
            m('div.route-box.px-6'),
            // m(footer),
            m(message)
        ]);
    }
};