'use strict';

financeModule.controller('bankManageController', [
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
        // 是否启用
        $scope.isOpenArr = [
            {id:'0',name:'未启用'},
            {id:'1',name:'已启用'},
        ]; 
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };

        // 获取我的银行
        $scope.findBanks = function(){
            let requestParams = {
                isOpen: '',
            } 
            financeService.findBanks(requestParams).then(function(res){
                if(res.data.code ===1){
                    let result = res.data.banks;
                    $scope.myBankList = result ;
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                    console.log($scope.myBankList)
                }
            })
        };
        $scope.findBankList = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                find:$scope.keyword ||"",

            } 
            financeService.findBankList(requestParams).then(function(res){
                console.log(res)
                $scope.result = res.data;
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||12;
                    angular.forEach($scope.gridOptions.data, function(item){
                        angular.forEach($scope.isOpenArr, function(data){
                            if((data.id).toString()===(item.isOpen).toString())item.isOpen = data.name;
                        });
                    });
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
            $scope.findBankList();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
            {name: 'bankName', displayName: '账户名称',minWidth: 100, enablePinning: false},
            {name: 'cardName', displayName: '开户行',minWidth: 100, enablePinning: false},
            {name: 'cardNo', displayName: '卡号/微信/支付宝手机号',minWidth: 100, enablePinning: false},
            {name: 'isOpen', displayName: '状态',minWidth: 100, enablePinning: false},
            {name: 'addTime', displayName: '设置时间',minWidth: 100, enablePinning: false},
            {name: 'operNote', displayName: '操作备注',minWidth: 100, enablePinning: false},
        ];

        // 增加或者修改
        $scope.compileBankManage = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // console.log(selectedRows);
            // console.log(v)
            if(v==='add'){
                $state.go("aep.loc.bank_manage_compile",{flag:v,bankManageId:''})
            }else{
                if(selectedRows.length ===0){
                    $.misMsg("请选择需要修改的数据！");
                }else if(selectedRows.length > 1){
                    $.misMsg("请选择一条需要修改的数据！");
                }else{
                    let requestParams = {
                        id:selectedRows[0].entity.id
                    }
                    financeService.isAllowModify(requestParams).then(function(res){
                        if (res.data.code === 1) {
                            $state.go("aep.loc.bank_manage_compile",{flag:v,bankManageId:selectedRows[0].entity.id})
                        }else{
                            $.misMsg(res.data.msg)
                        }
                    })
                }
                
            }
        };
        // 删除
        $scope.deleteBankManage = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            let dataList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择需要删除的数据！");
            }else{
                let info = {
                    title:"提示信息",
                    content:"是否确定删除所选银行 ？ "
                }
                $.misConfirm(info,function(){
                    let requestParams = {
                        id:selectedRows[0].entity.id
                    }
                    financeService.isAllowModify(requestParams).then(function(res){
                        if (res.data.code === 1) {
                            let requestParams = {
                                delId:selectedRows[0].entity.id
                            }
                            financeService.delBank(requestParams).then(function(res){
                                if (res.data.code === 1) {
                                    $.misMsg(res.data.msg);
                                    $state.reload();
                                }else{
                                    $.misMsg(res.data.msg)
                                }
                            })
                        }else{
                            $.misMsg(res.data.msg)
                        }
                    })
                    // 多条删除
                    // angular.forEach(selectedRows,function(data){
                    //     dataList.push(data.entity.id)
                    // })
                    // $scope.delectIds = dataList.join(",")
                })
            }
        };

        // 启用银行账
        $scope.openBankManage = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            console.log(selectedRows)
            let openList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择需要启用的银行！");
            }else{
                let pd = true;
                angular.forEach(selectedRows,function(data){
                    if(data.entity.isOpen == '已启用'){
                        $.misMsg("含已启用数据");
                        pd = false;
                    }else{
                        openList.push(data.entity.id)
                    }
                })
                if(pd){
                    $scope.openIds = openList.join(",");
                    console.log($scope.openIds)
                    let info = {
                    title:"提示信息",
                    content:"是否确定启用银行 ？ "
                    }
                    $.misConfirm(info,function(){
                        let requestParams = {
                            openAccount:$scope.openIds
                        }
                        financeService.openBankAccount(requestParams).then(function(res){
                            if (res.data.code === 1) {
                                $.misMsg(res.data.msg);
                                $state.reload();
                            }else{
                                $.misMsg(res.data.msg)
                            }
                        })
                    })
                }
            }
        };



        ($scope.init = function(){
            $scope.findBankList();
            $scope.findBanks();
        })();
    }])