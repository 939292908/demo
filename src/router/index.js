import m from 'mithril';

const defaultRoutePath = "/home";

m.route(document.querySelector('body .route-box'), defaultRoutePath, {
    '/home': {
        onmatch: function () {
            return import('../pages/page/home/index');
        }
    }
});