class _console {
    constructor() {
        // 系统
        this.log_MSG = true;
        this.log_API = true;
        this.log_UTILS = true;
        this.log_WS = false;
        // 人员
        this.log_ht = true;
        this.log_lz = true;
        this.log_oyjw = true;
        this.log_cqq = true;
        this.log_nzm = true;
        this.log_lm = true;
        this.log_zx = true;
        this.log_gj = true;
        this.log_wmm = true;
        this.log_tlh = true;
    }

    /**
     * 控制台输出一条信息
     * 第一个参数为key，用于判断是否执行输出操作；其他参数以数组形式输出
     */
    log(...args) {
        const key = args[0];
        if (this[`log_${key}`]) {
            window.console.log(...args);
        }
    }

    /**
     * 输出错误信息到控制台
     * 第一个参数为key，用于判断是否执行输出操作；其他参数以数组形式输出
     */
    error(...args) {
        const key = args[0];
        if (this[`log_${key}`]) {
            window.console.error(...args);
        }
    }

    /**
     * 输出错误信息到控制台
     * 第一个参数为key，用于判断是否执行输出操作；其他参数以字符串形式输出
     */
    info(...args) {
        const key = args[0];
        if (this[`log_${key}`]) {
            window.console.info(...args);
        }
    }

    /**
     * 输出警告信息，信息最前面加一个黄色三角，表示警告
     * 第一个参数为key，用于判断是否执行输出操作；第二个参数为警告内容
     */
    warn(...args) {
        const key = args[0];
        if (this[`log_${key}`]) {
            window.console.warn(...args);
        }
    }

    /**
     * 以表格形式显示数据
     * @param {String} key 用于判断是否执行；
     * @param {Array||Object} tabledata 必需，填充到表格中的数据。
     * @param {Array} tablecolumns 可选，一个数组，表格标题栏的名称。
     */
    table(key, tabledata, tablecolumns) {
        if (this[`log_${key}`]) {
            window.console.table(tabledata, tablecolumns);
        }
    }

    /**
     * 计时器，开始计时间，与 timeEnd() 联合使用，用于算出一个操作所花费的准确时间。
     * @param {String} key 用于判断是否执行；
     * @param {String} label 可选，用于给计算器设置标签。
     */
    time(key, label) {
        if (this[`log_${key}`]) {
            window.console.time(label);
        }
    }

    /**
     * 计时结束
     * @param {String} key 用于判断是否执行；
     * @param {String} label 可选，用于给计算器设置标签。
     */
    timeEnd(key, label) {
        if (this[`log_${key}`]) {
            window.console.timeEnd(label);
        }
    }

    /**
     * 在控制台创建一个信息分组。 一个完整的信息分组以 window.console.group() 开始，window.console.groupEnd() 结束
     * @param {String} key 用于判断是否执行；
     * @param {String} label 可选，分组标签。
     */
    group(key, label) {
        if (this[`log_${key}`]) {
            window.console.group(label);
        }
    }

    /**
     * 在控制台创建一个信息分组。 类似 window.console.group() ，但它默认是折叠的。
     * @param {String} key 用于判断是否执行；
     * @param {String} label 可选，分组标签。
     */
    groupCollapsed(key, label) {
        if (this[`log_${key}`]) {
            window.console.groupCollapsed(label);
        }
    }

    /**
     * 设置当前信息分组结束
     * @param {String} key 用于判断是否执行；
     */
    groupEnd(key) {
        if (this[`log_${key}`]) {
            window.console.groupEnd();
        }
    }

    /**
     * 显示当前执行的代码在堆栈中的调用路径。
     * @param {String} key 用于判断是否执行；
     * @param {String} label 可选，路径标签。
     */
    trace(key, label) {
        if (this[`log_${key}`]) {
            window.console.trace(label || 'window.console.trace');
        }
    }

    /**
     * 如果断言为 false，则在信息到控制台输出错误信息。
     * @param {String} key 用于判断是否执行；
     * @param {Boolean} expression 必需。布尔表达式，返回 true 或 false。
     * @param {String||Object} message 必需。 要写到控制台的信息或对象。
     */
    assert(key, expression, message) {
        if (this[`log_${key}`]) {
            window.console.assert(expression, message);
        }
    }

    /**
     * 记录 count() 调用次数，一般用于计数。
     * @param {*} key 用于判断是否执行；
     * @param {*} label 可选，标签。
     */
    count(key, label) {
        if (this[`log_${key}`]) {
            window.console.count(label);
        }
    }

    /**
     * 清除控制台上的信息。
     */
    clear() {
        window.console.clear();
    }
}

export default _console;