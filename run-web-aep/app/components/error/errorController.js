

(() => {
    'use strict';

    angular
        .module('aep.error')
        .controller('errorController', errorController);

    errorController.$inject = ["$scope", "$http", "$state", "$location"];

    function errorController($scope, $http, $state, $location) {
    }

})();