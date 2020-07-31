
'use strict';

logisticsModule
    .factory("logisticsService", ["$http", "apiUrl", function ($http, apiUrl) {
        return {
            //车辆列表
            vehicleListFind: function (params) {
                let url = apiUrl.environment + '/company/vehicle/vehicleListFind';
                return $http.post(url,params);
            },
            //添加车辆
            vehicleAdd: function (params) {
                let url = apiUrl.environment + '/company/vehicle/vehicleAdd';
                return $http.post(url,params);
            },
            //修改车辆
            vehicleUpdate: function (params) {
                let url = apiUrl.environment + '/company/vehicle/vehicleUpdate';
                return $http.post(url,params);
            },
            //删除车辆
            vehicleDelete: function (params) {
                let url = apiUrl.environment + '/company/vehicle/vehicleDelete';
                return $http.post(url,params);
            },
            //添加车辆所属公司下拉框
            getCompanyCusIsDepend: function (params) {
                let url = apiUrl.environment + '/company/cus/getCompanyCusIsDepend';
                return $http.post(url,params);
            },
            //查询车辆信息
            vehicleFindById: function (params) {
                let url = apiUrl.environment + '/company/vehicle/vehicleFindById';
                return $http.post(url,params);
            },
            // 获取驾驶员信息
            getDriverList: function (params) {
                let url = apiUrl.environment + '/company/cus/getDriverList';
                return $http.post(url,params);
            },
             // 获取车辆品牌列表
             getCarBrands: function (params) {
                let url = apiUrl.environment + '/common/getCarBrandsByCarType';
                return $http.post(url,params);
            },
            // 设置驾驶员
            setDriver: function (params) {
                let url = apiUrl.environment + '/company/vehicle/setDriver';
                return $http.post(url,params);
            },
            // 检测驾驶员是否一个人对应一辆车
            checkBeforeSetDriver: function (params) {
                let url = apiUrl.environment + '/company/vehicle/checkBeforeSetDriver';
                return $http.post(url,params);
            },
            // 获取城市列表
            getCitys: function (params) {
                let url = apiUrl.environment + '/common/getCitys';
                return $http.post(url,params);
            },
            // 获取车牌列表
            getPlateNumShort: function (params) {
                let url = apiUrl.environment + '/common/getPlateNumShort';
                return $http.post(url,params);
            },
            // 获取车牌品牌(不需要传参数)
            getAllCarBrand: function (params) {
                let url = apiUrl.environment + '/common/getAllCarBrand';
                return $http.post(url,params);
            },
            // 添加-检测车牌号码是否已存在
            checkPlateNum: function (params) {
                let url = apiUrl.environment + '/company/vehicle/checkPlateNum';
                return $http.post(url,params);
            },
            //图片上传
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
            //小组列表
            groupListFind: function (params) {
                let url = apiUrl.environment + '/company/cus/findCompanyGroupList';
                return $http.post(url,params);
            },
            //添加小组
            subGroupAdup: function (params) {
                let url = apiUrl.environment + '/company/cus/subGroupAdUp';
                return $http.post(url,params);
            },
            // 删除小组
            groupDelete: function (params) {
                let url = apiUrl.environment + '/company/cus/groupDelete';
                return $http.post(url,params);
            },
            //获取小组信息
            findGroupById: function (params) {
                let url = apiUrl.environment + '/company/cus/findGroupById';
                return $http.post(url,params);
            },
            // 添加-检测车牌号码是否已存在
            findGroupByName: function (params) {
                let url = apiUrl.environment + '/company/cus/findGroupByName';
                return $http.post(url,params);
            },
        }
    }])