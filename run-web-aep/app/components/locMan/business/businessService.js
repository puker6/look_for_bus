'use strict';

businessModule
    .factory("businessService", ["$http", "apiUrl", function ($http, apiUrl) {
        return {
            getClientList: function (params) {
                let url = apiUrl.environment + '/company/cus/companyCusList';
                return $http.post(url,params);
            },
            addClientMsg: function (params) {
                let url = apiUrl.environment + '/company/cus/subCompanyCusAdup';
                return $http.post(url,params,{
                    headers: {"opt": "save"}
                });
            },
            editClientMsg: function (params) {
                let url = apiUrl.environment + '/company/cus/subCompanyCusAdup';
                return $http.post(url,params,{
                    headers: {"opt": "update"}
                });
            },
            deleteClientMsg: function (params) {
                let url = apiUrl.environment + '/company/cus/deleteCompanyCus';
                return $http.post(url,params);
            },
            getServiceManList: function (params) {
                let url = apiUrl.environment + '/company/cus/getStaffNameList';
                return $http.post(url,params);
            },
            getClientMsgById: function (params) {
                let url = apiUrl.environment + '/company/cus/companyCusFindById';
                return $http.post(url,params);
            },
            getOrderList: function (params) {
                let url = apiUrl.environment + '/company/order/orderList';
                return $http.post(url,params);
            },
            orderSetExternal: function (params) {
                let url = apiUrl.environment + '/company/order/setExternal';
                return $http.post(url,params);
            },
            orderCancelExternal: function (params) {
                let url = apiUrl.environment + '/company/order/cancelExternal';
                return $http.post(url,params);
            },
            orderLockExternal: function (params) {
                let url = apiUrl.environment + '/company/order/lockExternal';
                return $http.post(url,params);
            },
            orderUnlockExternal: function (params) {
                let url = apiUrl.environment + '/company/order/unlockExternal';
                return $http.post(url,params);
            },
            orderConfirmUserCar: function (params) {
                let url = apiUrl.environment + '/company/order/confirmUseCar';
                return $http.post(url,params);
            },
            orderDisCar: function (params) {
                let url = apiUrl.environment + '/company/order/disCar';
                return $http.post(url,params);
            },
            orderCancelDisCar: function (params) {
                let url = apiUrl.environment + '/company/order/cancelDisCar';
                return $http.post(url,params);
            },
            cancelOrderMsg: function (params) {
                let url = apiUrl.environment + '/company/order/cancelMainCarOrder';
                return $http.post(url,params);
            },
            getVehicleList: function (params) {
                let url = apiUrl.environment + '/company/vehicle/getAllPlateNum';
                return $http.post(url,params);
            },
            getAllSeatList: function (params) {
                let url = apiUrl.environment + '/company/vehicle/getAllSeats';
                return $http.post(url,params);
            },
            verifyPhoneRepetition: function (params) {
                let url = apiUrl.environment + '/company/cus/checkCustomPhone';
                return $http.post(url,params);
            },
            addPersonInCharge: function (params) {
                let url = apiUrl.environment + '/company/cus/addPersonInCharge';
                return $http.post(url,params);
            },
            getStationList: function (params) {
                let url = apiUrl.environment + '/common/getStationList';
                return $http.post(url,params);
            },
            addOrderMsg: function (params) {
                let url = apiUrl.environment + '/company/order/addCompanyOnewayTransferOrder';
                return $http.post(url,params);
            },
            addCharteredOrderMsg: function (params) {
                let url = apiUrl.environment + '/company/order/addCompanyDayRouteTemp';
                return $http.post(url,params);
            },
            addChartMainOrderMsg: function (params) {
                let url = apiUrl.environment + '/company/order/addCompanyLybcOrder';
                return $http.post(url,params);
            },
            getSubOrderList: function (params) {
                let url = apiUrl.environment + '/company/order/getAllOrderByMainOrderNum';
                return $http.post(url,params);
            },
            aiSendOrderData: function (params) {
                let url = apiUrl.environment + '/company/order/smartSendOrder';
                return $http.post(url,params);
            },
            getOrderMsgById: function (params) {
                let url = apiUrl.environment + '/company/order/getOrderById';
                return $http.post(url,params);
            },
            saveUpdateOrderMsg: function (params) {
                let url = apiUrl.environment + '/company/order/updateOrder';
                return $http.post(url,params);
            },
            deleteOrder: function (params) {
                let url = apiUrl.environment + '/company/order/deleteOrder';
                return $http.post(url,params);
            },
            manualSendOrderGetCar: function (params) {
                let url = apiUrl.environment + '/company/order/handleSendCar';
                return $http.post(url,params);
            },
            manualOfflineSendOrder: function (params) {
                let url = apiUrl.environment + '/company/order/confirmSendUnder';
                return $http.post(url,params);
            },
            confirmOnlineSendOrder: function (params) {
                let url = apiUrl.environment + '/company/order/confirmSendOrder';
                return $http.post(url,params);
            },
            getOffLinPartunitList: function (params) {
                let url = apiUrl.environment + '/company/cus/getCustomInfoByType';
                return $http.post(url,params);
            },
            confirmCollection: function (params) {
                let url = apiUrl.environment + '/company/order/confirmCollection';
                return $http.post(url,params);
            },
            confirmPayment: function (params) {
                let url = apiUrl.environment + '/company/order/confirmPayment';
                return $http.post(url,params);
            },
            JLConfirmSendOrder: function (params) {
                let url = apiUrl.environment + '/company/order/JLConfirmSend';
                return $http.post(url,params);
            },
            getCountyList: function (params) {
                let url = apiUrl.environment + '/common/getCountyList';
                return $http.post(url,params);
            },
            getCountyJdList: function (params) {
                let url = apiUrl.environment + '/common/getCountyJdList';
                return $http.post(url,params);
            },
        }
    }])
    .service("modalOwnerService", ['$q', '$uibModal', function ($q, $uibModal) {
        let deferred = $q.defer();
        let link = config.schemaVersion === 'prod' ? './templates/locMan/business/' : "./app/views/locMan/business/";
        this.businessOwnerModal = function (opts) {
            $uibModal.open({
                templateUrl: link + 'modalOwner.html',
                controller: "modalOwnerController",
                windowClass: "modal-specialValue",
                resolve: {
                    opts: function () {
                        return opts;
                    },
                }
            }).result.then(function (e) {
                deferred.resolve(e);
            });
            return deferred.promise;
        };
    }])