'use strict';

officeModule.controller('employeeListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','officeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,officeService) {
        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
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
        $scope.staffStateArr = [
            {id:'NORMAL',name:'正式'},
            {id:'TRY',name:'试用'},
            {id:'LEAVE',name:'离职'}
        ];
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };
        
        $scope.getEmployeeList = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                find:$scope.keyword ||"",
                unitNum:userMsg.company.unitNum
            }
            officeService.getEmployeeList(requestParams).then(function(res){
                $scope.result = res.data;
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||12;
                    angular.forEach($scope.gridOptions.data, function(item){
                        angular.forEach($scope.staffStateArr, function(data){
                            if(data.id===item.staffState)item.staffStateName = data.name;
                        })
                        if(item.isDriver===1){
                            item.isDriverName = "是";
                        }else{
                            item.isDriverName = "否";
                        }
                    }); 
                }
            },function () {
                $scope.model.error = true;
            }).finally(function () {
                $.misHideLoader();
                $scope.model.empty = $scope.result === null || $scope.result.data === null || $scope.result.data.length === 0;
            });
        };
        $scope.gridOptions.columnDefs = [
            {name: 'baseUserId.realName', displayName: '姓名',minWidth: 120, enablePinning: false},
            {name: 'baseUserId.phone', displayName: '电话',minWidth: 140, enablePinning: false},
            {name: 'isDriverName', displayName: '是否为驾驶员',minWidth: 140, enablePinning: false},
            {name: 'entryCompany.unitName', displayName: '入职公司',minWidth: 150, enablePinning: false},
            {name: 'deptId.name', displayName: '所属部门',minWidth: 140, enablePinning: false},
            {name: 'roleId.name', displayName: '角色',minWidth: 100, enablePinning: false},
            {name: 'entryTime', displayName: '入职时间',minWidth: 150, enablePinning: false},
            {name: 'expireTime', displayName: '合同到期时间',minWidth: 150, enablePinning: false},
            // {name: 'leaveInfo', displayName: '离职信息',minWidth: 200, enablePinning: false},
            {name: 'leaveInfo', displayName: '离职信息',minWidth: 200, enablePinning: false,
                cellTemplate: ` <span class="gridoptions-table-span" tooltip-class="customTooltip" tooltip-placement="auto top" uib-tooltip="{{row.entity.leaveInfo}}">{{row.entity.leaveInfo}}</span>`},
            {name: 'staffStateName', displayName: '入职状态',minWidth: 100, enablePinning: false},
            {name: 'socialUnit', displayName: '社保单位',minWidth: 100, enablePinning: false},
            {name: 'groupId.groupName', displayName: '小组',minWidth: 100, enablePinning: false},
            {name: 'addTime', displayName: '添加时间',minWidth: 150, enablePinning: false},
        ];
        $scope.searchKey = function(){
            params.keyword = $scope.keyword ||'';
            $scope.getEmployeeList();
        };
        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };
        $scope.compileEmployee = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(v==='add'){
                $state.go("aep.loc.employee_compile",{flag:v,employeeId:''})
            }else{
                if(selectedRows.length ===0){
                    $.misMsg("请选择需要修改的数据！");
                }else{
                    $state.go("aep.loc.employee_compile",{flag:v,employeeId:selectedRows[0].entity.id})
                }
            }
        };
        $scope.deleteEmployee = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            let dataList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择需要删除的数据！");
            }else{
                let info = {
                    title:"提示信息",
                    content:"是否确定删除所选员工 ？ "
                }
                $.misConfirm(info,function(){
                    let requestParams = {
                        id:selectedRows[0].entity.id
                    }
                    officeService.deleteEmployeeMsg(requestParams).then(function(res){
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
        $scope.leaveOffice = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length ===0){
                $.misMsg("请选择数据！");
            }else if(selectedRows[0].entity.leaveInfo!==null &&selectedRows[0].entity.leaveInfo!==""){
                $.misMsg("该员工已经离职！");
            }else{
                $scope.leaveOfficeShow = true;
                $scope.leaveId = selectedRows[0].entity.id;
            }
        };
        $scope.saveLeaveDate = function(){
            let resInfo;
            if($scope.leaveRemark===""){
                resInfo = $scope.leaveTime||'';
            }else{
                resInfo = $scope.leaveTime+","+$scope.leaveRemark;
            }
            let requestParams = {
                id:$scope.leaveId,
                leaveInfo:resInfo
            }
            officeService.saveLeaveDate(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.leaveOfficeShow = false;
                    $.misMsg(res.data.msg);
                    $scope.getEmployeeList();
                }else{
                    $.misMsg(res.data.msg); 
                }
            })

        };
        $scope.closeConfirm = function(){
            $scope.leaveOfficeShow = false;
        };
        $.datetimepicker.setLocale('ch');
        $('#leaveTime').datetimepicker({
            format: "Y-m-d",      //格式化日期
            timepicker: false,    //打开时间选项
            todayButton: true,
            // minDate: new Date(),
            //step: 1,  //时间间隔为1  分钟
        });
        ($scope.init = function(){
            $scope.getEmployeeList();
        })();
    }])