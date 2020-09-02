const LOG = window.console.log;

const openStr = 'ht';

window.console.log = function (str, ...text) {
    if (openStr === str) LOG(...text);
};