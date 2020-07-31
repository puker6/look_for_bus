

'use strict';

officeModule
    .factory("officeService", ["$http", "apiUrl", function ($http, apiUrl) {
        return {
            getEmployeeList: function (params) {
                let url = apiUrl.environment + '/company/cus/findStaffList';
                return $http.post(url,params);
            },
            addEmployee: function (params) {
                let url = apiUrl.environment + '/company/cus/staffAdd';
                return $http.post(url,params);
            },
            editEmployee: function (params) {
                let url = apiUrl.environment + '/company/cus/staffUpdate';
                return $http.post(url,params);
            },
            deleteEmployeeMsg: function (params) {
                let url = apiUrl.environment + '/company/cus/staffDelete';
                return $http.post(url,params);
            },
            getEmployeeMsgById: function (params) {
                let url = apiUrl.environment + '/company/cus/findStaffById';
                return $http.post(url,params);
            },
            getCompanyList: function (params) {
                let url = apiUrl.environment + '/company/cus/getCompanyCusIsDepend';
                return $http.post(url,params);
            },
            getRoleList: function (params) {
                let url = apiUrl.environment + '/company/cus/getRoleByDeptId';
                return $http.post(url,params);
            },
            verifyPersonPhone: function (params) {
                let url = apiUrl.environment + '/company/cus/checkStaffPhone';
                return $http.post(url,params);
            },
            saveLeaveDate: function (params) {
                let url = apiUrl.environment + '/company/cus/staffLeave';
                return $http.post(url,params);
            },
            imgUpload: function (params) {
                let url = apiUrl.environment + '/company/upload';
                return $http({
                    method: 'POST',
                    url: url,
                    data: params,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identityidentity
                });
            },
            // 下拉框-查询公司员工基础信息，不分页
            getServiceManList: function (params) {
                let url = apiUrl.environment + '/company/cus/getStaffNameList';
                return $http.post(url,params);
            },
            // 下拉框-获取客户信息，不分页
            companyCusCombo: function (params) {
                let url = apiUrl.environment + '/company/cus/companyCusCombo';
                return $http.post(url,params);
            },
            // 获取部门
            findDepts: function (params) {
                let url = apiUrl.environment + '/company/cus/findDepts';
                return $http.post(url,params);
            },

        }
    }]);