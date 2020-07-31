'use strict';

systemCenterModule.controller('customerListController', [
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

        $scope.findCustomType = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                eTime:$scope.eTime ||"",
                sTime:$scope.sTime ||"",
                typeName:$scope.typeNameFind ||""
                // unitNum:userMsg.unitNu
            } 
            systemCenterService.findCustomType(requestParams).then(function(res){
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
            $scope.findCustomType();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
            {name: 'typeName', displayName: '金额类型名称',minWidth: 100, enablePinning: false},
        ];

        $scope.addCustomer = function(){
            $scope.isSupplier = '1';
            $scope.addCustomerShow = true;
        }
        // 添加确认
        $scope.saveConAddfirm = function(){
            let requestParams = {
                isSupplier:$scope.isSupplier,
                typeName:$scope.typeName,
                updId:""
            }
            systemCenterService.adupCusType(requestParams).then(function(res){
                if (res.data.code === 1) {
                    $.misMsg(res.data.msg);
                    $state.reload();
                }else{
                    $.misMsg(res.data.msg)
                }
            })
        }

        $scope.editCustomer = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length ===0){
                $.misMsg("请选择需要修改的数据！");
            }else{
                 //查询
                 let requestParams = {
                    id:selectedRows[0].entity.id
                }
                systemCenterService.cusTypeFindById(requestParams).then(function(res){
                    console.log(res)
                    if(res.data.code===1){
                        $scope.editCustomerShow = true;
                        let result = res.data.data;
                        /** 类型名称 */
                        $scope.typeNameX  = result.typeName;
                        $scope.isSupplierX = (result.isSupplier).toString()
                    }
                })
            }
        }
         // 修改确认
         $scope.saveConEditfirm = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            let requestParams = {
                isSupplier:$scope.isSupplierX,
                typeName:$scope.typeNameX,
                updId:selectedRows[0].entity.id
            }
            systemCenterService.adupCusType(requestParams).then(function(res){
                if (res.data.code === 1) {
                    $.misMsg(res.data.msg);
                    $state.reload();
                }else{
                    $.misMsg(res.data.msg)
                }
            })
        }

        // 删除
        $scope.deleteCustomer = function(){
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
                    systemCenterService.delCusType(requestParams).then(function(res){
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
        // 取消
        $scope.closeAddCustomerCheck = function(){
            $scope.addCustomerShow = false;
        };
        $scope.closeEditCustomerCheck = function(){
            $scope.editCustomerShow = false;
        };
        ($scope.init = function(){
            $scope.findCustomType();
        })();
    }])