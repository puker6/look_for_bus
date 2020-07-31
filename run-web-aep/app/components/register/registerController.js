
(()=>{
    'use strict';

    angular
        .module('aep.register')
        .controller('registerController', registerController);

        registerController.$inject = ["$scope", "$cookies", "$state", "$translate", "appSettings"];

    function registerController($scope, $cookies, $state, $translate, appSettings) {
        $scope.goLogin = function(){
            $state.go("login");
        }
        $scope.goRegister = function(){
            let info = {
                title: "提示信息",
                content: "注册成功，是否继续单位认证?"
            }
            $.misConfirm(info,function(){
                // $state.go("login");
                localStorage.removeItem("localData")
            })
        }
    }
            
})();