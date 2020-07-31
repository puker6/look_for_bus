

'use strict';

locManModule.controller('locLayoutController', [
    '$scope','$rootScope', '$state', '$http', '$cookies', '$timeout', 'appSettings', 'userService', 'locLayoutService', 'comService',
    function ($scope,$rootScope, $state, $http, $cookies, $timeout, appSettings, userService, locLayoutService, comService) {
        let tabArr = angular.fromJson(localStorage.getItem("tabArr"));
        //     roleId = $cookies.get(appSettings.roleId) || '';
        // $scope.minimized =  false;
        $scope.tabArrs = tabArr === null ? [] : tabArr;
        // $scope.localData = angular.fromJson(localStorage.getItem("localData"))
        $scope.menuLists = [];
        $scope.config = {
            productSidebar: false
        };
        $scope.initMenu = function () {
            locLayoutService.getMenu().then(function (res) {
                if (res.status === 200) {
                    $scope.menuLists = res.data.list;
                }
            })
        };
        $rootScope.addTab = function (obj) {
            if (obj.sourceUrl === 'aep.loc.dashboard') {
                $state.go('aep.loc.dashboard');
            } else {
                let tabObj = {
                    'state': obj.sourceUrl,
                    'title': obj.sourceName,
                    'menuId': obj._id,
                    'rightMenu': false
                };
                $cookies.put(appSettings.menuId, obj._id);
                $scope.tabArrs.push(tabObj);
                $scope.tabArrs = _.uniqBy($scope.tabArrs, 'state');
                //临时缓存选中tab的信息
                localStorage.setItem("tabArr", angular.toJson($scope.tabArrs));
                $state.go(obj.sourceUrl);
                $timeout(function () {
                    let rightArrow = document.getElementsByClassName("nav-tabs");
                    // let openTag = rightArrow[0].getElementsByTagName("li");
                    // for (let i = 0; i < openTag.length; i++) {
                    //     openTag[i].style.left = c + "px";
                    // }
                }, 20);
            }
        };
        $scope.deleteTab = function (e, obj) {
            e.currentTarget.offsetParent.remove();
            $scope.tabArrs = _.remove($scope.tabArrs, function (value, index, array) {
                return value.state !== obj.state;
            });
            //临时缓存选中tab的信息
            localStorage.setItem("tabArr", angular.toJson($scope.tabArrs));

            if ($scope.tabArrs !== null && $scope.tabArrs.length >= 1) {
                let preState = _.last($scope.tabArrs);
                $cookies.put(appSettings.menuId, preState.menuId);
                $state.go(preState.state);
            } else {
                $state.go("aep.loc.dashboard");
            }
        };
        $scope.closeTab = function (type, obj) {
            $scope.tabArrs = [];
            if (type === 'all') {
                $state.go("aep.loc.dashboard");
            } else {
                obj.rightMenu = !obj.rightMenu;
                $scope.tabArrs.push(obj);
            }
            //清空缓存选中tab的信息
            localStorage.setItem("tabArr", angular.toJson($scope.tabArrs));
        };
        $scope.showTabs = function (obj) {
            $cookies.put(appSettings.menuId, obj.menuId);
            $state.go(obj.state);
        };
        let a = 0, b = 0, c = 0;
        // $scope.moveRight = function () {
        //     let rightArrow = document.getElementsByClassName("nav-tabs");
        //     let openTag = rightArrow[0].getElementsByTagName("li");
        //     let navWidth = document.getElementsByClassName("nav-box")[0].offsetWidth;
        //     let num = 0;
        //     for (let j = 0; j < openTag.length; j++) {
        //         num = num + openTag[j].offsetWidth;
        //     }
        //     if (num > navWidth) {
        //         a = a - 88;
        //         b = a;
        //         c = a;
        //         for (let i = 0; i < openTag.length; i++) {
        //             openTag[i].style.left = a + "px";
        //         }
        //         if (navWidth - (num - Math.abs(a) + 20) > 0) {
        //             a = a + 88;
        //         }

        //     }

        // };
        // $scope.moveLeft = function () {
        //     let rightArrow = document.getElementsByClassName("nav-tabs");
        //     let openTag = rightArrow[0].getElementsByTagName("li");
        //     if (b < 0) {
        //         b = b + 88;
        //         for (let i = 0; i < openTag.length; i++) {
        //             openTag[i].style.left = b + "px";
        //         }
        //         a = b;
        //     }

        // };
        $scope.minimizeToggle = function () {
            $scope.minimized = !$scope.minimized;
        };
        $scope.initMenu();
    }
]);