

(()=>{

    'use strict';

    angular
        .module('aep')
        .directive('clickDisable', clickDisable)
        .directive("emailVerify", emailVerify)
        .directive('fuzzySerchBox', fuzzySerchBox)
        .directive('misPagination', misPagination)
        .directive("misCheckbox", misCheckbox)
        .directive("misAllCheckbox", function () {
            return {
                restrict: "A",
                link: function (scope, element, attr) {
                    element.bind("change", function (e) {
                        scope.$apply(function () {
                            let value = element.prop("checked");
                            angular.forEach(scope.$eval(attr.collection), function (item) {
                                item[attr.property] = value;
                            });
                        });
                    });
                    scope.$watch(attr.collection, function (newVal) {
                        let hasTrue, hasFalse;
                        angular.forEach(newVal, function (item) {
                            if (item[attr.property])
                                hasTrue = true;
                            else
                                hasFalse = true;
                        });
                        scope.$eval(attr.ngModel + " = " + ((hasTrue && hasFalse) ? false : hasTrue));
                    }, true);
                }
            };
        })
        .directive("misBackToTop", function () {
            return {
                restrict: "AEC",
                template: '<i class="fa fa-angle-up"></i>',
                link: function (scope, element, attr) {
                    let e = $(element);
                    $(window).scroll(function () {
                        if ($(document).scrollTop() > 100)
                            e.fadeIn(200);
                        else
                            e.fadeOut(200);
                    });
                    /*点击回到顶部*/
                    e.click(function () {
                        $('html, body').animate({
                            scrollTop: 0
                        }, 500);
                    });
                }
            };
        })
        .directive('ngEcharts', ['$window', function ($window) {
            return {
                restrict: 'AEC',
                scope: {
                    option: '=ecOption',
                    config: '=ecConfig'
                },
                link: function (scope, element, attrs, ctrl) {
                    function refreshChart(param) {
                        let theme = (scope.config && scope.config.theme)
                            ? scope.config.theme : 'default';
                        let chart = echarts.init(element[0], theme);
                        if (scope.config && scope.config.dataLoaded === false) {
                            chart.showLoading();
                        }

                        if (scope.config && scope.config.dataLoaded) {
                            chart.setOption(scope.option);
                            chart.resize();
                            chart.hideLoading();
                        }

                        if (scope.config && scope.config.event) {
                            if (angular.isArray(scope.config.event)) {
                                angular.forEach(scope.config.event, function (value, key) {
                                    for (let e in value) {
                                        chart.on(e, value[e]);
                                    }
                                });
                            }
                        }
                        if (param !== undefined) {
                            chart.resize();
                        }
                    }

                    /*  自定义参数 - config
                     event 定义事件
                     theme 主题名称
                     dataLoaded 数据是否加载*/
                    scope.$watch(
                        function () {
                            return scope.config;
                        },
                        function (value) {
                            if (value) {
                                refreshChart();
                            }
                        },
                        true
                    );

                    //图表原生option
                    scope.$watch(
                        function () {
                            return scope.option;
                        },
                        function (value) {
                            if (value) {
                                refreshChart();
                            }
                        },
                        true
                    );
                    $window.addEventListener("visibilitychange", function () {
                        refreshChart('change');
                    });
                    $window.addEventListener("resize", function () {
                        refreshChart('resize');
                    });
                }
            }
        }])
        .directive('ngRightClick', ['$parse', '$window', '$state', function ($parse, $window, $state) {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    curModel: '=',
                    toggleMenu: '&',
                },
                require: '?ngModel',
                link: function (scope, element, attrs) {
                    let fn = $parse(attrs.ngRightClick);
                    //右键打开或关闭菜单
                    scope.toggleMenu = function () {
                        scope.curModel.rightMenu = !scope.curModel.rightMenu;
                    };
                    //显示右键菜单
                    element.bind('contextmenu', function (event) {
                        scope.$apply(function () {
                            event.preventDefault();
                            if (scope.curModel.state === $state.current.name) {
                                fn(scope, {$event: event});
                            }
                        });
                    });
                    //窗口绑定点击事件 隐藏右键菜单
                    angular.element($window).bind('click', function (event) {
                        if (scope.curModel.rightMenu) {
                            scope.$apply(function () {
                                event.preventDefault();
                                fn(scope, {$event: event});
                            });
                        }
                    });
                }
            }
        }])
        .directive("orgTreeSelect", function () {
            return {
                restrict: "A",
                replace: true,
                link: function (scope, element, attr) {
                    let curElement = $(element);
                    curElement.on("click", function () {
                        scope.show();
                    });
                    scope.show = function () {
                        curElement.siblings(".organization-select-container").css({display: "block"});
                        angular.element("body").bind("mousedown", scope.onBodyDown);
                    };
                    scope.hide = function () {
                        curElement.siblings(".organization-select-container").css({display: "none"});
                        angular.element("body").unbind("mousedown", scope.onBodyDown);
                    };
                    scope.onBodyDown = function (event) {
                        if (!(event.target.class === "select-group" || event.target.class === "organization-select-container" || angular.element(event.target).parents(".organization-select-container").length > 0)) {
                            scope.hide();
                        }
                    }
                }
            }
        })
        .directive("permissionShow", ['userPrivilegeService', 'permissions', function (userPrivilegeService, permissions) {
            return {
                restrict: "A",
                link: function (scope, element, attr) {
                    element.hide();
                    function showVisibilityBasedOnPermission() {
                        userPrivilegeService.hasPermission(attr.permissionShow).then(function () {
                            element.show();
                        }, function () {
                            element.remove();
                        });
                    }

                    showVisibilityBasedOnPermission();
                    //scope.$on('permissionsChanged', showVisibilityBasedOnPermission);
                }
            };
        }])
        .directive("sidebarCollapse", function () {
            let tplUrl = config.schemaVersion === 'prod' ? './templates/' : './app/views/';
            return {
                restrict: "AEC",
                replace: true,
                scope: true,
                templateUrl: tplUrl + 'comDirective/module_sidebar_collapse.html',
                link: function (scope, element, attr) {
                    scope.collapseProductSidebar = function () {
                        scope.config.disableNavigation = !scope.config.disableNavigation;
                    };
                }
            }
        })
        .directive("secondToggleCollapse", ['$http', function ($http) {
            return {
                restrict: "A",
                replace: true,
                link: function (scope, element, attr) {
                    let menuDom = $(element);
                    //控制事件
                    function collapseMenu(curDom) {
                        if (curDom.hasClass("nav_box")) {
                            curDom.find(".sub-nav").slideToggle(300);
                        }
                    }

                    //菜单的收缩变换
                    menuDom.on('click', function () {
                        let iFold = $(this).children("i:last-child");
                        if (iFold.hasClass("fa-angle-down")) {
                            iFold.removeClass("fa-angle-down").addClass("fa-angle-right");
                        } else {
                            iFold.removeClass("fa-angle-right").addClass("fa-angle-down");
                        }
                        collapseMenu(menuDom.parent().parent());
                    });
                }
            }
        }])
        .directive("toggleCollapse", ['$http', function ($http) {
            return {
                restrict: "A",
                replace: true,
                scope: {
                    type: '='
                },
                link: function (scope, element, attr) {
                    let menuDom = $(element);
                    //控制事件
                    function collapseMenu(curDom, type) {
                        let otheriFold = curDom.siblings().children('.nav-title').find("i:last-child");
                        if (curDom.hasClass("nav_box")) {
                            if (type) {
                                //curDom.find(".nav-title a i:first-child").toggleClass("highLight-fa");
                                curDom.siblings().children('.sub-nav').fadeOut(300);
                                otheriFold.removeClass("fa-angle-left").addClass("fa-angle-right");
                                curDom.find(".sub-nav").fadeToggle(300);
                            } else {
                                curDom.siblings().children('.sub-nav').slideUp(500);
                                otheriFold.removeClass("fa-angle-up").addClass("fa-angle-down");
                                curDom.find(".sub-nav").slideToggle(500);
                            }
                        } else {
                            if (type) {
                                curDom.siblings().children('.sub-second-nav').fadeOut(300);
                                otheriFold.removeClass("fa-angle-left").addClass("fa-angle-right");
                                curDom.find(".sub-second-nav").fadeToggle(300);
                            } else {
                                curDom.siblings().children('.sub-second-nav').slideUp(500);
                                otheriFold.removeClass("fa-angle-up").addClass("fa-angle-down");
                                curDom.find(".sub-second-nav").slideToggle(500);
                            }
                        }
                    }

                    //菜单的收缩变换
                    menuDom.on('click', function () {
                        let iFold = $(this).find("i:last-child");
                        if (scope.type) {
                            if (iFold.hasClass("fa-angle-right")) {
                                iFold.removeClass("fa-angle-right").addClass("fa-angle-left");
                            } else {
                                iFold.removeClass("fa-angle-left").addClass("fa-angle-right");
                            }
                        } else {
                            if (iFold.hasClass("fa-angle-down")) {
                                iFold.removeClass("fa-angle-down").addClass("fa-angle-up");
                            } else {
                                iFold.removeClass("fa-angle-up").addClass("fa-angle-down");
                            }
                        }
                        collapseMenu(menuDom.parent().parent(), scope.type);
                    });
                }
            }
        }])
        .directive("treeNode", ['$cookies', 'appSettings', function ($cookies, appSettings) {
            let tplUrl = config.schemaVersion === 'prod' ? './templates/' : './app/views/';
            return {
                restrict: "E",
                replace: true,
                templateUrl: tplUrl + 'comDirective/module_treeNode.html',
                link: function (scope, element, attr) {
                    scope.accessInfo = {};
                    let accessSecret = $cookies.get(appSettings.accessSecret),
                        // accessInfo = $cookies.getObject(appSettings.accessInfo);
                        accessInfo = angular.fromJson(localStorage.getItem('accessInfoList')) || [];
                    angular.forEach(accessInfo, function (obj) {
                        if (accessSecret === obj.accessSecret) {
                            scope.accessInfo = obj;
                        }
                    });
                    //第一级根节点收缩事件
                    scope.firstFold = function (e) {
                        let firstDom = $(e.target);
                        if (firstDom.hasClass("fa-angle-right")) {
                            firstDom.parent().parent().find(".tree-second-node").slideDown();
                            firstDom.removeClass("fa-angle-right").addClass("fa-angle-down");
                        } else {
                            firstDom.parent().parent().find(".tree-second-node").slideUp();
                            firstDom.removeClass("fa-angle-down").addClass("fa-angle-right");
                        }
                    };
                    //第二级根节点收缩事件
                    scope.secondFold = function (e) {
                        let secondDom = $(e.target);
                        if (secondDom.hasClass("fa-angle-right")) {
                            secondDom.removeClass("fa-angle-right").addClass("fa-angle-down");
                            secondDom.parent().parent().find(".tree-second-node-sub").slideDown();
                        } else {
                            secondDom.parent().parent().find(".tree-second-node-sub").slideUp();
                            secondDom.removeClass("fa-angle-down").addClass("fa-angle-right");
                        }

                    };
                    scope.$watch('viewContentLoaded', function () {
                        $(function () {
                            // $("[data-toggle='tooltip']").tooltip();
                        });
                    });
                }
            }
        }])
        .directive("treeNodeControl", ['$cookies', 'appSettings', function ($cookies, appSettings) {
            let tplUrl = config.schemaVersion === 'prod' ? './templates/' : './app/views/';
            return {
                restrict: "E",
                replace: true,
                templateUrl: tplUrl + 'comDirective/module_treeNode_control.html',
                link: function (scope, element, attr) {
                    scope.accessInfo = {};
                    let accessSecret = $cookies.get(appSettings.accessSecret),
                        accessInfo = angular.fromJson(localStorage.getItem('accessInfoList')) || []; //$cookies.getObject(appSettings.accessInfo);
                    angular.forEach(accessInfo, function (obj) {
                        if (accessSecret === obj.accessSecret) {
                            scope.accessInfo = obj;
                        }
                    });

                }
            }
        }])
        .directive("treeNodeSelect", ['$cookies', 'appSettings', function ($cookies, appSettings) {
            let tplUrl = config.schemaVersion === 'prod' ? './templates/' : './app/views/';
            return {
                restrict: "E",
                replace: true,
                templateUrl: tplUrl + 'comDirective/module_tree_select.html',
                link: function (scope, element, attr) {
                    scope.accessInfo = {};
                    let accessSecret = $cookies.get(appSettings.accessSecret),
                        accessInfo = angular.fromJson(localStorage.getItem('accessInfoList')) || []; //$cookies.getObject(appSettings.accessInfo);
                    angular.forEach(accessInfo, function (obj) {
                        if (accessSecret === obj.accessSecret) {
                            scope.accessInfo = obj;
                        }
                    });
                    //第一级根节点收缩事件
                    // scope.firstFold = function (e) {
                    //     let firstDom = $(e.target);
                    //     if (firstDom.hasClass("fa-angle-right")) {
                    //         firstDom.parent().parent().find(".tree-second-node").slideDown();
                    //         firstDom.removeClass("fa-angle-right").addClass("fa-angle-down");
                    //     } else {
                    //         firstDom.parent().parent().find(".tree-second-node").slideUp();
                    //         firstDom.removeClass("fa-angle-down").addClass("fa-angle-right");
                    //     }
                    // };
                    // //第二级根节点收缩事件
                    // scope.secondFold = function (e) {
                    //     let secondDom = $(e.target);
                    //     if (secondDom.hasClass("fa-angle-right")) {
                    //         secondDom.removeClass("fa-angle-right").addClass("fa-angle-down");
                    //         secondDom.parent().parent().find(".tree-second-node-sub").slideDown();
                    //     } else {
                    //         secondDom.parent().parent().find(".tree-second-node-sub").slideUp();
                    //         secondDom.removeClass("fa-angle-down").addClass("fa-angle-right");
                    //     }
                    //
                    // };
                }
            }
        }])
        .directive('treeView', [function () {
            let tplUrl = config.schemaVersion === 'prod' ? './templates/' : './app/views/';
            return {
                restrict: 'E',
                templateUrl: tplUrl + 'comDirective/module_tree.html',
                scope: {
                    treeData: '=',
                    canChecked: '=',
                    textField: '@',
                    itemClicked: '&',
                    itemCheckedChanged: '&',
                    itemTemplateUrl: '@'
                },
                controller: ['$scope', function ($scope) {

                    $scope.getStyle = function (index) {
                        if (index == true) {
                            return 'glyphicon glyphicon-ok';
                        } else if (index == false) {
                            return 'glyphicon';
                        } else {
                            return 'glyphicon glyphicon-minus';
                        }
                    };
                    $scope.getChirldState = function (ele) {
                        var first = ele[0].checked;
                        for (var i = 0; i < ele.length; i++) {
                            if (first !== ele[i].checked || ele[i].style === 'glyphicon glyphicon-minus') {
                                return "x";
                            }
                        }
                        return first;
                    };
                    $scope.updateStyle = function (nodeTree) {
                        for (var i = 0; i < nodeTree.length; i++) {
                            if (nodeTree[i].children.length === 0) {
                                nodeTree[i].style = $scope.getStyle(nodeTree[i].checked);
                            } else {
                                $scope.updateStyle(nodeTree[i].children);
                                nodeTree[i].style = $scope.getStyle($scope.getChirldState(nodeTree[i].children));
                            }
                        }
                    };
                    $scope.$on('type-temp', function (event, data) {
                        if (data != 1) {
                            //反向更新父节点状态
                            $scope.changePrentState($scope.treeData, data);
                        }
                        $scope.updateStyle($scope.treeData);
                    });
                    $scope.itemExpended = function (item, $event) {
                        item.$$isExpend = !item.$$isExpend;
                        $event.stopPropagation();
                    };
                    $scope.getItemIcon = function (item) {
                        var isLeaf = $scope.isLeaf(item);
                        if (isLeaf) {
                            return 'fa fa-minus';
                        }
                        return item.$$isExpend ? 'fa fa-plus' : 'fa fa-minus';
                    };
                    $scope.isLeaf = function (item) {
                        return !item.children || !item.children.length;
                    };
                    $scope.warpCallback = function (callback, item, $event) {
                        ($scope[callback] || angular.noop)({
                            $item: item,
                            $event: $event
                        });
                    };
                    $scope.changeState = function (nodeTree, bool) {
                        for (var i = 0; i < nodeTree.length; i++) {
                            nodeTree[i].checked = bool;
                            if (nodeTree[i].children.length === 0) {
                                continue;
                            } else {
                                $scope.changeState(nodeTree[i].children, bool);
                            }
                        }
                        return false;
                    };
                    $scope.getPrentEle = function (nodeTree, item, pEle) {
                        for (var i = 0; i < nodeTree.length; i++) {
                            if (nodeTree[i].id === item.id) {
                                return pEle;
                            }
                            if (nodeTree[i].children.length != 0) {
                                var ele = $scope.getPrentEle(nodeTree[i].children, item, nodeTree[i]);
                                if (ele === "") {
                                    continue;
                                }
                                return ele;
                            }
                        }
                        return "";
                    }
                    $scope.changePrentState = function (nodeTree, item) {
                        var pEle = $scope.getPrentEle(nodeTree, item, "");
                        if (pEle === "") {
                            return;
                        }
                        //检测父节点下的状态，并更新自身状态
                        var ele = pEle.children;
                        var bool = ele[0].checked;
                        for (var i = 0; i < ele.length; i++) {
                            bool = bool || ele[i].checked;
                        }
                        pEle.checked = bool;
                        $scope.changePrentState(nodeTree, pEle);
                    }
                    $scope.itemCheckedChanged = function (tree, $item) {
                        $item.checked = !$item.checked;
                        //正向更新子节点
                        $scope.changeState($item.children, $item.checked);
                        //反向更新父节点状态
                        $scope.changePrentState(tree, $item);
                        //更新样式
                        $scope.updateStyle($scope.treeData);
                    };
                    $scope.warpCallback1 = function (tree, item, $event) {
                        $scope.itemCheckedChanged(tree, item);
                    };
                }]
            };
        }]);

    clickDisable.$inject = ['$timeout'];

    fuzzySerchBox.$inject = ['$parse', '$state', '$compile'];

    misPagination.$inject = ['$state', 'appSettings'];

    function clickDisable($timeout) {

        let directive = {
            scope: {
                clickDisable: '&'
            },
            link: link
        };

        return  directive;

        function link(scope, element, attr) {
            let delay = 3000;
            element.bind('click', function () {
                element.prop('disabled', true);
                scope.clickDisable(function () {
                    element.prop('disabled', false);
                });
                $timeout(function () {
                    element.prop('disabled', false);
                }, delay, false)
            });
        }
    }

    function emailVerify() {

        let directive = {
            restrict: 'A',
            require: 'ngModel',
            scope: {},
            link: link
        };

        return directive;

        function link(scope, elem, attrs, ctrl) {
            let emailRegexp = /^([a-z0-9]*[-_.]?[a-z0-9]+)+@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i;

            //初始化指令时不执行，Model变化时执行
            ctrl.$parsers.unshift(function (viewValue) {
                //验证通过,myForm.email.$error.emailverify置为false
                ctrl.$setValidity('emailverify', true);

                if (viewValue && !emailRegexp.test(viewValue)) {
                    //验证不通过,myForm.email.$error.emailverify置为true
                    ctrl.$setValidity('emailverify', false);
                }
                // $parsers数组中的函数会以流水线的形式被逐个调用。第一个$parse被调用后,执行结果会传 递给第二个$parse,以此类推。
                return viewValue;
            });
        }

    }

    function fuzzySerchBox($parse, $state, $compile) {

        let tplUrl = config.schemaVersion === 'prod' ? './templates/' : './app/views/';

        let directive = {
            restrict: "E",
            templateUrl: tplUrl + 'comDirective/module_fuzzy.html',
            link: link
        };

        return directive;

        function link(scope, element, attr) {
            scope.fuuzyBoxShow = false;
            var data = [];
            scope.fuzzyBoxClear = function () {
                var ele = angular.element("#fuzzySerchBox").children();
                for (var i = 0; i < ele.length; i++) {
                    ele[i].remove();
                }
            }
            scope.changeView = function (value) {
                var html = "";
                scope.fuzzyBoxClear();
                for (var i = 0; i < value.length; i++) {
                    var html = html + '<li ng-click="fuzzyTempEvent(this,' + i + ')">' + value[i][attr.showfiled] + '</li>';
                }
                var template = angular.element(html);
                var mobileDialogElement = $compile(template)(scope);
                angular.element("#fuzzySerchBox").append(mobileDialogElement);
            };
            scope.fuzzySerchBoxMove = function () {
                scope.fuuzyBoxShow = false;
            }
            scope.showFuzzyBox = function (value) {
                scope.fuzzySerchBoxStyle = {
                    'min-width': $("#" + attr.parentelementid).outerWidth()
                }
                data = value;
                if (data.length !== 0) {
                    scope.fuuzyBoxShow = true;
                }
                scope.changeView(data);
            };
            scope.fuzzyTempEvent = function (e, index) {
                scope.fuuzyBoxShow = false;
                scope.fuzzyEvent(e, data[index]);
            }
        }
    }

    function misPagination($state, appSettings) {
        let tplUrl = config.schemaVersion === 'prod' ? './templates/' : './app/views/';

        let directive = {
            restrict: "E",
            templateUrl: tplUrl + 'comDirective/module_pagination.html',
            replace: true,
            scope: {
                'class': '=',
                recordTotal: '=',
                pageIndex: '=',
                pageSize: '=',
                pageTotal: '=',
                pageState: '=',
                searchKeyword: '=',
                emptyStatus: '=',
                errorStatus: '=',
                pageChanged: '&'
            },
            link: link
        };

        return directive;

        function link(scope, element, attr) {
            scope.pageIndexInput = 1;
            scope.pageSizes = [{name: '10 条/页', value: 10}, {name: '20 条/页', value: 20}, {
                name: '40 条/页',
                value: 40
            }, {name: '80 条/页', value: 80}];
            scope.$watch('pageIndex', function () {
                scope.pageIndexInput = scope.pageIndex;
            });
            //翻页
            scope.pageChanged = function (val) {
                let params;
                if (val) {
                    params = $.extend({}, $state.params, {page: val});
                } else {
                    params = $.extend({}, $state.params, {page: scope.pageIndex});
                }
                $state.go(scope.pageState, params);
            };
            //切换每页条数限制
            scope.pageSizeChange = function () {
                let params = $.extend({}, $state.params, {page: 1, size: scope.pageSize});
                $state.go(scope.pageState, params);
            };
            //跳转页面
            scope.changeByPageIndex = function () {
                let params = $state.params;
                params.page = scope.pageIndexInput;
                if (scope.pageIndexInput > scope.pageTotal) {
                    params.page = scope.pageTotal;
                }

                if (scope.searchKeyword !== "") {
                    params.keyword = scope.searchKeyword;
                }
                $state.go(scope.pageState, params, {reload: true});
            };
            //刷新页面
            scope.refresh = function () {
                let params = $.extend({}, $state.params);
                //$state.go(scope.pageState, params, {reload: true});
                $state.reload(scope.pageState);
            };
            // 监控页码,发生改变既请求
            scope.$watch('recordTotal', function (item) {
                scope.pageTotal = Math.ceil(scope.recordTotal / scope.pageSize);
                if (scope.pageIndex > 1 && scope.pageIndex > scope.pageTotal) scope.pageChanged(scope.pageTotal);
            });
        }
    }

    function misCheckbox() {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                let $e = $(element);
                let label = $e.parent("label");
                if (attr.ngModel !== "") {
                    scope.$watch(attr.ngModel, function (newVal) {
                        if (newVal)
                            label.addClass("checked").removeClass("unchecked");
                        else
                            label.addClass("unchecked").removeClass("checked");
                    }, true);
                }
                $e.on("focus", function () {
                    label.addClass("focus");
                }).on("blur", function () {
                    label.removeClass("focus");
                });
            }
        };
    }

})();
