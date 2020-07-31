'use strict';

/**
 * @ngdoc fiter
 * @name aep.filter.statusIcon
 * @description
 * statusIcon过滤器,进行状态不同显示效果的操作
 * @param {String} status 任务进程。
 * @return {String} string class样式名
 */
angular
    .module('aep')
    .filter("statusIcon", function () {
        return function (status) {
            switch (status) {
                case "进行中":
                    return "label label-info";
                case "已完成":
                    return "label label-success";
                case "警告":
                    return "label label-warning";
                case "错误":
                    return "label label-danger";
                default:
                    return "label label-primary";
            }
        };
    })
    .filter("portType", function () {
        return function (type) {
            switch (type) {
                case "1":
                    return "GET";
                case "2":
                    return "POST";
                case "3":
                    return "PUT";
                case "4":
                    return "DELETE";
                default:
                    return "POST";
            }
        };
    })
    .filter("emptyInfo", function () {
        return function (v) {
            if (v === "" || v === null || v === undefined) {
                return '无';
            } else {
                return v;
            }
        };
    })
    .filter("stateFilter", function () {
        return function (v) {
            if (v === 'valid') {
                return '启用';
            } else {
                return '禁用';
            }
        };
    })
    .filter("stateAbleFilter", function () {
        return function (v) {
            if (v === 'enabled') {
                return '启用';
            } else {
                return '禁用';
            }
        };
    })
    .filter("onlineStateFilter", function () {
        return function (v) {
            switch (v){
                case 'online':
                    return '在线';
                case 'offline':
                    return '离线';
                case 'unkown':
                    return '未知';
                case '':
                    return '未知';
                default:
                    return '未知';
            }
        };
    })
    .filter("firmwareStateFilter", function () {
        return function (v) {
            switch (v){
                case 'verified':
                    return '已验证';
                case 'Unverified':
                    return '未验证';
                default:
                    return '未验证';
            }
        };
    })
    .filter("pointDataType", function () {
        return function (v) {
            switch (v){
                case 'boolean':
                    return '布尔值';
                case 'number':
                    return '数值';
                case 'byte':
                    return '扩展';
                case 'enum':
                    return '枚举';
            }
        };
    })
    .filter("myGeneralStatus", function () {
        return function (v) {
            switch (v){
                case '1':
                    return '待审核';
                case '2':
                    return '被拒绝';
                case '0':
                    return '已撤回';
                case '4':
                    return '处理中';
                case '5':
                    return '已完成';
                case '7':
                    return '已过期';
            }
        };
    })
    .filter("myFaultStatus", function () {
        return function (v) {
            switch (v){
                case '1':
                    return '处理中';
                case '2':
                    return '待确认';
                case '3':
                    return '待审批';
                case '4':
                    return '被拒绝';
                case '5':
                    return '已完成';
                case '6':
                    return '已撤回';
            }
        };
    })
    // .filter("myGeneralOrderType", function () {
    //     return function (v) {
    //         switch (v){
    //             case 1:
    //                 return '勘测';
    //             case 2:
    //                 return '建设';
    //             case 3:
    //                 return '维护';
    //             case 4:
    //                 return '验收';
    //             case 5:
    //                 return '其他';
    //         }
    //     };
    // })
    .filter("myfaultTypeName", function () {
        return function (v) {
            switch (v){
                case 1:
                    return '硬件锁体故障';
                case 2:
                    return 'App错误';
                case 3:
                    return 'web端错误';
            }
        };
    })
    .filter("readWriteType", function () {
        return function (v) {
            switch (v){
                case 'read':
                    return '只读';
                case 'write':
                    return '可写';
            }
        };
    })
    .filter('PercentValue', function () {
        return function (o) {
            if (o !== undefined && /(^(-)*\d+\.\d*$)|(^(-)*\d+$)/.test(o)) {
                let v = parseFloat(o);
                return Number(Math.round(v * 10000) / 100).toFixed(2) + "%";
            } else {
                return "0";
            }
        }
    })
    .filter("serviceTypeIconFilter", function () {
        return function (type) {
            switch (type) {
                case "AEPIOT":
                    return "nav-icon-iot";
                case "IOT":
                    return "nav-icon-iot";
                case "LOCMAN":
                    return "nav-icon-loc";
                case "OPERATION":
                    return "nav-icon-operation";
                case "MAINTAIN":
                    return "nav-icon-maintain";
                case "BIGDATA":
                    return "nav-icon-data";
                default:
                    return "";
            }
        };
    })
    .filter("routerStateFilter", function () {
        return function (type) {
            switch (type) {
                case "AEPIOT":
                    return 'aep.access.**';
                case "IOT":
                    return 'aep.main.**';
                case "LOCMAN":
                    return 'aep.loc.**';
                case "OPERATION":
                    return 'aep.operation.**';
                case "MAINTAIN":
                    return 'aep.maintain.**';
                case "BIGDATA":
                    return 'aep.data.**';
                default:
                    return "";
            }
        };
    });