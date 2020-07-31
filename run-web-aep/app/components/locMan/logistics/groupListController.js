'use strict';

logisticsModule.controller('groupListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','logisticsService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,logisticsService,) {

        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        // console.log(userMsg)
        
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

        $scope.groupListFind = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                find:$scope.keyword ||"",
                // unitNum:userMsg.unitNu
            } 
            logisticsService.groupListFind(requestParams).then(function(res){
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
            $scope.groupListFind();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
            {name: 'groupName', displayName: '小组名称',minWidth: 100, enablePinning: false},
            {name: 'linkName', displayName: '联系人姓名',minWidth: 100, enablePinning: false},
            {name: 'linkPhone', displayName: '联系人电话',minWidth: 100, enablePinning: false},
        ];

        // 增加或者修改
        $scope.compilegroup = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // console.log(selectedRows);
            // console.log(v)
            if(v==='add'){
                $state.go("aep.loc.group_compile",{flag:v,groupId:''})
            }else{
                if(selectedRows.length ===0){
                    $.misMsg("请选择需要修改的数据！");
                }else{
                    $state.go("aep.loc.group_compile",{flag:v,groupId:selectedRows[0].entity.id})
                }
                
            }
        }
        // 删除
        $scope.deletegroup = function(){
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
                        id:selectedRows[0].entity.id
                    }
                    logisticsService.groupDelete(requestParams).then(function(res){
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
            $scope.groupListFind();
        })();
    }])