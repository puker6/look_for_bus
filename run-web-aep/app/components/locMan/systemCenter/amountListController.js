'use strict';

systemCenterModule.controller('amountListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','systemCenterService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,systemCenterService,) {

        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        // console.log(userMsg)
        // 日期选择
        $.datetimepicker.setLocale('ch');
        $('#sTime,#eTime').datetimepicker({
            format: "Y-m-d",      //格式化日期
            timepicker: false,    //打开时间选项
            todayButton: true,
            step: 1,  //时间间隔为1  分钟
        });
        $scope.keyword = params.keyword ||'';
        $scope.gridOptions = {
            enableGridMenu: true, 
            rowHeight: 42, 
            enableColumnResizing: true,
            enableVerticalScrollbar : 0,
            enableHorizontalScrollbar:2,
            multiSelect:false,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };

        $scope.findMoneyType = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                eTime:$scope.eTime ||"",
                sTime:$scope.sTime ||"",
                typeName:$scope.typeName ||""
                // unitNum:userMsg.unitNu
            } 
            systemCenterService.findMoneyType(requestParams).then(function(res){
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
            $scope.findMoneyType();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
            {name: 'typeName', displayName: '金额类型名称',minWidth: 100, enablePinning: false},
        ];

        // 增加或者修改
        $scope.compileAmount = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // console.log(selectedRows);
            // console.log(v)
            if(v==='add'){
                $state.go("aep.loc.amount_compile",{flag:v,amountId:''})
            }else{
                if(selectedRows.length ===0){
                    $.misMsg("请选择需要修改的数据！");
                }else{
                    $state.go("aep.loc.amount_compile",{flag:v,amountId:selectedRows[0].entity.id})
                }
                
            }
        }
        // 删除
        $scope.deleteAmount = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // let dataList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择需要删除的数据！");
            }else{
                let info = {
                    title:"提示信息",
                    content:"是否确定删除所选客户 ？ "
                }
                $.misConfirm(info,function(){
                    let requestParams = {
                        delId:selectedRows[0].entity.id
                    }
                    systemCenterService.delMtype(requestParams).then(function(res){
                        if (res.data.code === 1) {
                            $.misMsg(res.data.msg);
                            $state.reload();
                        }else{
                            $.misMsg(res.data.msg)
                        }
                    })
                })
            }
        };
        ($scope.init = function(){
            $scope.findMoneyType();
        })();
    }])