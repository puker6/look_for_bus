'use strict';

financeModule.controller('courseSettingController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService) {
        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';

        $scope.keyword = params.keyword ||'';
        $scope.gridOptions = {
            enableGridMenu: true, 
            rowHeight: 42, 
            enableColumnResizing: true,
            enableVerticalScrollbar : 0,
            enableHorizontalScrollbar:2,
            multiSelect:true,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };

        $scope.totle = {
            totleTwofirstBalance:''
        };
        
        $scope.tab = function(v){
            if(v == "PROPERTY"){
                $scope.focusIndexZ = true;
                $scope.focusIndexF = false;
                $scope.focusIndexQ = false;
                $scope.focusIndexC = false;
                $scope.focusIndexS = false;
            }else if(v == "DEBT"){
                $scope.focusIndexZ = false;
                $scope.focusIndexF = true;
                $scope.focusIndexQ = false;
                $scope.focusIndexC = false;
                $scope.focusIndexS = false;
            }else if(v == "LEGAL"){
                $scope.focusIndexZ = false;
                $scope.focusIndexF = false;
                $scope.focusIndexQ = true;
                $scope.focusIndexC = false;
                $scope.focusIndexS = false;
            }else if(v == "COST"){
                $scope.focusIndexZ = false;
                $scope.focusIndexF = false;
                $scope.focusIndexQ = false;
                $scope.focusIndexC = true;
                $scope.focusIndexS = false;
            }else if(v == "LOSSES"){
                $scope.focusIndexZ = false;
                $scope.focusIndexF = false;
                $scope.focusIndexQ = false;
                $scope.focusIndexC = false;
                $scope.focusIndexS = true;

            }
            // $.misShowLoader();
                let requestParams = {
                    page:parseInt(params.page) || 1,
                    rows:parseInt(params.size) || 12,
                    find:$scope.keyword ||"",
                    /** 科目类别 */
                    courseCategory:v ||"",
                } 
                financeService.findFeeCourses(requestParams).then(function(res){
                    // console.log(res)
                    $scope.result = res.data;
                    if(res.data.code===1){
                        $scope.gridOptions.data = $scope.result.data;
                        $scope.model.totalCount = $scope.result.count;
                        $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                        $scope.model.pageNo = parseInt(params.page) ||1;
                        $scope.model.pageSize = parseInt(params.size) ||12;

                        let arr1 = [];

                        angular.forEach($scope.gridOptions.data, function(item){
                            if(item.courseType == "0"){
                                item.courseType = '借';
                            }
                            if(item.courseType == "1"){
                                item.courseType = '贷';
                            }
                            
                            // 累计子集期初余额
                            let sum = 0;
                            let sumJ = 0;
                            let sumD = 0;
                            for(let i=0;i<$scope.gridOptions.data.length;i++){
                                if($scope.gridOptions.data[i].parentCourseId && item.courseNum == $scope.gridOptions.data[i].parentCourseId.courseNum){
                                    if($scope.gridOptions.data[i].firstBalanceId) {
                                        sum += $scope.gridOptions.data[i].firstBalanceId.balance;
                                        sumJ += $scope.gridOptions.data[i].firstBalanceId.gathMoney;
                                        sumD += $scope.gridOptions.data[i].firstBalanceId.payMoney;
                                    }
                                }

                            }
                            item.qcBalance = sum;
                            item.JMoney = sumJ;
                            item.DMoney = sumD;
                            arr1.push(item);

                        });

                        let arr2 = arr1;// 此处是为了区分不同数组，其实数据源是一个
                        // 第二次遍历：统计各子集的期初余额
                        for(let a = 0; a < arr2.length; a++){
                            let sum2 = 0;
                            let sum2J = 0;
                            let sum2D = 0;
                            for(let b = 0; b < arr2.length; b++){
                                if(arr2[b].parentCourseId && arr2[a].courseNum == arr2[b].parentCourseId.courseNum){
                                    if(arr2[b].isLastCourse == 0){// 存在子集，累计子集的期初余额
                                        sum2 += arr2[b].qcBalance;
                                        sum2J += arr2[b].JMoney;
                                        sum2D += arr2[b].DMoney;
                                    }else{// 没有子集，累计自己的余额
                                        if(arr2[b].firstBalanceId) sum2 += arr2[b].firstBalanceId.balance;
                                        if(arr2[b].firstBalanceId) sum2J += arr2[b].firstBalanceId.gathMoney;
                                        if(arr2[b].firstBalanceId) sum2D += arr2[b].firstBalanceId.payMoney;
                                    }
                                }
                            }

                            arr2[a].qcBalance = sum2;
                            arr2[a].JMoney = sum2J;
                            arr2[a].DMoney = sum2D;
                        }



                        angular.forEach(arr2, function(item){
                            if(item.isLastCourse == 0){// 存在子集，累计子集的期初余额
                                // 计算年初余额
                                if(item.courseType == "借"){
                                    let cMoney = Number(item.qcBalance) - Number(item.JMoney) + Number(item.DMoney);
                                    item.firstMoney = cMoney;
                                    console.log(item.firstMoney)
                                }else if(item.courseType == "贷"){
                                    let cMoney = Number(item.qcBalance) + Number(item.JMoney) - Number(item.DMoney);
                                    item.firstMoney = cMoney;
                                }
                            }else if(item.isLastCourse == 1){
                                    // 计算年初余额
                                    if(item.courseType == "借"){
                                        let cMoney = Number(item.firstBalanceId.balance) - Number(item.firstBalanceId.gathMoney) + Number(item.firstBalanceId.payMoney);
                                        item.firstMoney = cMoney;
                                        console.log(item.firstMoney)
                                    }else if(item.courseType == "贷"){
                                        let cMoney = Number(item.balance) + Number(item.firstBalanceId.gathMoney) - Number(item.firstBalanceId.payMoney);
                                        item.firstMoney = cMoney;
                                    }
                            }
                            
                        })
                    }
                },function () {
                    $scope.model.error = true;
                }).finally(function () {
                    // $.misHideLoader();
                    $scope.model.empty = $scope.result === null || $scope.result.data === null || $scope.result.data.length === 0;
                });
        };
        
        // 设置初期余额
        $scope.setBalance = function(obj){
            console.log(obj)
            $scope.balance = obj.firstBalanceId.balance;
            $scope.courseId = obj.id;
            $scope.gathMoney = obj.firstBalanceId.gathMoney;
            $scope.payMoney = obj.firstBalanceId.payMoney;
            $scope.setId = obj.firstBalanceId.id;
            let requestParams = {
                /** 期初余额  */
                balance:$scope.balance || "0",
                /** 被设置的科目id */
                courseId:$scope.courseId ||"",
                /** 收入金额 */
                gathMoney:$scope.gathMoney || "0",
                /** 支出金额 */
                payMoney:$scope.payMoney ||"0",
                /** 期初记录id 修改时传入 */
                setId:$scope.setId ||""
            }
            financeService.firstBalanceSet(requestParams).then(function(res){
                if(res.data.code===1){
                    if(($scope.focusIndexZ == true) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == false) && ($scope.focusIndexS == false)){
                        $scope.tab("PROPERTY");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == true) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == false) && ($scope.focusIndexS == false)){
                        $scope.tab("DEBT");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == true) && ($scope.focusIndexC == false) && ($scope.focusIndexS == false)){
                        $scope.tab("LEGAL");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == true) && ($scope.focusIndexS == false)){
                        $scope.tab("COST");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == false) && ($scope.focusIndexS == true)){
                        $scope.tab("LOSSES");
                    }
                }else{
                    $.misMsg(res.data.msg);
                }
                
            })

        };
        $scope.setBalanceS = function(obj){
            console.log(obj)
            $scope.balance = obj.firstBalanceId.balance;
            $scope.courseId = obj.id;
            $scope.gathMoney = obj.firstBalanceId.gathMoney;
            $scope.payMoney = obj.firstBalanceId.payMoney;
            $scope.setId = obj.firstBalanceId.id;
            let requestParams = {
                /** 期初余额  */
                balance:$scope.balance ||"0",
                /** 被设置的科目id */
                courseId:$scope.courseId ||"",
                /** 收入金额 */
                gathMoney:$scope.gathMoney || "0",
                /** 支出金额 */
                payMoney:$scope.payMoney ||"0",
                /** 期初记录id 修改时传入 */
                setId:$scope.setId ||""
            }
            financeService.firstBalanceSet(requestParams).then(function(res){
                if(res.data.code===1){
                    if(($scope.focusIndexZ == true) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == false) && ($scope.focusIndexS == false)){
                        $scope.tab("PROPERTY");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == true) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == false) && ($scope.focusIndexS == false)){
                        $scope.tab("DEBT");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == true) && ($scope.focusIndexC == false) && ($scope.focusIndexS == false)){
                        $scope.tab("LEGAL");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == true) && ($scope.focusIndexS == false)){
                        $scope.tab("COST");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == false) && ($scope.focusIndexS == true)){
                        $scope.tab("LOSSES");
                    }
                }else{
                    $.misMsg(res.data.msg);
                }
            })
        };
        $scope.setBalanceZ = function(obj){
            console.log(obj)
            $scope.balance = obj.firstBalanceId.balance;
            $scope.courseId = obj.id;
            $scope.gathMoney = obj.firstBalanceId.gathMoney;
            $scope.payMoney = obj.firstBalanceId.payMoney;
            $scope.setId = obj.firstBalanceId.id;
            let requestParams = {
                /** 期初余额  */
                balance:$scope.balance ||"0",
                /** 被设置的科目id */
                courseId:$scope.courseId ||"",
                /** 收入金额 */
                gathMoney:$scope.gathMoney || "0",
                /** 支出金额 */
                payMoney:$scope.payMoney ||"0",
                /** 期初记录id 修改时传入 */
                setId:$scope.setId ||""
            }
            financeService.firstBalanceSet(requestParams).then(function(res){
                if(res.data.code===1){
                    if(($scope.focusIndexZ == true) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == false) && ($scope.focusIndexS == false)){
                        $scope.tab("PROPERTY");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == true) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == false) && ($scope.focusIndexS == false)){
                        $scope.tab("DEBT");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == true) && ($scope.focusIndexC == false) && ($scope.focusIndexS == false)){
                        $scope.tab("LEGAL");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == true) && ($scope.focusIndexS == false)){
                        $scope.tab("COST");
                    }else if(($scope.focusIndexZ == false) && ($scope.focusIndexF == false) && ($scope.focusIndexQ == false) && ($scope.focusIndexC == false) && ($scope.focusIndexS == true)){
                        $scope.tab("LOSSES");
                    }
                }else{
                    $.misMsg(res.data.msg);
                }
            })
        };



        $scope.gridOptions.columnDefs = [
            {name: 'courseNum', displayName: '科目编码',minWidth: 80, enablePinning: true,
            cellTemplate: `<div ng-if="row.entity.level === 1" class="title-place">{{row.entity.courseNum}}</div>
            <div ng-if="row.entity.level === 2" class="title-place-two">{{row.entity.courseNum}}</div>
            <div ng-if="row.entity.level === 3" class="title-place-three">{{row.entity.courseNum}}</div>`},
            {name: 'courseName', displayName: '科目名称',minWidth: 100, enablePinning: false,
            cellTemplate: `<div ng-if="row.entity.level === 1" class="title-place">{{row.entity.courseName}}</div>
            <div ng-if="row.entity.level === 2" class="title-place-two">{{row.entity.courseName}}</div>
            <div ng-if="row.entity.level === 3" class="title-place-three">{{row.entity.courseName}}</div>`},
            {name: 'courseType', displayName: '方向',minWidth: 100, enablePinning: false},
            {name: 'balance', displayName: '期初余额',minWidth: 100, enablePinning: false,
            cellTemplate: `
            <div ng-if="row.entity.courseCategory == 'LOSSES'" ></div>
            <div ng-if="!(row.entity.courseCategory == 'LOSSES')">
            <div ng-if="row.entity.isLastCourse ===1" >
            <div ng-if="row.entity.level ===1">
            <input type="text" class="form-input" ng-blur="grid.appScope.setBalance(row.entity)" ng-model="row.entity.firstBalanceId.balance">
            </div>
            <div ng-if="row.entity.level ===2">
            <input id="totleTwofirstBalance" type="text" class="form-input" ng-blur="grid.appScope.setBalance(row.entity)" ng-model="row.entity.firstBalanceId.balance">
            </div>
            <div ng-if="row.entity.level ===3">
            <input  type="text" class="form-input" ng-blur="grid.appScope.setBalance(row.entity)" ng-model="row.entity.firstBalanceId.balance">
            </div>
            </div>
            <div ng-if="row.entity.isLastCourse ===0" class="title-place-top">{{row.entity.qcBalance}}</div>
            </div>
            `},
            {name: 'gathMoney', displayName: '借方累计',minWidth: 100, enablePinning: false,
            cellTemplate: `
            <div ng-if="row.entity.isLastCourse ===1">
            <div ng-if="row.entity.level ===1">
            <input type="text" class="form-input" ng-blur="grid.appScope.setBalanceS(row.entity)" ng-model="row.entity.firstBalanceId.gathMoney">
            </div>
            <div ng-if="row.entity.level ===2">
            <input type="text" class="form-input" ng-blur="grid.appScope.setBalanceS(row.entity)" ng-model="row.entity.firstBalanceId.gathMoney">
            </div>
            <div ng-if="row.entity.level ===3">
            <input type="text" class="form-input" ng-blur="grid.appScope.setBalanceS(row.entity)" ng-model="row.entity.firstBalanceId.gathMoney">
            </div>
            </div>
            <div ng-if="row.entity.isLastCourse ===0" class="title-place-top">{{row.entity.JMoney}}</div>
            `},
            {name: 'payMoney', displayName: '贷方累计',minWidth: 100, enablePinning: false,
            cellTemplate: `
            <div ng-if="row.entity.isLastCourse ===1">
            <div ng-if="row.entity.level ===1">
            <input type="text" class="form-input" ng-blur="grid.appScope.setBalanceZ(row.entity)" ng-model="row.entity.firstBalanceId.payMoney">
            </div>
            <div ng-if="row.entity.level ===2">
            <input type="text" class="form-input" ng-blur="grid.appScope.setBalanceZ(row.entity)" ng-model="row.entity.firstBalanceId.payMoney">
            </div>
            <div ng-if="row.entity.level ===3">
            <input type="text" class="form-input" ng-blur="grid.appScope.setBalanceZ(row.entity)" ng-model="row.entity.firstBalanceId.payMoney">
            </div>
            </div>
            <div ng-if="row.entity.isLastCourse ===0" class="title-place-top">{{row.entity.DMoney}} </div>
            `},
            {name: 'courseCategory', displayName: '年初余额',minWidth: 100, enablePinning: false,
            cellTemplate: `
            <div ng-if="row.entity.courseCategory == 'LOSSES'" ></div>
            <div class="title-place-top" ng-if="!(row.entity.courseCategory == 'LOSSES')">{{row.entity.firstMoney}}</div>
            `
        },
        ];



        // 试算平衡
        $scope.balanceLook = function(){
            $scope.balanceShow = true;
        };
        // 取消
        $scope.closeConfirm = function(){
            $scope.balanceShow = false;
        };
        

        ($scope.init = function(){
            $scope.tab("PROPERTY");
            // $scope.findCourseTrades();
            // $scope.findCourses();
        })();
    }])