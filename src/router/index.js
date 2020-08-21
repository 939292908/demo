import m from 'mithril';

const defaultRoutePath = "/home";

m.route(document.querySelector('body .route-box'), defaultRoutePath, {
    '/home': {
        onmatch: function () {
            return import('@/views/pages/home/index');
        }
    }
});