module.exports = {
    isActive: false,
    /**
     * 点击事件禁止传递
     * @param e
     */
    stopFunc(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
};