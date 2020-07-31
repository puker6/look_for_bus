(()=>{
    'use strict';

    angular
        .module('aep.login')
        .factory("loginService", loginService);

    loginService.$inject = ["$http", "apiUrl"];


    function loginService($http, apiUrl) {
        return {
            userLogin: function (params) {
                //post请求
                let url = apiUrl.environment + '/company/cus/subLogin';
                return $http.post(url,params);
                // return $http.post(url, $.param(params), {
                //     headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}
                // });
                // //get请求
                // let url = apiUrl.environment + '/user/authentication';
                // return $http.get(url,params);
                
            },
        }
    }

})();