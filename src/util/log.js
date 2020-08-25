const LOG = window.console.log;

const openStr = 'tlh';

window.console.log = function (str, ...text) {
    if (!openStr || openStr === str) LOG(text);
};