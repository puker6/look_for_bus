

'use strict';

mainModule.controller('iotLayoutController', [
    '$scope', '$state', '$http', "apiUrl", '$cookies', '$timeout', 'appSettings', 'userService', 'comService',
    function ($scope, $state, $http, apiUrl, $cookies, $timeout, appSettings, userService, comService) {
        let roleId = $cookies.get(appSettings.roleId);
        // $scope.accessName = $cookies.get(appSettings.accessName);
        $scope.minimized =  false;
        $scope.menuLists =  [];
        $scope.config = {
            // disableNavigation: false,
            productSidebar: false
        };
        $scope.init = function () {
            if(roleId === null || roleId === '') return;
            let requestParam = {
                roleId: roleId,
                applicationType: "PC"
            };
            if (config.menuConfig === 'online') {
                userService.getMenuListsByRole(requestParam).then(function (res) {
                    if (res.data.resultStatus.resultCode === "0000") {
                        let result = res.data.value || [];
                        $scope.menuLists = comService.convertTreeData(result);
                    }
                },function (){
                }).finally(function (){
                    $scope.config.productSidebar = $scope.menuLists.length === 0;
                });
            } else {
                userService.getMenuLists().then(function (res) {
                    if (res.status === 200) {
                        $scope.menuLists = res.data.list;
                    }
                },function (){}).finally(function (){
                    $scope.config.productSidebar = $scope.menuLists.length === 0;
                });
            }
        };
        $scope.minimizeToggle = function () {
            $scope.minimized = !$scope.minimized;
        };
        $scope.init();
    }
]);