'use strict';

businessModule.controller('clientListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','businessService','modalOwnerService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,businessService,modalOwnerService) {
        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.keyword = params.keyword ||'';
        $scope.unitName = params.unitName ||'';
        $scope.serviceMan = params.serviceMan ||'';
        $scope.recomMan = params.recomMan ||'';
        // $scope.ownerPersonArr = [];
        $scope.clientTypeList = [
            {id:'TRAVEL',name:'旅行社'},
            {id:'OILSTATION',name:'加油站'},
            {id:'REPAIR',name:'维修厂'},
            // {id:'FLEET',name:'业务车队'},
            {id:'PARTUNIT',name:'合作单位'},
            {id:'SCHOOL',name:'学校'},
            {id:'COMPANY',name:'公司'},
            {id:'GOVERNMENT',name:'政府'},
            {id:'PERSONAL',name:'个人'},
            {id:'OTHER',name:'其他'},
        ];
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

        $scope.init = function(){
            $scope.getClientList();
        };

        $scope.getClientList = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                find:$scope.keyword ||"",
                // unitName:"",
                unitNum:userMsg.company.unitNum,
                unitName:$scope.unitName||'',
                serviceMan:$scope.serviceMan||'',
                recomMan:$scope.recomMan||'',
            }
            businessService.getClientList(requestParams).then(function(res){
                $scope.result = res.data;
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||12;
                    angular.forEach($scope.gridOptions.data, function(item){
                        angular.forEach($scope.clientTypeList, function(data){
                            if(data.id===item.cusType)item.cusTypeName = data.name;
                        })
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
            $scope.getClientList();
            params.unitName = $scope.unitName ||'';
            params.serviceMan = $scope.serviceMan ||'';
            params.recomMan = $scope.recomMan ||'';
            params.keyword = $scope.keyword ||'';
        };
        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };
        $scope.gridOptions.columnDefs = [
            {name: 'baseUserId.realName', displayName: '客户姓名',minWidth: 120, enablePinning: false},
            {name: 'baseUserId.phone', displayName: '客户电话',minWidth: 120, enablePinning: false},
            {name: 'unitName', displayName: '公司名称',minWidth: 150, enablePinning: false},
            {name: 'cusTypeName', displayName: '公司类型',minWidth: 140, enablePinning: false},
            {name: 'serviceMan', displayName: '业务员',minWidth: 120, enablePinning: false},
            {name: 'recomMan', displayName: '推荐人',minWidth: 120, enablePinning: false},             
            {name: 'addTime', displayName: '添加时间',minWidth: 150, enablePinning: false},
        ];
        
        $scope.compileClient = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(v==='add'){
                $state.go("aep.loc.client_compile",{flag:v,clientId:''})
            }else{
                if(selectedRows.length ===0){
                    $.misMsg("请选择需要修改的数据！");
                }else{
                    $state.go("aep.loc.client_compile",{flag:v,clientId:selectedRows[0].entity.id})
                }
            }
        };
        $scope.deleteClient = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            let dataList = [];
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
                    businessService.deleteClientMsg(requestParams).then(function(res){
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
        $scope.businessOwner = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            let dataList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择客户数据！");
            }else{
                $scope.dialogShow=true;
                $scope.companyName = selectedRows[0].entity.unitName;
                $scope.ownerClientId = selectedRows[0].entity.id;
                $scope.ownerPersonArr = selectedRows[0].entity.personInCharge||[];
                if($scope.ownerPersonArr.length===0){
                    $scope.ownerName = selectedRows[0].entity.baseUserId.realName;
                    $scope.ownerPhone = selectedRows[0].entity.baseUserId.phone;
                }else{
                    $scope.ownerName = "";
                    $scope.ownerPhone = "";
                }
            }
        };
        $scope.addPerson = function(){
            if($scope.ownerName===''||$scope.ownerName===null||$scope.ownerName===undefined||$scope.ownerPhone===''||$scope.ownerPhone===null||$scope.ownerPhone===undefined){
                $.misMsg("信息填写不完整！");
            }else{
                let personMsg = {
                    companyName: $scope.companyName,
                    name: $scope.ownerName||"",
                    phone: $scope.ownerPhone||"",
                }
                $scope.ownerPersonArr.push(personMsg)
                $scope.ownerName = "";
                $scope.ownerPhone = "";
            }
        };
        $scope.deleteOwner = function(v){
            for(let i=0;i<$scope.ownerPersonArr.length;i++){
                if(v.name === $scope.ownerPersonArr[i].name){
                    $scope.ownerPersonArr.splice(i, 1);
                }
            }
        };
        $scope.saveConfirm = function(){
            let opts = {
                id: $scope.ownerClientId,
                personInCharge: $scope.ownerPersonArr
            }
            businessService.addPersonInCharge(opts).then(function(res){
                if(res.data.code===1){
                    $.misMsg(res.data.msg);
                    $scope.dialogShow=false;
                    $scope.getClientList();
                }else{
                    $.misMsg(res.data.msg);
                }
            })
            
        };
        $scope.closeConfirm = function(){
            $scope.dialogShow=false;
        };
        $scope.moreSearchAction = function(){
            $scope.searchFlagShow = !$scope.searchFlagShow;
        };
        $scope.init();
    }])