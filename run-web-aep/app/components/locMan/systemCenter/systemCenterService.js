

'use strict';

systemCenterModule
    .factory("systemCenterService", ["$http", "apiUrl", function ($http, apiUrl) {
        return {
            // 获取-金额类型列表-分页
            findMoneyType: function (params) {
                let url = apiUrl.environment + '/company/finance/findMoneyType';
                return $http.post(url,params);
            },
            // 单位添加/修改金额类型
            adupMtype: function (params) {
                let url = apiUrl.environment + '/company/finance/adupMtype';
                return $http.post(url,params);
            },
            // 单位通过id查询金额类型信息
            mtypeFindById: function (params) {
                let url = apiUrl.environment + '/company/finance/mtypeFindById';
                return $http.post(url,params);
            },
            // 单位删除金额类型
            delMtype: function (params) {
                let url = apiUrl.environment + '/company/finance/delMtype';
                return $http.post(url,params);
            },
            // 获取-客户类型列表-分页
            findCustomType: function (params) {
                let url = apiUrl.environment + '/company/cus/findCustomType';
                return $http.post(url,params);
            },
            // 添加/修改客户类型
            adupCusType: function (params) {
                let url = apiUrl.environment + '/company/cus/adupCusType';
                return $http.post(url,params);
            },
            // 单位通过id查询客户类型信息
            cusTypeFindById: function (params) {
                let url = apiUrl.environment + '/company/cus/cusTypeFindById';
                return $http.post(url,params);
            },
            // 单位删除客户类型
            delCusType: function (params) {
                let url = apiUrl.environment + '/company/cus/delCusType';
                return $http.post(url,params);
            },
        }
    }]);