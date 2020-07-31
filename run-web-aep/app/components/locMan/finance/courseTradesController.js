'use strict';

financeModule.controller('courseTradesController', [
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
        // 获取科目列表
        $scope.findCourses = function(){
            let requestParams = {
                tips: '',
            } 
            financeService.findCourses(requestParams).then(function(res){
                console.log(res)
                $(function (){
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                });
                $scope.feeCourseList = res.data.data;
                console.log($scope.feeCourseList);
               
            })
        };

        // 将数组转化为树状数组
        $scope.load = function(){
            var list = document.querySelectorAll('.list');
            for (let i = 0; i < list.length; i++) {
                list[i].addEventListener('click', accordion);
            }
            function accordion(e) {
                e.stopPropagation();
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else if (this.parentElement.parentElement.classList.contains('active')) {
                    this.classList.add('active');
                }else{
                    for (let i = 0; i < list.length; i++) {
                        list[i].classList.remove('active');
                    }
                    this.classList.add('active');
                }
            }
                                      
                                
        }
            
         
        
     
        $scope.findCourseTrades = function(){
            $.misShowLoader();
            if($scope.courseId !=undefined){
                $scope.moneyTypeArr = ($scope.courseId ).join(",");
            }
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                find:$scope.keyword ||"",
                /** 科目id,多个逗号拼接 eg:1,2,3 */
                courseId:$scope.moneyTypeArr ||"",
                /** 科目名称 */
                courseName:$scope.courseName ||"",
                /** 添加结束时间 */
                eTime:$scope.eTime ||"",
                /** 添加开始时间 */
                sTime:$scope.sTime ||"",
                /** 车牌号 */
                plateNum:$scope.plateNum ||"",
                /** 报销人账号 */
                uname:$scope.uname ||"",
                /** 凭证号 */
                voucherNum:$scope.voucherNum ||"",

            } 
            financeService.findCourseTrades(requestParams).then(function(res){
                console.log(res)
                $scope.result = res.data;
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||12;
                }
            },function () {
                $scope.model.error = true;
            }).finally(function () {
                $.misHideLoader();
                $scope.model.empty = $scope.result === null || $scope.result.data === null || $scope.result.data.length === 0;
            });
        };

        $scope.searchKey = function(){
            params.keyword = $scope.keyword ||'';
            $scope.findCourseTrades();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
            {name: 'voucherNum', displayName: '日期',minWidth: 100, enablePinning: false},
            {name: 'voucherNum', displayName: '凭证字号',minWidth: 100, enablePinning: false},
            {name: 'cardName', displayName: '科目',minWidth: 100, enablePinning: false},
            {name: 'cardNo', displayName: '摘要',minWidth: 100, enablePinning: false},
            {name: 'isOpen', displayName: '借方',minWidth: 100, enablePinning: false},
            {name: 'addTime', displayName: '贷方',minWidth: 100, enablePinning: false},
            {name: 'operNote', displayName: '方向',minWidth: 100, enablePinning: false},
            {name: 'operNote', displayName: '余额',minWidth: 100, enablePinning: false},
        ];

        ($scope.init = function(){
            $scope.findCourseTrades();
            $scope.findCourses();
        })();
    }])