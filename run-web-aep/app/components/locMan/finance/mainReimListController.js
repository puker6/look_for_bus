'use strict';

financeModule.controller('mainReimListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService','logisticsService','officeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService,logisticsService,officeService) {
        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        //日期选择
        $('#sTime,#eTime').datetimepicker({
            format: "Y-m-d H:i:s",      //格式化日期
            timepicker: true,    //打开时间选项
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
            multiSelect:true,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
        // 审核状态
        $scope.isCheckArr = [
            {id:'0',name:'未锁定'},
            {id:'1',name:'已锁定'},
        ]; 
        // 收支状态
        $scope.feeStatusArr = [
            {id:'0',name:'收入'},
            {id:'1',name:'支出'},
        ]; 
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };


    //      // 获取我的银行
    //      $scope.findBankList = function(){
    //         let requestParams = {
    //             page: 1,
    //             rows: 12,
    //         } 
    //         financeService.findBankList(requestParams).then(function(res){
    //             let myBankList = res.data.data;
    //             $scope.myBankListHx = myBankList;
    //         })
    //    };

       // 获取车牌号
       $scope.getAllPlateNum = function(){
        let requestParams = {
            status: '0,1,2,3',
        } 
        financeService.getAllPlateNum(requestParams).then(function(res){
            console.log(res)
            if(res.data.code===1){
                $(function (){
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                });
                $scope.carNumberList = res.data.plateNums;
                console.log(res.data);
            }
        })
    };
    // 获取员工列表
    $scope.getServiceManList = function(){
        let requestParams = {
            staffState: "NORMAL,TRY,LEAVE"
        }
        officeService.getServiceManList(requestParams).then(function(res){
            console.log(res)
            if(res.data.code===1){
                // 查看图片
                $scope.photoShow = function(v){
                    $("#"+v.id).viewer();
                    console.log($("#"+v.id))
                }
                $(function (){
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                });
                let arr = res.data.data
                $scope.employeeListAll = arr;
                console.log($scope.employeeListAll)
            }
        })
    };

        $scope.findReimList1 = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                // find:$scope.keyword ||"",
                /** 科目名称 */
                courseName:$scope.courseName ||"",
                /** 添加结束时间 */
                eTime:$scope.eTime ||"",
                /** 审核状态 */
                isCheck:$scope.isCheck ||"",
                /** 银行名称 */
                myBank:$scope.myBank ||"",
                /** "操作编号 */
                operMark:$scope.operMark ||"",
                /** 开支 */
                reimIsCar:$scope.reimIsCar ||"",
                /** 凭证金额 */
                reimMoney:$scope.reimMoney ||"",
                /** 车牌号 */
                reimPlateNum:$scope.reimPlateNum||"",
                /** 摘要 */
                reimZy:$scope.reimZy ||"",
                /** 添加开始时间 */
                sTime:$scope.sTime ||"",
                /** 状态 */
                status:$scope.status ||"",
                /** 报销人账号 */
                uname:$scope.uname ||"",
                /** 凭证编号 */
                vouNum:$scope.vouNum ||"",

            } 
            financeService.findReimList(requestParams).then(function(res){
                $scope.result = res.data;
                /** 累计收入 */
                $scope.totalGath = $scope.result.totalGath;
                /** 累计支出 */
                $scope.totalPay = $scope.result.totalPay;
                /** 余额  */
                $scope.balance = $scope.result.balance;
                /** 打单费 */
                $scope.singleFee = $scope.result.singleFee;
                /** 洗车费 */
                $scope.washingFee = $scope.result.washingFee;
                /** 停车费 */
                $scope.parkingFee = $scope.result.parkingFee;
                /** 过路费 */
                $scope.roadFee = $scope.result.roadFee;
                /** 生活费 */
                $scope.livingFee = $scope.result.livingFee;
                /** 其他费 */
                $scope.otherFee = $scope.result.otherFee;
                /** 买水 */
                $scope.waterFee = $scope.result.waterFee;
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||12;
                    angular.forEach($scope.gridOptions.data, function(item){
                        angular.forEach($scope.isCheckArr, function(data){
                            if((data.id).toString()===(item.isCheck).toString())item.isCheck = data.name;
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
            $scope.findReimList1();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
            {name: 'voucherNum', displayName: '凭证号码',minWidth: 100, enablePinning: false},
            // {name: 'courseTrades.feeCourseId.courseName', displayName: '科目名称',minWidth: 100, enablePinning: false},
            {name: 'remark', displayName: '摘要',minWidth: 100, enablePinning: false},
            {name: 'gainTime', displayName: '记账时间',minWidth: 100, enablePinning: false},
            {name: 'addTime', displayName: '添加时间',minWidth: 100, enablePinning: false},
            {name: 'isCheck', displayName: '审核状态',minWidth: 100, enablePinning: false},
            {name: 'totalMoney', displayName: '总金额',minWidth: 100, enablePinning: false},
            // {name: 'deptId', displayName: '业务部门',minWidth: 100, enablePinning: false},
            // {name: 'feeStatus', displayName: '收入',minWidth: 100, enablePinning: false},
            {name: 'transferInfo', displayName: '对方户名/对方账号',minWidth: 100, enablePinning: false},
            {name: 'plateNum', displayName: '车牌号',minWidth: 100, enablePinning: false},
            {name: 'myBankInfo', displayName: '我的银行户名/我的银行账号',minWidth: 100, enablePinning: false},
            // {name: 'refuseReason', displayName: '驳回原因',minWidth: 100, enablePinning: false},
            // {name: 'verificationMoney', displayName: '已核销金额',minWidth: 100, enablePinning: false},
            // {name: 'carOrderReim', displayName: '子订单引用',minWidth: 100, enablePinning: false},
            // {name: 'mainOrderReim', displayName: '主订单引用',minWidth: 100, enablePinning: false},
            {name: 'reqsrc', displayName: '数据来源',minWidth: 100, enablePinning: false},
            // {name: 'reimUserId.realName', displayName: '报销人',minWidth: 100, enablePinning: false},
            {name: 'operMark', displayName: '标识号',minWidth: 100, enablePinning: false},
            {name: 'operNote', displayName: '操作备注',minWidth: 100, enablePinning: false},
            
        ];


        // 增加或者修改
        $scope.compileReimList = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(v==='add'){
                $state.go("aep.loc.main_reim_compile",{flag:v,mainReimId:''})
            }else{
                if(selectedRows.length > 1){
                    $.misMsg("请选择一条需要修改的数据！");
                }else if(selectedRows.length ===0 ){
                    $.misMsg("请选择需要修改的数据！");
                }else if(selectedRows[0].entity.isCheck !== '未锁定'){
                    $.misMsg("请选择未锁定的数据！");
                }else{
                    $state.go("aep.loc.main_reim_compile",{flag:v,mainReimId:selectedRows[0].entity.id})
                }
                
            }
        };


        // 核销
        // $scope.HxReim = function(){
        //     let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
        //     if(selectedRows.length ===0){
        //         $.misMsg("请选择需要核销的数据！");
        //     }else if(selectedRows.length ===1){
        //         if(selectedRows[0].entity.isCheck == "已核销"){
        //             $.misMsg("已核销的数据不能再次核销！");
        //         }else{
        //             $scope.cancelShow=true;
        //             $scope.findBankList();
        //             $scope.moneyHx = selectedRows[0].entity.totalMoney;
        //             $scope.idsHx = selectedRows[0].entity.id;
        //         }
        //     }else if(selectedRows.length > 1){
        //            let idsList =[];
        //            let moneyList =[];
        //            let fg = true;
        //            angular.forEach(selectedRows, function(data){
        //                 if(data.entity.isCheck == "已核销"){
        //                     $.misMsg("已核销的数据不能再次核销！");
        //                     fg = false;
        //                     return false;
        //                 }else{
        //                     fg = true;
        //                 }
        //            });
        //            if(fg){
        //             $scope.cancelShow=true;
        //             $scope.findBankList();
        //             angular.forEach(selectedRows, function(data){
        //                 idsList.push(data.entity.id)
        //             });
        //             $scope.idsHx = idsList.join(",");
        //             angular.forEach(selectedRows, function(data){
        //                 moneyList.push(data.entity.totalMoney)
        //             });

        //             $scope.moneyHx = moneyList.reduce((total, num) => { return total + num });
        //            }

        //     }
        // }
        // $scope.HXSure = function(){
        //     if($scope.transNameHx == undefined || $scope.transNunberHx == undefined){
        //         $.misMsg("对方银行信息不能为空");
        //     }else{
        //         let requestParams = {
        //             ids:$scope.idsHx,
        //             money:$scope.moneyHx,
        //             myBankInfo:$scope.myBankHx,
        //             note:$scope.noteHx || '',
        //             transInfo:$scope.transNameHx+'/'+$scope.transNunberHx
        //         }
        //         financeService.confirmReim(requestParams).then(function(res){
        //             if (res.data.code === 1) {
        //                 $.misMsg(res.data.msg);
        //                 $scope.cancelShow=false;
        //                 $state.reload();
        //             }else{
        //                 $.misMsg(res.data.msg);
        //                 $scope.cancelShow=false;
        //             }
        //         })
        //     }
        // }



        // 锁定/解锁
        $scope.operCheck = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // 锁定
            if(v === 1){
                if(selectedRows.length ===0){
                    $.misMsg("请选择需要锁定的数据！");
                }else{
                    let listIdArr =[];
                    var fg = true;
                    angular.forEach(selectedRows, function(data){
                        if(data.entity.isCheck == "已锁定"){
                            $.misMsg("已锁定的数据不能重复锁定！");
                            fg = false;
                        }else{
                            listIdArr.push(data.entity.id);
                        }
                    });
                    if(fg){
                        $scope.ids = listIdArr.join(",");
                        let info = {
                            title:"提示信息",
                            content:"是否确定锁定这条数据 ？"
                        }
                        $.misConfirm(info,function(){
                            let requestParams = {
                                id:$scope.ids,
                                check:1
                            }
                            financeService.operCheckReim(requestParams).then(function(res){
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
            }else if(v=== 0){
                // 解锁
                if(selectedRows.length ===0){
                    $.misMsg("请选择需要锁定的数据！");
                }else{
                    let listIdArr =[];
                    var eq = true;
                    angular.forEach(selectedRows, function(data){
                        if(data.entity.isCheck != "已锁定"){
                            $.misMsg("只能解锁已锁定的数据！");
                            eq = false;
                        }else{
                            listIdArr.push(data.entity.id);
                        }
                    });
                    if(eq){
                        let idJ = listIdArr.join(",");
                        let info = {
                            title:"提示信息",
                            content:"是否确定解锁这条数据 ？"
                        }
                        $.misConfirm(info,function(){
                            let requestParams = {
                                id:idJ,
                                check:0
                            }
                            financeService.operCheckReim(requestParams).then(function(res){
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
            }
        };

        // 删除
        $scope.deleteReim = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // console.log(selectedRows);
            let dataList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择需要撤销的数据！");
            }else{
                let fg = true;
                angular.forEach(selectedRows,function(item){
                    if(item.entity.isCheck != '未锁定'){
                        $.misMsg("请选择未锁定的数据！");
                        fg = false;
                    }else{
                        dataList.push(item.entity.id)
                    }
                })
                if(fg){
                    $scope.deleteIds = dataList.join(",");
                    let info = {
                    title:"提示信息",
                    content:"是否确定撤销所选凭证记录 ？ "
                    }
                    $.misConfirm(info,function(){
                        let requestParams = {
                            delId:$scope.deleteIds,
                        }
                        financeService.delReim(requestParams).then(function(res){
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
        $scope.closeConfirm = function(){
            $scope.cancelShow=false;
        };

        // 预览
        $scope.YlReim = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // console.log(selectedRows);
            if(selectedRows.length ===0){
                $.misMsg("请选择需要预览的数据！");
            }
            // if(selectedRows.length >1){
            //     $.misMsg("目前只支持查看一条数据！");
            // }
            else{
                $scope.YlShow = true;
                $scope.YlDatas = selectedRows;
                console.log($scope.YlDatas);
                angular.forEach($scope.YlDatas,function(item){
                    $scope.courseDatas = item.entity.courseTrades;
                    
                    console.log($scope.courseDatas)
                })
            }
        }

        // 取消预览
        $scope.closeConfirmYl = function(){
            $scope.YlShow = false;
        }
        // 搜索框是否显示
        $scope.moreSearchAction = function(){
            $scope.searchFlagShow = !$scope.searchFlagShow;
        };
        ($scope.init = function(){
            $scope.findReimList1();
            // $scope.findBankList();
            $scope.getAllPlateNum();
            $scope.getServiceManList();
        })();
    }])