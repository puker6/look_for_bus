

(() => {
    "use strict";

    angular
        .module('aep.layout')
        .controller('layoutController', layoutController);

    layoutController.$inject = ["$scope", "$http", "$state", "$location", "$cookies", "$timeout", "appSettings", "userService", "userPrivilegeService"];

    function layoutController($scope, $http, $state, $location, $cookies, $timeout, appSettings, userService, userPrivilegeService) {
        // $scope.currentUser = {
        //     avatarUrl: config.schemaVersion === 'prod' ? "./src/images/user-default-base.png" : "../src/images/user-default-base.png",
        //     nickName:$scope.localData.userName
        // };
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.nickName = userMsg.company.baseUserId.realName||'管理员';
        $scope.logoutWeb = function(){
            let info = {
                title: "提示信息",
                content: "确定注销账号并退出登录？"
            }
            $.misConfirm(info,function(){
                $state.go("login");
                localStorage.removeItem("localData")

            })
        };


       
    }

})();
