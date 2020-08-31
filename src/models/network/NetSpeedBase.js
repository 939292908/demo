/**
 * 网络测速
 */
class NetSpeedBase {
    constructor(props = {}) {
        this.id = props.id;
        this.name = props.name;
        this.sort = -1;// 测速排序(0-n)
        this.duration = -1;
        this.url = '';
    }

    /**
     * 测试线路信号强弱
     */
    test() {

    }

    /**
     * 取消测试
     */
    cancel() {
    }
}

export default NetSpeedBase;