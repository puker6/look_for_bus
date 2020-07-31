

'use strict';

angular
    .module('aep.portal')
    .controller('portalController', portalController);

portalController.$inject = ["$scope","$cookies", "$state", "$translate", "appSettings", 'userService', 'userPrivilegeService', 'browserVersionService'];

function portalController($scope, $cookies, $state, $translate, appSettings, userService, userPrivilegeService, browserVersionService) {
    
}