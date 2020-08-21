import home from './homeView';
import broadcast from '../../broadcast/broadcast';
import utils from '../../util/utils';

export default {
    view: home,
    themeDark: utils.getItem('themeDark'),
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
    onremove() {
        broadcast.offMsg({ key: 'index', cmd: 'setTheme', isall: true });
    }
};