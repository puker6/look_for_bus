'use strict';

financeModule.controller('reimListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService','$interval','officeService','logisticsService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService,$interval,officeService,logisticsService) {
        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        //日期选择
        $('#sTime,#eTime,#gainTime').datetimepicker({
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
            multiSelect:true,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
        // 获取科目列表
        $scope.findCourses = function(){
            let requestParams = {
                tips: 'last',
            } 
            financeService.findCourses(requestParams).then(function(res){
                $(function (){
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                });
                $scope.feeCourseList = res.data.data;
                console.log($scope.feeCourseList);
            })
        };
        // 审核状态
        $scope.isCheckArr = [
            {id:'-1',name:'已驳回'},
            {id:'0',name:'未审核'},
            {id:'1',name:'已审核'},
            {id:'2',name:'已生成凭证'},
        ]; 

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
                    $scope.employeeListAllFilter = arr.filter(ele => ele.staffState !=='LEAVE');
                    console.log($scope.employeeListAll)
                }
            })
        };

        // 获取车牌号
        $scope.getAllPlateNum = function(){
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
                        let arr = res.data.plateNums;
                        $scope.carNumberList = arr.filter(ele => ele.status !=='3');
                        console.log(res.data);
                    }
                })
            };
        };

        //===============检验搜索框 start ==============
        // 交易金额
        $scope.$watch('money',  function(newValue, oldValue) {
            if(newValue == undefined){
                // console.log(334456789)
            }else{
                if(!(/^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/.test($scope.money))){
                    $scope.money= oldValue;
                    console.log($scope.money)
                    $.misMsg("请正确输入查询内容！");
                    return false;
                }
            }
        });
        //===============检验搜索框 end ==============

        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };

        $scope.findStaffReimList = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                // find:$scope.keyword ||"",
                /** 操作标识 */
                operMark:$scope.operMark ||"",
                /** 部门 */
                deptId:$scope.deptId ||"",
                /** 结束时间 */
                eTime:$scope.eTime ||"",
                /** 审核状态 */
                isCheck:$scope.isCheck ||"",
                /** 报账金额 */
                money:$scope.money ||"",
                /** 开支 */
                reimIsCar:$scope.reimIsCar ||"",
                /** 摘要 */
                remark:$scope.reimZy ||"",
                /** 添加开始时间 */
                sTime:$scope.sTime ||"",
                /** 报销人账号 */
                uname:$scope.uname ||"",
                /** 车牌号 */
                plateNum:$scope.plateNum ||"",
                /** 凭证号  */
                voucherNo:$scope.voucherNo ||""

            } 
            financeService.findStaffReimList(requestParams).then(function(res){
                $scope.result = res.data;
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
            $scope.findStaffReimList();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
            {name: 'reimUser.realName', displayName: '报销人',minWidth: 100, enablePinning: false},
            {name: 'reimVoucherUrl', displayName: '图片',minWidth: 150, enablePinning: false,
            cellTemplate: `<img class="handle-click-a photo-style"  ng-if="row.entity.reimVoucherUrl" ng-click="grid.appScope.photoShow(row.entity)" id="{{row.entity.id}}" src="{{row.entity.reimVoucherUrl}}">
            <a class="handle-click-a" ng-if="!row.entity.reimVoucherUrl">无</a>`},
            {name: 'remark', displayName: '摘要',minWidth: 100, enablePinning: false},
            {name: 'voucherNum', displayName: '凭证号',minWidth: 100, enablePinning: false},
            {name: 'isCheck', displayName: '审核状态',minWidth: 100, enablePinning: false},
            {name: 'payMoney', displayName: '支出金额',minWidth: 100, enablePinning: false},
            {name: 'gathMoney', displayName: '收入金额',minWidth: 100, enablePinning: false},
            {name: 'addTime', displayName: '订单时间',minWidth: 100, enablePinning: false},
            // {name: 'mainOrderReim', displayName: '主订单引用',minWidth: 100, enablePinning: false},
            // {name: 'reqsrc', displayName: '数据来源',minWidth: 100, enablePinning: false},
            {name: 'operMark', displayName: '标识号',minWidth: 100, enablePinning: false},
            {name: 'deptId.name', displayName: '业务部门',minWidth: 100, enablePinning: false},
            {name: 'refuseReason', displayName: '驳回原因',minWidth: 100, enablePinning: false},
            {name: 'operNote', displayName: '操作备注',minWidth: 100, enablePinning: false},
            
            
        ];

        // 增加或者修改
        $scope.compileReimList = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(v==='add'){
                $state.go("aep.loc.reim_compile",{flag:v,reimId:''})
            }else{
                if(selectedRows.length > 1){
                    $.misMsg("请选择一条需要修改的数据！");
                }else if(selectedRows.length ===0 ){
                    $.misMsg("请选择需要修改的数据！");
                }else if(selectedRows[0].entity.isCheck == '已生成凭证' ){
                    $.misMsg("请选择未生成凭证的数据！");
                }else{
                    $state.go("aep.loc.reim_compile",{flag:v,reimId:selectedRows[0].entity.id})
                }
                
            }
        };
        // 删除
        $scope.deleteReim = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // console.log(selectedRows);
            let dataList = [];
            if(selectedRows.length ===0){
                $.misMsg("请选择需要删除的数据！");
            }else{
                let fg = true;
                angular.forEach(selectedRows,function(item){
                    if(item.entity.isCheck == '已生成凭证'){
                        $.misMsg("请选择未生成凭证的数据！");
                        fg = false;
                    }else{
                        dataList.push(item.entity.id)
                    }
                })
                if(fg){
                    $scope.deleteIds = dataList.join(",");
                    let info = {
                    title:"提示信息",
                    content:"是否确定删除所选凭证记录 ？ "
                    }
                    $.misConfirm(info,function(){
                        let requestParams = {
                            delIds:$scope.deleteIds,
                        }
                        financeService.delStaffReim(requestParams).then(function(res){
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

        // 审核
        $scope.checkReim = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // console.log(selectedRows)
            if(selectedRows.length ===0){
                $.misMsg("请选择需要审核的数据！");
            }else{
                if(selectedRows.length ===1){
                    if(selectedRows[0].entity.isCheck != '未审核'){
                        $.misMsg("请选择未审核的数据！");
                    }else{
                        $scope.checkShow=true;
                        $scope.ids = selectedRows[0].entity.id;
                        // console.log($scope.ids)
                    }
                }else if(selectedRows.length > 1){
                    let idsCollect = [];
                    let eq = true;
                    angular.forEach(selectedRows,function(item){
                        if(item.entity.isCheck != '未审核'){
                            $.misMsg("请选择未审核的数据！");
                            eq = false;
                        }else{
                            idsCollect.push(item.entity.id)
                        }
                    })
                    if(eq){
                        $scope.checkShow=true;
                        $scope.ids = idsCollect.join(",");
                    }

                    // for(var i=0; i<selectedRows.length; i++){
                    //     listIdArr.push((selectedRows[i].entity.isCheck.split(",")));
                    //     idsCollect.push(selectedRows[i].entity.id)
                    // }
                    // for(var j=0; j<listIdArr.length;j++){
                    //     if(listIdArr[0] != listIdArr[j]){
                    //         $.misMsg("必须是同一个操作号！");
                    //         eq = false;
                    //         break;
                    //     }else{
                    //         eq = true;
                    //     }
                    // }
                    
                }



               
            }
        }
        $scope.shSure = function(){
            // if($scope.alNoticeChoice != undefined  && $scope.note != undefined){
                // let alNoticeChoices = $scope.alNoticeChoice.join(",")
                let requestParams = {
                    alNoticeChoice:"",
                    ids:$scope.ids,
                    note:$scope.note || ""
                }
                console.log( $scope.note)
                financeService.checkStaffReimburse(requestParams).then(function(res){
                    if (res.data.code === 1) {
                        $.misMsg(res.data.msg);
                        $scope.checkShow=false;
                        $state.reload();
                    }else{
                        $.misMsg(res.data.msg);
                        $scope.checkShow=false;
                    }
                })
            // }else{
            //     $.misMsg("请正确填写内容");
            // }
            
        }
        $scope.closeCheckShow = function(){
            $scope.checkShow=false;
        };

        // $scope.checkShow=true;
        //         let idsList =[];
        //         var fg = true;
        //         angular.forEach(selectedRows, function(data){
        //            idsList.push(data.entity.id)
        //         });
        //         $scope.ids = idsList.join(",");

        // 撤销
        $scope.backReim = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length ===0){
                $.misMsg("请选择需要撤销的数据！");
            }else if(selectedRows.length >1){
                $.misMsg("请选择一条需要撤销的数据！");
            }else{
                if(selectedRows[0].entity.isCheck != '已审核'){
                    $.misMsg("请选择需要已审核的数据！");
                }else{
                    let requestParams = {
                        cancelId:selectedRows[0].entity.id
                    }
                    financeService.cancelReim(requestParams).then(function(res){
                        if (res.data.code === 1) {
                            $.misMsg(res.data.msg);
                            $state.reload();
                        }else{
                            $.misMsg(res.data.msg)
                        }
                    })
                }
            }
        }

        // 驳回
        $scope.refuseReim = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length ===0){
                $.misMsg("请选择需要拒绝的数据！");
            }else if(selectedRows.length > 1){
                $.misMsg("请选择一条需要拒绝的数据！");
            }else if(selectedRows[0].entity.isCheck != '未审核'){
                $.misMsg("请选择一条未审核的数据！");
            }else{
                $scope.refuseShow=true;
                $scope.refuseId = selectedRows[0].entity.id;
            }
        }
        $scope.refuseSure = function(){
            let requestParams = {
                rId:$scope.refuseId,
                reason:$scope.reason 
            }
            // console.log(requestParams)
            financeService.checkRefuse(requestParams).then(function(res){
                if (res.data.code === 1) {
                    $.misMsg(res.data.msg);
                    // $scope.refuseShow=false;
                    $state.reload();
                }else{
                    $.misMsg(res.data.msg);
                    $scope.refuseShow=false;
                }
            })
        }
        $scope.refuseCloseConfirm = function(){
            $scope.refuseShow=false;
        };


        // 生成凭证
        $scope.createReim = function(){
            // $scope.createReimShow = true;
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            console.log(selectedRows)
            if(selectedRows.length ===0){
                $.misMsg("请选择需要生成凭证的数据！");
            }else if(selectedRows.length === 1){
                if(selectedRows[0].entity.isCheck != "已审核"){
                    $.misMsg("请选择已审核的数据！");
                }
                // else if(selectedRows[0].entity.bankTradeId == ""){
                //     $.misMsg("请选择已审核的数据！");
                // }
                else{
                    $scope.createReimShow = true;
                    $scope.dataLists = selectedRows;
                    console.log($scope.dataLists)
                    $scope.findCourses();
                    $scope.jieMoneyTotle = selectedRows[0].entity.gathMoney;
                    $scope.daiMoneyTotle = selectedRows[0].entity.payMoney;
                }
            }else if(selectedRows.length > 1){
                let reimUserList = [];
                let operUserList = [];
                let idArr = [];
                let fg = true;
                let sh = true;
                let kh = true;
                // angular.forEach(selectedRows,function(data){
                //     if(data.entity.isCheck != "已审核"){
                //         $.misMsg("请选择已审核的数据！");
                //         eq = false;
                //     }else{
                //         eq = true;
                //     }
                // })

                // 判断是否是同一个经办人
                for(let i=0; i<selectedRows.length; i++){
                    reimUserList.push(selectedRows[i].entity.reimUser.uname);
                    idArr.push(selectedRows[i].entity.id)
                }
                for(let j=0; j<reimUserList.length;j++){
                    if(reimUserList[0] != reimUserList[j]){
                        $.misMsg("必须是同一个经办人！");
                        fg = false;
                        break;
                    }else{ 
                        fg = true;
                    }
                }
                // 判断是否是同一个往来客户
                for(let i=0; i<selectedRows.length; i++){
                    if(selectedRows[i].entity.operUser != null){
                        console.log(selectedRows[i].entity.operUser)
                        operUserList.push(selectedRows[i].entity.operUser.uname);
                    }
                }
                for(let j=0; j<operUserList.length;j++){
                    if(operUserList[0] != operUserList[j]){
                        $.misMsg("必须是同一个往来客户！");
                        kh = false;
                        break;
                    }else{ 
                        kh = true;
                    }
                }
                // 判断是否都是已审核的数据
                for(let i=0; i<selectedRows.length; i++){
                    if(selectedRows[i].entity.isCheck !='已审核'){
                        $.misMsg("请选择已审核的数据！");
                        sh = false;
                        break;
                    }else{
                        sh = true;
                    }
                }
                // for(var i=0; i<selectedRows.length; i++){
                //     listIdArr.push((selectedRows[i].entity.operMark.split(","))[0]);
                // }
                // for(var j=0; j<listIdArr.length;j++){
                //     if(listIdArr[0] != listIdArr[j]){
                //         $.misMsg("必须是同一个操作号！");
                //         fg = false;
                //         break;
                //     }else{ 
                //         fg = true;
                //     }
                // }

                if(kh && fg && sh){
                    $scope.createReimShow = true;
                    $scope.dataLists = selectedRows;
                    let money1 = [];
                    angular.forEach($scope.dataLists,function(data){
                        money1.push(data.entity.gathMoney)
                    });
                    $scope.jieMoneyTotle =  money1.reduce((total, num) => { return total + num }); 

                    let money2 = [];
                    angular.forEach($scope.dataLists,function(data){
                        money2.push(data.entity.payMoney)
                    });
                    $scope.daiMoneyTotle =  money2.reduce((total, num) => { return total + num }); 
                    $scope.findCourses();
                }
              
            }
        }
        $scope.closeCreateShow = function(){
            $scope.createReimShow = false;
        }


        // 添加
        $scope.addReimListArr = [
            {
                modal:{
                    remark:'',
                    feeCourse:'',
                    incomeMoney:'0',
                    payMoney:'0'
                }
            },
            {
                modal:{
                    remark:'',
                    feeCourse:'',
                    incomeMoney:'0',
                    payMoney:'0'
                }
            },
            {
                modal:{
                    remark:'',
                    feeCourse:'',
                    incomeMoney:'0',
                    payMoney:'0'
                }
            },
            {
                modal:{
                    remark:'',
                    feeCourse:'',
                    incomeMoney:'0',
                    payMoney:'0'
                }
            }
            
        ];
        $scope.addItem = function(){
            let info = {
                modal:{
                    remark:'',
                    feeCourse:'',
                    incomeMoney:'0',
                    payMoney:'0'
                }
            }
            $(function (){
                $('.selectpicker').selectpicker('refresh');
                $('.selectpicker').selectpicker('render');
            });
            $scope.addReimListArr.push(info)
            // console.log($scope.addReimListArr)
        };

        // 取消
        $scope.cancelItem = function(index,obj){
            if($scope.addReimListArr.length < 2){
                $.misMsg("至少添加一条对方科目数据平账");
            }else{
                $scope.addReimListArr.splice(index, 1);
                $scope.jsJie();
                $scope.daiJie();
            }
            // console.log($scope.addReimListArr)
        };

        // 计算
        $scope.jsJie = function(){
            let money1 = [];
            angular.forEach($scope.dataLists,function(data){
                money1.push(data.entity.gathMoney)
            });
            let jieMonenyDfList = [];
            // console.log(jieMonenyDfList)
            angular.forEach($scope.addReimListArr,function(data){
                jieMonenyDfList.push(data.modal.incomeMoney)
            });
            $scope.jieMoneyTotle = Number((jieMonenyDfList).map(Number).reduce((total, num) => { return total + num })) + Number(money1.reduce((total, num) => { return total + num })) ; 
        }

        $scope.daiJie = function(){
            let money2 = [];
            angular.forEach($scope.dataLists,function(data){
                money2.push(data.entity.payMoney)
            });
            let daiMonenyDfList2 = [];
            angular.forEach($scope.addReimListArr,function(data){
                daiMonenyDfList2.push(data.modal.payMoney)
            });
            $scope.daiMoneyTotle = Number((daiMonenyDfList2).map(Number).reduce((total, num) => { return total + num })) + Number(money2.reduce((total, num) => { return total + num })) ;
        }
        $scope.createReimSure = function(){
            let fd = true;
            if($scope.jieMoneyTotle != $scope.daiMoneyTotle ){
                $.misMsg("借贷账不平")
                return false;
            }else if($scope.gainTime == undefined){
                $.misMsg("日期不能为空")
                return false;
            }else{
                /** 报账id */
                let bzIdList = [];
                angular.forEach($scope.dataLists,function(data){
                        bzIdList.push(data.entity.id)
                });

                /** $scope.createInfo合并 */
                let hList = [];
                hList=bzIdList.map((e,i)=>{return [e+'='+$scope.feeCourseMy[i]]});
                $scope.createInfo = hList.join("@");

                /** $scope.faceCourseInfo合并 */
                let faceCourseList = []; 
                console.log($scope.addReimListArr)
                
                for(var i=0;i<$scope.addReimListArr.length;i++){
                    if(!(/^\d+$|^\d+[.]?\d+$/.test(($scope.addReimListArr)[i].modal.incomeMoney)) || !(/^\d+$|^\d+[.]?\d+$/.test(($scope.addReimListArr)[i].modal.payMoney))){
                        $.misMsg("金额必须是数字");
                        fd = false;
                        break;
                    }else if(($scope.addReimListArr)[i].modal.incomeMoney ==0 && ($scope.addReimListArr)[i].modal.feeCourse == '' && ($scope.addReimListArr)[i].modal.remark == '' && ($scope.addReimListArr)[i].modal.payMoney == 0){
                        $scope.addReimListArr.splice($scope.addReimListArr.length, i);
                    }else{
                        faceCourseList.push(($scope.addReimListArr)[i].modal.feeCourse+'='+($scope.addReimListArr)[i].modal.remark+'='+($scope.addReimListArr)[i].modal.incomeMoney+'='+($scope.addReimListArr)[i].modal.payMoney)
                        fd = true;
                    }
                }

                if(fd){
                    $scope.faceCourseInfo  = faceCourseList.join("@");
                    console.log($scope.faceCourseInfo);
                    let  requestParams= {
                        createInfo:$scope.createInfo,
                        faceCourseInfo:$scope.faceCourseInfo,
                        gainTime:$scope.gainTime
                    }
                    console.log(requestParams)
                    financeService.createReim(requestParams).then(function(res){
                        if (res.data.code === 1) {
                            $.misMsg(res.data.msg);
                            $state.reload();
                        }else{
                            $.misMsg(res.data.msg)
                        }
                    })
                }
            }
        };


        // 关联银行日记账
        $scope.bankGl = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            console.log(selectedRows)
            if(selectedRows.length ===0){
                $.misMsg("请选择需要关联的数据！");
            }else if(selectedRows.length >1 ){
                $.misMsg("请选择一条需要关联的数据！");
            }else{
                let idArr = [];
                let reimUserList = [];
                let operUserList = [];
                let fg = true;
                let kh = true;
                let sh = true;
                // 判断是否是同一个经办人
                for(let i=0; i<selectedRows.length; i++){
                    reimUserList.push(selectedRows[i].entity.reimUser.uname);
                    idArr.push(selectedRows[i].entity.id)
                }
                for(let j=0; j<reimUserList.length;j++){
                    if(reimUserList[0] != reimUserList[j]){
                        $.misMsg("必须是同一个经办人！");
                        fg = false;
                        break;
                    }else{ 
                        fg = true;
                    }
                }
                // 判断是否是同一个往来客户
                for(let i=0; i<selectedRows.length; i++){
                    if(selectedRows[i].entity.operUser != null){
                        console.log(selectedRows[i].entity.operUser)
                        operUserList.push(selectedRows[i].entity.operUser.uname);
                    }
                }
                for(let j=0; j<operUserList.length;j++){
                    if(operUserList[0] != operUserList[j]){
                        $.misMsg("必须是同一个往来客户！");
                        kh = false;
                        break;
                    }else{ 
                        kh = true;
                    }
                }
                // 判断是否都是已审核的数据
                for(let i=0; i<selectedRows.length; i++){
                    if(selectedRows[i].entity.isCheck !='已审核'){
                        $.misMsg("请选择已审核的数据！");
                        sh = false;
                        break;
                    }else{
                        sh = true;
                    }
                }
                if(fg && kh && sh){
                    $scope.bankLinkShow = true;
                    $scope.findBankTradeList();
                    $scope.staffReimIdsLink = idArr.join(",");
                    $scope.db = idArr;
                    console.log($scope.staffReimIdsLink)
                }
                // angular.forEach(selectedRows,function(item){
                //     if(item.entity.isCheck !='已审核'){
                //         $.misMsg("请选择已审核的数据！");
                //         sh = false;
                //         break
                //     }else{
                //         sh = true;
                //     }
                //     idArr.push(item.entity.id)
                // })
                // $scope.staffReimIdsLink = idArr.join(",");
                // let requestParams = {
                //     btlId:$scope.btlIdLink,
                //     staffReimIds:$scope.staffReimIdsLink
                // }
                // console.log(requestParams)
                // financeService.linkStaffReim(requestParams).then(function(res){
                //     if (res.data.code === 1) {
                //         // console.log(res)
                //         $.misMsg(res.data.msg);
                //         $state.reload();
                //     }else{
                //         $.misMsg(res.data.msg)
                //     }
                // })
                // // $scope.bankLinkShow = true;
                // $scope.findBankTradeList();
                // $scope.btlIdLink = selectedRows[0].entity.id;
            }
        }
        // 确定关联
        $scope.bankLink = function(){
            let selectedRowsLink = $scope.gridApilLink.selection.getSelectedGridRows();
            console.log(selectedRowsLink)
            if(selectedRowsLink.length ===0){
                $.misMsg("请选择需要关联的数据！");
            }else{
                let idArrLink = [];
                angular.forEach(selectedRowsLink,function(item){
                    idArrLink.push(item.entity.id)
                })
                $scope.btlIdLink = idArrLink.join(",");
                
                if($scope.db.length>1 && idArrLink.length>1){
                    console.log($scope.staffReimIdsLink)
                console.log($scope.btlIdLink)
                    $.misMsg("请选择一条银行帐进行关联！");
                }else{
                    let requestParams = {
                        btlIds:$scope.btlIdLink,
                        srIds:$scope.staffReimIdsLink
                    }
                    console.log(requestParams)
                    financeService.linkBankTrade(requestParams).then(function(res){
                        if (res.data.code === 1) {
                            // console.log(res)
                            $.misMsg(res.data.msg);
                            $state.reload();
                        }else{
                            $.misMsg(res.data.msg)
                        }
                    })
                }
            }
        }
        // 报销状态
        $scope.isCheckArrLink = [
            // {id:'-2',name:'已锁定'},
            {id:'-1',name:'已报销完成'},
            {id:'0',name:'未操作'},
            {id:'1',name:'待审核'},
            {id:'2',name:'已关联'},
        ]; 
        $scope.modelLink = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };
        $scope.gridOptionsLink = {
            enableGridMenu: true, 
            rowHeight: 42, 
            enableColumnResizing: true,
            enableVerticalScrollbar : 0,
            enableHorizontalScrollbar:2,
            multiSelect:true,
            onRegisterApi: function (gridApi) {
                $scope.gridApilLink = gridApi;
            }
        };
        $scope.findBankTradeList = function(){
            let myBankHzArr =[]
            if($scope.myBankHz !=undefined){
                angular.forEach($scope.myBankHz,function(item){
                    myBankHzArr.push((item.split("/"))[1])
                })
                $scope.myBankHzS = myBankHzArr.join(",");
                console.log($scope.myBankHzS)
            };
            if($scope.serviceName !=undefined){
                $scope.serviceNameArr = ($scope.serviceName).join(",");
            }
            if($scope.moneyType !=undefined){
                $scope.moneyTypeArr = ($scope.moneyType).join(",");
            }
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 20,
                find:$scope.keyword ||"",
                /** 银行账户名称 */
                bankNo:$scope.myBankHzSLink ||"",
                /** 客户名称 */
                cusName:$scope.cusNameLink ||"",
                /** 开始时间 */
                sTime:$scope.sTimeLink ||"",
                /** 结束时间 */
                eTime:$scope.eTimeLink ||"",
                /** 交易金额 */
                findMoney:$scope.findMoneyLink ||"",
                /** 报销状态 */
                isCheck:$scope.isCheckLink ||"",
                /** 金额类型 */
                moneyType:$scope.moneyTypeArrLink ||"",
                /** 开放查询角色 */
                openRole:$scope.openRoleLink ||"",
                /** 是否开放查询 */
                openSel:$scope.openSelLink ||"",
                /** 操作编号 */
                operMark:$scope.operMarkLink ||"",
                /** 摘要 */
                remark:$scope.remarkLink ||"",
                /** 业务员名字 */
                serviceName:$scope.serviceNameArrLink ||"",
                /** 收支情况 */
                status:$scope.statusLink ||"",
                /** 时间查询类型 */
                timeType:$scope.timeTypeLink ||"",
                /** 对方户名 */
                transName:$scope.transNameLink ||"",
                /** 凭证号 */
                voucherNum:$scope.voucherNumLink ||"",
            } 
            financeService.findBankTradeList(requestParams).then(function(res){
                $scope.resultLink = res.data;
                console.log($scope.resultLink)
                if(res.data.code===1){
                    console.log(res)
                    $scope.gridOptionsLink.data = $scope.resultLink.data;
                    $scope.modelLink.totalCount = $scope.resultLink.count;
                    $scope.modelLink.totalPage = Math.ceil($scope.resultLink.count/parseInt(params.size));
                    $scope.modelLink.pageNo = parseInt(params.page) ||1;
                    $scope.modelLink.pageSize = parseInt(params.size) ||12;
                    angular.forEach($scope.gridOptionsLink.data, function(item){
                        angular.forEach($scope.isCheckArrLink, function(data){
                            if((data.id).toString()===(item.isCheck).toString())item.isCheck = data.name;
                        });
                        // 待审核金额
                        if(item.checkMoney === 0){
                            item.checkMoney = '';
                        }
                        // 余额
                        if(item.balance ===0){
                            item.balance = '';
                        }
                        // 金额类型
                        // angular.forEach($scope.findMtypesList, function(res){
                        //     // console.log(res)
                        //     if(res.id===item.moneyTypeId.id)item.moneyTypeId.id = res.typeName;
                        // })
                    });
                }
            },function () {
                $scope.modelLink.error = true;
            }).finally(function () {
                $.misHideLoader();
                $scope.modelLink.empty = $scope.resultLink === null || $scope.resultLink.data === null || $scope.resultLink.data.length === 0;
            });
        };
        $scope.searchLinkKey = function(){
            $scope.findBankTradeList();
        };

        $scope.gridOptionsLink.columnDefs = [
            {name: 'voucherNumber', displayName: '凭证号',minWidth: 100, enablePinning: false},
            {name: 'tradeTime', displayName: '交易时间',minWidth: 100, enablePinning: false},
            {name: 'myBankName', displayName: '银行名称',minWidth: 100, enablePinning: false},
            {name: 'isCheck', displayName: '报销状态',minWidth: 100,
            cellTemplate: `<div class="white gridoptions-table-span"  ng-if="row.entity.isCheck==='未操作'">
            {{row.entity.isCheck}}
            </div>
            <div class="green gridoptions-table-span"  ng-if="row.entity.isCheck==='待审核'">
            {{row.entity.isCheck}}
            </div>
            <div class="yellow gridoptions-table-span"  ng-if="row.entity.isCheck==='已报销完成'">
            {{row.entity.isCheck}}
            </div>
            `},
            {name: 'moneyTypeId.id', displayName: '金额类型',minWidth: 100, enablePinning: false},
            {name: 'myBankNum', displayName: '我的银行账号',minWidth: 100, enablePinning: false},
            {name: 'cusName', displayName: '客户名称',minWidth: 100, enablePinning: false},
            {name: 'addTime', displayName: '添加时间',minWidth: 100, enablePinning: false},
            {name: 'reimMoney', displayName: '已报销金额',minWidth: 100, enablePinning: false},
            {name: 'transNum', displayName: '对方账号',minWidth: 100, enablePinning: false},
            {name: 'transName', displayName: '对方户名',minWidth: 100, enablePinning: false},
            {name: 'tradeInMoney', displayName: '收入',minWidth: 100, enablePinning: false},
            {name: 'tradeOutMoney', displayName: '支出',minWidth: 100, enablePinning: false},
            {name: 'balance', displayName: '余额',minWidth: 100, enablePinning: false},
            {name: 'checkMoney', displayName: '待审核金额',minWidth: 100, enablePinning: false},
            
            {name: 'openRole', displayName: '开放角色',minWidth: 100, enablePinning: false},
            {name: 'documentNumber', displayName: '单据号码',minWidth: 100, enablePinning: false},
            {name: 'remark', displayName: '摘要',minWidth: 100, enablePinning: false},
            // {name: '', displayName: '科目名称',minWidth: 100, enablePinning: false},
            // {name: '', displayName: '通报人手机号',minWidth: 100, enablePinning: false},
            // {name: '', displayName: '通报内容',minWidth: 100, enablePinning: false},
            {name: 'orderNum', displayName: '下账订单号',minWidth: 100, enablePinning: false},
            // {name: '', displayName: '操作标识号',minWidth: 100, enablePinning: false},
            {name: 'noticeRemark', displayName: '操作备注',minWidth: 100, enablePinning: false},
            
            
        ];
        $scope.moreSearchLinkAction = function(){
            $scope.searchFlagLinkShow = !$scope.searchFlagLinkShow;
        };
        $scope.closeLinkKey = function(){
            $scope.bankLinkShow = false;
        }
        

        // 搜索框是否显示
        $scope.moreSearchAction = function(){
            $scope.searchFlagShow = !$scope.searchFlagShow;
        };
        ($scope.init = function(){
            // $scope.photoShow()
            $(function (){
                $('.selectpicker').selectpicker('refresh');
                $('.selectpicker').selectpicker('render');
            });
            $scope.findStaffReimList();
            $scope.getAllPlateNum();
            $scope.getServiceManList();
        })();
    }])