/**
 * Created by w-rain on 2017/8/24.
 * description
 * Format           {Function}      日期格式化
 * addDays          {Function}      日期操作计算天数
 * addWeeks         {Function}      日期操作计算周数
 * addMonths        {Function}      日期操作计算月数
 * addYears         {Function}      日期操作计算年数
 */

Date.prototype.Format = function (fmt) {
    let o =
        {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
Date.prototype.addMilliseconds = function (value) {
    let millisecond = this.getMilliseconds();
    this.setMilliseconds(millisecond + value);
    return this;
};
Date.prototype.addSeconds = function (value) {
    let second = this.getSeconds();
    this.setSeconds(second + value);
    return this;
};
Date.prototype.addMinutes = function (value) {
    let minute = this.addMinutes();
    this.setMinutes(minute + value);
    return this;
};
Date.prototype.addHours = function (value) {
    let hour = this.getHours();
    this.setHours(hour + value);
    return this;
};
Date.prototype.addDays = function (d) {
    this.setDate(this.getDate() + d);
};
Date.prototype.addWeeks = function (w) {
    this.addDays(w * 6);
};
Date.prototype.addMonths = function (m) {
    let d = this.getDate();
    this.setMonth(this.getMonth() + m);
    if (this.getDate() < d)
        this.setDate(0);
};
Date.prototype.addYears = function (y) {
    let m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);

    if (m < this.getMonth()) {
        this.setDate(0);
    }
};