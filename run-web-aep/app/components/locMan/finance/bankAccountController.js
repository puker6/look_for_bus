'use strict';

financeModule.controller('bankAccountController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService','officeService','businessService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService,officeService,businessService) {
        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        
        //日期选择
        $.datetimepicker.setLocale('ch');
        $('#sTime,#eTime,#gainTime').datetimepicker({
            format: "Y-m-d",      //格式化日期
            timepicker: false,    //打开时间选项
            todayButton: true,
            // step: 1,  //时间间隔为1  分钟
        });
        // function computeTime(v){
        //     laydate.render({
        //         elem: '#chartEndDate',
        //         min:$scope.chartStartDate,
        //         done: function(value, date, endDate){
        //             $scope.chartEndDate = value ||"";
        //             $scope.chartEndTime = $scope.chartEndDate+" "+$scope.chartEndTimestamp;
        //             computeTime('end')
        //         },
        //     });
        //     let startDay,endDay;
        //     if($scope.chartStartTime !==''&&$scope.chartStartTime!==null&&$scope.chartStartTime!==undefined&&$scope.chartEndTime !==''&&$scope.chartEndTime!==null&&$scope.chartEndTime!==undefined){
        //         if($scope.chartStartTime > $scope.chartEndTime){
        //             $.misMsg("出发时间不能大于返程时间！")
        //         }else{
        //             if($scope.chartStartTime!==null &&$scope.chartStartTime!==undefined&&$scope.chartStartTime!==''){
        //                 startDay = Date.parse(new Date($scope.chartStartTime.substring(0,10)));
        //             }
        //             if($scope.chartEndTime!==null &&$scope.chartEndTime!==undefined&&$scope.chartEndTime!==''){
        //                 endDay = Date.parse(new Date($scope.chartEndTime.substring(0,10)));
        //             }
        //             if(v !=='days'&&$scope.chartStartTime!==null &&$scope.chartStartTime!==undefined&&$scope.chartStartTime!==''
        //             &&$scope.chartEndTime!==null &&$scope.chartEndTime!==undefined&&$scope.chartEndTime!==''){
        //                 $scope.chartDays = getNumberOfDays(startDay,endDay);
        //                 $scope.daysArr = getEveryDays($scope.chartStartTime.substring(0,10),$scope.chartEndTime.substring(0,10));
        //                 $scope.daysListArr = [];
        //                 for(let i in $scope.daysArr){
        //                     let num = Number(i)+Number(1);
        //                     let info = {
        //                         name:'第'+num+'天',
        //                         day:$scope.daysArr[i],
        //                         type:'',
        //                         scenicListMsg:'',
        //                         addressMsg:[],
        //                         curDayFlag:num
        //                     }
        //                     $scope.daysListArr.push(info);
        //                 }
        //             }
        //         }
        //     }
        //     $scope.$apply();
        // };
        // let todayDate = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
        // laydate.render({
        //     elem: '#sTime',
        //     min:todayDate,
        //     done: function(value, date, endDate){
        //         $scope.chartStartDate = value ||"";
        //         $scope.chartStartTime = $scope.chartStartDate+" "+$scope.chartStartTimestamp;
        //         computeTime('start')
        //     },
        // });

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
                // $scope.transTreeData($scope.feeCourseList);
                // console.log( $scope.feeCourseList);
            })
        };

        // 获取科目列表一级和二级
        $scope.findCoursesAddCourse = function(){
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:900000,
                find:$scope.keyword ||"",
                /** 科目类别 */
                courseCategory:$scope.courseCategory ||"",
                /** 使用状态 */
                courseStatus:$scope.courseStatus ||"",
                /** 收支状态 */
                courseType:$scope.courseType ||"",
                /** 添加开始时间 */
                sTime:$scope.sTime ||"",
                /** 添加结束时间 */
                eTime:$scope.eTime ||""
            } 
            financeService.findFeeCourses(requestParams).then(function(res){
                $(function (){
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                });
                $scope.feeCourseListAddCourse =  res.data.data.filter(ele => ele.level !='3');
                console.log($scope.feeCourseListAddCourse);
            })
        };

        // 获取金额类型
        $scope.findMtypes = function(){
            financeService.findMtypes().then(function(res){
                $(function (){
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                });
                $scope.findMtypesList = res.data.mTypes;
                console.log($scope.findMtypesList)
                // $scope.transTreeData($scope.feeCourseList);
                // console.log( $scope.feeCourseList);
            })
        };

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
                    let arr = res.data.plateNums;
                    $scope.carNumberList = arr.filter(ele => ele.status !=='3');
                    console.log(res.data);
                }
            })
        };

        // 获取我的银行
        $scope.findBanks = function(){
            let requestParams = {
                isOpen: '1',
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

        // 客户列表
        $scope.companyCusCombo = function(){
            let requestParams = {
                cusTypeId:""
            }
            officeService.companyCusCombo(requestParams).then(function(res){
                console.log(res)
                if(res.data.code===1){
                    $scope.clientList = res.data.data;
                    console.log($scope.clientList)
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                }
            });
        };
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
        // 报销状态
        $scope.isCheckArr = [
            // {id:'-2',name:'已锁定'},
            {id:'-1',name:'已报销完成'},
            {id:'0',name:'未操作'},
            {id:'1',name:'待审核'},
            {id:'2',name:'已关联'},
        ]; 
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };

        //===============检验搜索框 start ==============
        // 交易金额
        $scope.$watch('findMoney',  function(newValue, oldValue) {
            if(newValue == undefined){
                // console.log(334456789)
            }else{
                if(!(/^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/.test($scope.findMoney))){
                    $scope.findMoney = oldValue;
                    console.log($scope.findMoney)
                    $.misMsg("请正确输入查询内容！");
                    return false;
                }
            }
        });
        // 操作编号
        $scope.$watch('operMark',  function(newValue, oldValue) {
            if(newValue == undefined){
                // console.log(334456789)
            }else{
                if(!(/^[0-9a-zA-Z]*$/.test($scope.operMark))){
                    $scope.operMark = oldValue;
                    console.log($scope.operMark)
                    $.misMsg("请正确输入查询内容！");
                    return false;
                }
            }
        });
        // 凭证
        $scope.$watch('voucherNum',  function(newValue, oldValue) {
            if(newValue == undefined){
                // console.log(334456789)
            }else{
                if(!(/^[0-9a-zA-Z]*$/.test($scope.voucherNum))){
                    $scope.voucherNum = oldValue;
                    console.log($scope.voucherNum)
                    $.misMsg("请正确输入查询内容！");
                    return false;
                }
            }
        });
        //===============检验搜索框 end ==============

        $scope.findBankTradeList = function(){
            $.misShowLoader();
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
                bankNo:$scope.myBankHzS ||"",
                /** 客户名称 */
                cusName:$scope.cusName ||"",
                /** 开始时间 */
                sTime:$scope.sTime ||"",
                /** 结束时间 */
                eTime:$scope.eTime ||"",
                /** 交易金额 */
                findMoney:$scope.findMoney ||"",
                /** 报销状态 */
                isCheck:$scope.isCheck ||"",
                /** 金额类型 */
                moneyType:$scope.moneyTypeArr ||"",
                /** 开放查询角色 */
                openRole:$scope.openRole ||"",
                /** 是否开放查询 */
                openSel:$scope.openSel ||"",
                /** 操作编号 */
                operMark:$scope.operMark ||"",
                /** 摘要 */
                remark:$scope.remark ||"",
                /** 业务员名字 */
                serviceName:$scope.serviceNameArr ||"",
                /** 收支情况 */
                status:$scope.status ||"",
                /** 时间查询类型 */
                timeType:$scope.timeType ||"",
                /** 对方户名 */
                transName:$scope.transName ||"",
                /** 凭证号 */
                voucherNum:$scope.voucherNum ||"",
            } 
            financeService.findBankTradeList(requestParams).then(function(res){
                $scope.result = res.data;
                console.log($scope.result)
                /** 累计收入 */
                $scope.totalGath = $scope.result.totalGath;
                /** 累计支出 */
                $scope.totalPay = $scope.result.totalPay;
                /** 余额  */
                $scope.balanceHead = $scope.result.balance;
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
                        // 待审核金额
                        if(item.checkMoney === 0){
                            item.checkMoney = '';
                        }
                        // 余额
                        if(item.balance ===0){
                            item.balance = '';
                        }
                        // 金额类型
                        angular.forEach($scope.findMtypesList, function(res){
                            // console.log(res)
                            if(res.id===item.moneyTypeId.id)item.moneyTypeId.id = res.typeName;
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
            params.keyword = $scope.keyword ||'';
            $scope.findBankTradeList();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
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

        // 增加或者修改
        $scope.compileBankAccount = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(v==='add'){
                $state.go("aep.loc.bank_account_compile",{flag:v,bankAccountId:''})
            }else{
                if(selectedRows.length > 1){
                    $.misMsg("请选择一条需要修改的数据！");
                }else if(selectedRows.length ===0 ){
                    $.misMsg("请选择需要修改的数据！");
                }else if(selectedRows[0].entity.isCheck != "未操作"){
                    $.misMsg("只能选择未操作的数据修改！");
                }else{
                    $state.go("aep.loc.bank_account_compile",{flag:v,bankAccountId:selectedRows[0].entity.id})
                }
                
            }
        };

        // 删除
        $scope.deleteBankAccount = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length ===0){
                $.misMsg("请选择需要删除的数据！");
            }else{
                let fg = true;
                let delIdArr = [];
                angular.forEach(selectedRows,function(item){
                    if(item.entity.isCheck == "待审核" || item.entity.isCheck == "已报销完成"){
                        $.misMsg("只允许删除 未操作 状态的数据！");
                        fg = false;
                    }else{
                        delIdArr.push(item.entity.id);
                    }
                })
                if(fg){
                    $scope.delIdArrs = delIdArr.join(",");
                    let info = {
                        title:"提示信息",
                        content:"是否确定删除所选数据 ？ "
                    }
                    $.misConfirm(info,function(){
                        let requestParams = {
                            delId:selectedRows[0].entity.id,
                            myBankNum:selectedRows[0].entity.myBankNum
                        }
                        financeService.delBtl(requestParams).then(function(res){
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

        // 父级数组, 子级数组
        let prows = [];
        let crows = [];
        // 获取数据
        $scope.getCreateReimCourse = function(courseNamesAdd, t, pid,numberMoney){
            console.log(numberMoney)
            // 检测科目是否存在
            let requestParams = {
                courseNames: courseNamesAdd
            }
            financeService.getCreateReimCourse(requestParams).then(function(res){
                if (res.data.code === 1) {
                    console.log(res)
                    if(res.data.data == ""){
                        $.misMsg("科目不存在请先添加");
                    }else{
                        $scope.checkYesShow = true;

                        let obj = {};
                        for(let j = 0; j < prows.length; j++){
                            if(prows[j].id === pid){
                                obj = prows[j];
                                break;
                            }
                        }

                        if(t === 1){
                            angular.forEach(res.data.data,function(data){
                                if(data.courseName === "应收账款"){
                                    let crow1 = {
                                        pid: pid,
                                        remark: '',
                                        feeConurse: data.id+'',
                                        incomeMoney: 0,
                                        payMoney: numberMoney
                                    };
                                    obj.clist.push(crow1);
                                    crows.push(crow1)
                                }
                            })
                        }else if(t === 2){
                            angular.forEach(res.data.data,function(data){
                                if(data.courseName === "预收账款"){
                                    let crow1 = {
                                        pid: pid,
                                        remark: '',
                                        feeConurse: data.id+'',
                                        incomeMoney: 0,
                                        payMoney: numberMoney
                                    };
                                    obj.clist.push(crow1);
                                    crows.push(crow1)
                                }
                            })
                        }else if(t === 3){
                            let moneyY = numberMoney.split("/")[0];
                            let moneyP = numberMoney.split("/")[1];
                            angular.forEach(res.data.data,function(data){
                                if(data.courseName === "预收账款"){
                                    let crow1 = {
                                        pid: pid,
                                        remark: '',
                                        feeConurse: data.id+'',
                                        incomeMoney: 0,
                                        payMoney: moneyY
                                    };
                                    obj.clist.push(crow1);
                                    crows.push(crow1)
                                }
                                if(data.courseName === "应收账款"){
                                    let crow1 = {
                                        pid: pid,
                                        remark: '',
                                        feeConurse: data.id+'',
                                        incomeMoney: 0,
                                        payMoney:moneyP
                                    };
                                    obj.clist.push(crow1);
                                    crows.push(crow1)
                                }
                            })
                            // angular.forEach(res.data.data,function(data){
                            //     if(data.courseName === "应收账款"){
                            //         let crow1 = {
                            //             pid: pid,
                            //             remark: '',
                            //             feeConurse: data.id+'',
                            //             incomeMoney: 0,
                            //             payMoney:numberMoneyP
                            //         };
                            //         obj.clist.push(crow1);
                            //     }
                            // })
                        }

                        // $scope.addReimListArr = crows;
                        // console.log($scope.addReimListArr);
                    }
                }else{
                    $.misMsg(res.data.msg)
                }
            });
        };

        // 银行账审核
        $scope.checkBankAccount = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            console.log(selectedRows)
            if(v === 1){
                if(selectedRows.length === 0){
                    $.misMsg("请选择需要审核的数据！");
                }else {
                    // 获取基础数据
                    $scope.findCourses();
                    $scope.getAllPlateNum();

                    // 清理一下
                    prows = [], crows = [];

                    // 循环获取数据
                    for(let i = 0; i < selectedRows.length; i++){
                        let obj = selectedRows[i].entity;// 遍历的当前对象

                        // 父级数据项, 子级数组项
                        let prow = {};

                        // 目前只判断了状态
                        let eq = true;
                        if(obj.isCheck !== "待审核"){
                            $.misMsg("请选择待审核的数据！");
                            eq = false;
                            break;// 有一条不符合条件，则跳出循环
                        }

                        if(eq){
                            // id
                            prow.id = obj.id;
                            // 摘要
                            prow.remark = obj.remark;
                            // 科目
                            prow.feeCourse = '';
                            // 借方金额
                            prow.jieMoneyTotle = obj.tradeInMoney == '' ? 0 : obj.tradeInMoney;
                            // 贷方金额
                            prow.tradeOutMoney = obj.tradeOutMoney == '' ? 0 : obj.tradeOutMoney;
                            // 子级列表
                            prow.clist = [];
                            prows.push(prow);

    
                            // 生成对方科目数组
                            let orderMoneyArr = obj.downOrderAndMoney.split(",");
                            console.log(orderMoneyArr);
    
                            // 获取订单总金额
                            let orderMoneyTotleNum = 0;
                            angular.forEach(orderMoneyArr, function(item){
                                orderMoneyTotleNum += Number(item.split("=")[1]);
                            });
                            console.log(orderMoneyTotleNum);
    
                            // 关联订单总金额等于银行账金额 或 订单总金额大于 银行账金额  每个银行账自动生成一条 科目为 应收账款的记录
                            if(obj.downOrders && obj.balance == orderMoneyTotleNum || obj.balance < orderMoneyTotleNum){
                                console.log("关联订单总金额等于银行账金额 或 订单总金额大于 银行账金额");
                                // let numberMoneyP = orderMoneyTotleNum;
                                $scope.getCreateReimCourse("应收账款", 1, obj.id,orderMoneyTotleNum);
                            }else if(obj.downOrders == ""){
                                // 未关联订单 每个银行账自动生成一条科目为 预收账款的记录
                                console.log("未关联订单")
                                // let numberMoneyY = obj.tradeInMoney; //预收款金额
                                $scope.getCreateReimCourse("预收账款", 2, obj.id,obj.tradeInMoney);
                            }else if(obj.downOrders && obj.balance > orderMoneyTotleNum){
                                // 关联订单总金额小于银行账金额 每个银行账自动生成一条科目为 应收账款和预收账款的记录
                                console.log("关联订单总金额小于银行账金额")
                                let numberMoneyY = Number(obj.tradeInMoney)-Number(orderMoneyTotleNum); //预收款金额
                                let numberMoneyP = orderMoneyTotleNum;
                                $scope.getCreateReimCourse("应收账款,预收账款", 3, obj.id,numberMoneyY+"/"+numberMoneyP);
                            }
                        }
                    }

                    // 所选择的数据
                    $scope.dataListsC = prows;
                    console.log($scope.dataListsC);
                }
            }else if(v=== 0){
                console.log("审核不通过")
                if(selectedRows.length ===0){
                    $.misMsg("请选择需要审核的数据！");
                }else{
                    var eqN = true;
                    let checkIdArr = [];
                    let checkArr = [];
                    for(var i=0; i<selectedRows.length; i++){
                        checkArr.push((selectedRows[i].entity.isCheck));
                        checkIdArr.push(selectedRows[i].entity.id);
                    }
                    for(var j=0; j<checkArr.length;j++){
                        if(checkArr[j] != "待审核"){
                            $.misMsg("请选择待审核的数据！");
                            eqN = false;
                            break;
                        }else{
                            eqN = true;
                        }
                    }
                    if(eqN){
                        console.log(checkIdArr.join(","))
                        $scope.checkNoIds = checkIdArr.join(",");
                        let info = {
                            title:"提示信息",
                            content:"是否确定审核这条数据 ？"
                        }
                        $.misConfirm(info,function(){
                            let requestParams = {
                                btlId:$scope.checkNoIds,
                            }
                            financeService.checkNoBtl(requestParams).then(function(res){
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

        $scope.addItem = function(){
            let info = {
                modal:{
                    remark:'',
                    feeCourse:'',
                    incomeMoney:'0',
                    payMoney:'0'
                }
            }
            $scope.addReimListArr.push(info)
            $(function (){
                $('.selectpicker').selectpicker('refresh');
                $('.selectpicker').selectpicker('render');
            });
            console.log($scope.addReimListArr)
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
            console.log($scope.addReimListArr)
        };

        // $scope.setFocus = function(){
        //     angular.forEach($scope.addReimListArr,function(data){
        //         if(data.modal.incomeMoney ==0){
        //             data.modal.incomeMoney == '';
        //         }
        //     });
        // }

        // 计算
        $scope.jsJie = function(){
            let money1 = [];
            angular.forEach($scope.dataLists,function(data){
                money1.push(data.entity.tradeInMoney)
            });
            let jieMonenyDfList = [];
            console.log(jieMonenyDfList)
            angular.forEach($scope.addReimListArr,function(data){
                jieMonenyDfList.push(data.modal.incomeMoney)
            });
            $scope.jieMoneyTotle = Number((jieMonenyDfList).map(Number).reduce((total, num) => { return total + num })) + Number(money1.reduce((total, num) => { return total + num })) ; 
        }

        $scope.daiJie = function(){
            let money2 = [];
            angular.forEach($scope.dataLists,function(data){
                money2.push(data.entity.tradeOutMoney)
            });
            let daiMonenyDfList2 = [];
            angular.forEach($scope.addReimListArr,function(data){
                daiMonenyDfList2.push(data.modal.payMoney)
            });
            $scope.daiMoneyTotle = Number((daiMonenyDfList2).map(Number).reduce((total, num) => { return total + num })) + Number(money2.reduce((total, num) => { return total + num })) ;
        }

        // 审核通过
        $scope.saveCheckYes = function(){
            var fg = true;
            var fd = true;
            if(fg == true){
                if($scope.jieMoneyTotle != $scope.daiMoneyTotle ){
                    $.misMsg("借贷账不平")
                }else{
                /** 报账id */
                let bzIdList = [];
                angular.forEach($scope.dataListsC,function(data){
                        bzIdList.push(data.id)
                });
                /** $scope.createInfo合并 */
                let hList = [];
                hList=bzIdList.map((e,i)=>{return [e+'='+$scope.feeCourseMy[i]]});
                $scope.createInfo = hList.join("@");
                /** $scope.faceCourseInfo合并 */
                let faceCourseList = []; 
                console.log($scope.addReimListArr)
                for(var i=0;i<crows.length;i++){
                    faceCourseList.push((crows)[i].feeConurse+'='+(crows)[i].remark+'='+(crows)[i].incomeMoney+'='+(crows)[i].payMoney)
                }
                // for(var i=0;i<$scope.addReimListArr.length;i++){
                //     if(!(/^\d+$|^\d+[.]?\d+$/.test(($scope.addReimListArr)[i].modal.incomeMoney)) || !(/^\d+$|^\d+[.]?\d+$/.test(($scope.addReimListArr)[i].modal.payMoney))){
                //         $.misMsg("金额必须是数字");
                //         fd = false;
                //         break;
                //     }else if(($scope.addReimListArr)[i].modal.incomeMoney == 0 && ($scope.addReimListArr)[i].modal.feeCourse == '' && ($scope.addReimListArr)[i].modal.remark == '' && ($scope.addReimListArr)[i].modal.payMoney == 0){
                //         $scope.addReimListArr.splice($scope.addReimListArr.length, i);
                //     }else{
                //         faceCourseList.push(($scope.addReimListArr)[i].modal.feeCourse+'='+($scope.addReimListArr)[i].modal.remark+'='+($scope.addReimListArr)[i].modal.incomeMoney+'='+($scope.addReimListArr)[i].modal.payMoney)
                //         fd = true;
                //     }
                // }
                if(fd){
                    $scope.faceCourseInfo  = faceCourseList.join("@");
                    let requestParams = {
                        createInfo:$scope.createInfo,
                        faceCourseInfo:$scope.faceCourseInfo
                    }
                    console.log(requestParams)
                    financeService.checkYesBtl(requestParams).then(function(res){
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
        };

        $scope.closeCheckYes = function(){
            $scope.checkYesShow = false;
        };

        // 开放查询
        $scope.languageTypes = [
            {value: '0/@超级管理员', name: '超级管理员'},
            {value: '1/@财务总监', name: '财务总监'},
            {value: '2/@总会计', name: '总会计'},
            {value: '3/@出纳', name: '出纳'},
            {value: '4/@计调部主管', name: '计调部主管'},
            {value: '5/@计调', name: '计调'},
            {value: '6/@后勤总务', name: '后勤总务'},
            {value: '7/@人事专员', name: '人事专员'},

            {value: '8/@机务', name: '机务'},
            {value: '9/@车队队长', name: '车队队长'},
            {value: '10/@会计', name: '会计'},
            {value: '11/@超级管理员副', name: '超级管理员副'},
            {value: '12/@业务总监', name: '业务总监'},
            {value: '13/@销售部负责人', name: '销售部负责人'},
            {value: '14/@客户经理', name: '客户经理'},
            {value: '15/@报账员', name: '报账员'}
        ];

        $scope.queryBankAccount = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length > 1){
                $.misMsg("请选择一条开放查询数据！");
            }else if(selectedRows.length ===0){
                $.misMsg("请选择开放查询数据！");
            }else{
                $scope.openCheckShow=true;
                $scope.openBtlId = selectedRows[0].entity.id;
            }
        };

        $scope.saveConfirm = function(){
            let role =$scope.languageTypes.filter(i => i.checked).map(j => j.value);
            let letopenRole = role.join(",")
            let opts = {
                openBtlId: $scope.openBtlId,
                openRole: letopenRole
            }
            financeService.openSelBtl(opts).then(function(res){
                if(res.data.code===1){
                    $.misMsg(res.data.msg);
                    $scope.openCheckShow=false;
                }else{
                    $.misMsg(res.data.msg);
                }
            })
            
        };
        
        $scope.closeopenCheck = function(){
            $scope.openCheckShow=false;
        };

        // 银行账互转
        $scope.bankHz = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length != 2){
                $.misMsg("请选择两条需要互转的数据！");
            }else{
                //  收入
                let tradeInMoney = selectedRows[0].entity.tradeInMoney;
                let tradeInMoney1 = selectedRows[1].entity.tradeInMoney;
                // 支出
                let tradeOutMoney = selectedRows[0].entity.tradeOutMoney;
                let tradeOutMoney1 = selectedRows[1].entity.tradeOutMoney;
                if(tradeInMoney !='' && tradeInMoney1 !='' || tradeOutMoney !='' && tradeOutMoney1 !=''){
                    $.misMsg("请选择一条支出和一条收入！");
                }else if(selectedRows[0].entity.isCheck != "未操作" ||selectedRows[1].entity.isCheck != "未操作"){
                    $.misMsg("只能选择未操作的数据进行互转！");
                }else if(selectedRows[0].entity.isCheck == "已锁定" ||selectedRows[1].entity.isCheck == "已锁定"){
                    $.misMsg("该账单已被锁定，不允许操作！");
                }else{
                    let info = {
                        title:"提示信息",
                        content:"是否确定这两条银行账互转 ？ "
                    }
                    $.misConfirm(info,function(){
                        let id1 = selectedRows[0].entity.id;
                        let id2 = selectedRows[1].entity.id;
                        let requestParams = {
                            transId:id1+','+id2,
                            voucherNumber:selectedRows[0].entity.voucherNumber
                        }
                        // console.log(requestParams);
                        financeService.transEachOther(requestParams).then(function(res){
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

        // 银行结账(关联报销)
        // $scope.bankGl = function(){
        //     let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
        //     if(selectedRows.length > 1){
        //         $.misMsg("请选择一条银行数据！");
        //     }else if(selectedRows.length ===0){
        //         $.misMsg("请选择银行数据！");
        //     }else if(selectedRows[0].entity.isCheck != "未操作"){
        //         $.misMsg("请选择未操作的数据！");
        //     }else if(selectedRows[0].entity.isCheck == "已锁定"){
        //         $.misMsg("该账单已被锁定，不允许操作！");
        //     }else{
        //         let bankMoney = Number(selectedRows[0].entity.tradeInMoney) + Number(selectedRows[0].entity.tradeOutMoney);
        //         // console.log(bankMoney)
        //         let voucherNumberBank = selectedRows[0].entity.id.voucherNumber
        //         $state.go("aep.loc.reim_list_select",{reimListId:selectedRows[0].entity.id,bankMoney:bankMoney,voucherNumberBank:voucherNumberBank})
        //     }
            
        // }

        // 获取员工列表
        $scope.getServiceManList = function(){
            let requestParams = {
                staffState: "NORMAL,TRY"
            }
            officeService.getServiceManList(requestParams).then(function(res){
                console.log(res)
                if(res.data.code===1){
                    $scope.employeeList = res.data.data;
                    console.log($scope.employeeList)
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                }
            })
        };
        // 下账
        $scope.bankXz = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // console.log(selectedRows)
            if(selectedRows.length > 1){
                $.misMsg("请选择一条银行数据！");
            }else if(selectedRows.length ===0){
                $.misMsg("请选择银行数据！");
            }else if(selectedRows[0].entity.isCheck != "未操作"){
                $.misMsg("请选择未操作的数据！");
            }else{
                let tradeInMoney =selectedRows[0].entity.tradeInMoney
                if(tradeInMoney == ''){
                    $.misMsg("请选择一条收入银行账记录下账！");
                }else{
                    $scope.bankXzShow = true;
                    $scope.getServiceManList();
                    $scope.companyCusCombo();
                    $scope.idXZ = selectedRows[0].entity.id;
                    $scope.money = selectedRows[0].entity.tradeInMoney; // 下账金额
                    $scope.remarkXZ = selectedRows[0].entity.remark;

                }
            }

        }
        // 根据选择的客户得到订单
        $scope.selectBankXz = function(){
            $scope.lookPayShow = true;
            $scope.customer = ($scope.peopleKh.split("/"))[1];
            let requestParams = {
                /** 车辆是否自营  */
                businessType:"",
                /** 时间顺序  */
                compositor:"DESC",
                /** 客户（用车方）  */
                customer:$scope.customer || "",
                /** 驾驶员uname  */
                driver:"",
                /** 用车方负责人  */
                dutyService:"",
                /** 结束时间  */
                endTime:"",
                /** 订单号  */
                orderNum:"",
                /** 页数  */
                page :1,
                /** 订单支付状态  */
                // payStatus:"UNPAID",
                payStatus:"",
                /** 车牌号  */
                plateNum:"",
                /** 行程详情  */
                routeDetail:"",
                /** 每页记录数  */
                rows:50000,
                /** 业务员  */
                serviceMan:"",
                /** 开始时间  */
                startTime:"",
                /** 搜索时间类型 */
                timeType:""

            }
            financeService.getMainCarOrderForCollection(requestParams).then(function(res){
                if (res.data.code === 1) {
                    $scope.listSk = res.data.data;
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                    console.log($scope.listSk);
                }else{
                    $.misMsg(res.data.msg)
                }
            })
        }
        $scope.checkedSubOrderArr = [];
        $scope.yy = [];
        $scope.checkedBoxChanged = function(obj){
            if(obj){
                if(obj.checked){
                    $scope.checkedSubOrderArr.push(obj);//记录此条数据

                    // let sum = 0;
                    // for(let i=0;i<$scope.checkedSubOrderArr.length;i++){
                    //   sum += $scope.checkedSubOrderArr[i].price;
                    //   if(sum > money){
                    //       $.misMsg("订单金额不能大于下账金额");
                    //      break;
                    //   }else{
                    //     $scope.yy.push($scope.checkedSubOrderArr[i].orderNum+'='+$scope.checkedSubOrderArr[i].price);
                    //   }
                    // }
                }else{
                    for(let s=0;s< $scope.checkedSubOrderArr.length;s++){
                        if(obj.id = $scope.checkedSubOrderArr[s].id){
                            $scope.checkedSubOrderArr.splice(s,1);
                        }
                    }
                }

                let sum = 0;
                let lastSum = 0;
                let content = [];
                let money = $scope.money;
                let number = [];
                for(let i=0;i<$scope.checkedSubOrderArr.length;i++){
                    sum += $scope.checkedSubOrderArr[i].price;
                    // console.log(Number(money)-Number(sum))
                    if(sum > money){
                        // console.log(Number(money)-Number(sum));
                        console.log(i);
                        number.push(i);  
                        var latsOrderNum = $scope.checkedSubOrderArr[i].orderNum;
                        var lastMoney = Number(money)-Number(sum);
                        console.log(latsOrderNum)
                        console.log(lastMoney)
                        // content.push($scope.checkedSubOrderArr[i].orderNum+'='+$scope.checkedSubOrderArr[i].price+'='+($scope.checkedSubOrderArr(number[0])).orderNum+'='+($scope.checkedSubOrderArrr(number[0])).lastMoney);
                        $.misMsg("订单金额不能大于下账金额");
                        break;
                    }else{
                        console.log(number)
                        if(latsOrderNum){
                            if($scope.checkedSubOrderArr.length > 1){
                                content.push($scope.checkedSubOrderArr[i].orderNum+'='+$scope.checkedSubOrderArr[i].price+'='+latsOrderNum+'='+lastMoney);
                            }else{
                                content.push(latsOrderNum+'='+lastMoney);
                            }
                        }else{
                            content.push($scope.checkedSubOrderArr[i].orderNum+'='+$scope.checkedSubOrderArr[i].price);
                        }
                        
                    }
                    
                }
                        $scope.downOrderAndMoney = content.join(",");
                        console.log($scope.downOrderAndMoney)
                }else{
                        $scope.downOrderAndMoney = $scope.money;
                }
        }
        // 收款列表
        $scope.paySelectId = function(){
            console.log($scope.checkedSubOrderArr);
            $scope.lookPayShow = false;
        }

        // 下账确认
        $scope.saveConfirmXZ = function(){
            console.log($scope.notice_uname )
            if($scope.notice_uname != undefined && $scope.notice_note == undefined){
                $.misMsg("选择了通知人则通知人备注不能为空")
            }else{
                $scope.khId = ($scope.peopleKh.split("/"))[0];
                if($scope.notice_uname !=undefined){
                    $scope.notice_unameArr = $scope.notice_uname.join(",")
                }
                let requestParams = {
                    /** 下账记录id */
                    btlId:$scope.idXZ,
                    /** 客户id */
                    companyCusId:$scope.khId,
                    /** 科目id */
                    // feeCourseId:$scope.feeCourseId,
                    /** 银行帐金额或者订单总金额 */
                    downOrderAndMoney:$scope.downOrderAndMoney || $scope.money,
                    /** 通知人备注 */
                    notice_note:$scope.notice_note || "",
                    /** 通知人id */
                    notice_uname:$scope.notice_unameArr || "",
                    // /** 下账订单号 */
                    // orderNums:$scope.orderNumXZ || "",
                    // /** 摘要  */
                    // remark:$scope.remarkXZ || "",
                }
                financeService.downBtlMoney(requestParams).then(function(res){
                    if (res.data.code === 1) {
                        $.misMsg(res.data.msg);
                        $state.reload();
                    }else{
                        $.misMsg(res.data.msg)
                    }
                })
            }
        }
        // 关闭下账列表
        $scope.closeConfirmXz = function(){
            $scope.bankXzShow = false;
        }
        // 关闭收款列表
        $scope.closePayConfirm = function(){
            $scope.lookPayShow = false;
        }
        // 上传
        $scope.multipleFileUpload = function(){
            // var form = new FormData();
            // let file = document.getElementById("idCardFrontImg").files[0];
            // form.append('file', file);
            // form.append('userName', userMsg.baseUserId.uname);
            // $scope.btlFile = file.name;
            // officeService.importfeeBtl(form).then(function(res){    //接口调用
            //     console.log(res)
            // })
        };

        // 银行账导入
        $scope.bankDr = function(){
            // console.log($scope.myBankHz)
            let form = new FormData();
            let file = document.getElementById("idCardFrontImg").files[0];
            console.log(file)
            form.append('btlFile', file);
            form.append('tradeBank', $scope.myBankHz);
            if($scope.myBankHz === undefined){
                $.misMsg("请选择我的银行");
            }else if($scope.myBankHz.length>1){
                $.misMsg("请选择一条我的银行进行导入");
            }else if(file === undefined){
                $.misMsg("请选择上传文件");
            }else{
                let info = {
                    title:"提示信息",
                    content:"是否确定导入 ？ "
                }
                $.misConfirm(info,function(){
                    financeService.importfeeBtl(form).then(function(res){    //接口调用
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

        // 银行账导出
        $scope.bankDc = function(){
            let requestParams = {
                /** 银行账户名称 */
                bankNo:$scope.myBankHzS ||"",
                /** 客户名称 */
                cusName:$scope.cusName ||"",
                /** 开始时间 */
                sTime:$scope.sTime ||"",
                /** 结束时间 */
                eTime:$scope.eTime ||"",
                /** 交易金额 */
                findMoney:$scope.findMoney ||"",
                /** 报销状态 */
                isCheck:$scope.isCheck ||"",
                /** 金额类型 */
                moneyType:$scope.moneyTypeArr ||"",
                /** 开放查询角色 */
                openRole:$scope.openRole ||"",
                /** 是否开放查询 */
                openSel:$scope.openSel ||"",
                /** 操作编号 */
                operMark:$scope.operMark ||"",
                /** 摘要 */
                remark:$scope.remark ||"",
                /** 业务员名字 */
                serviceName:$scope.serviceNameArr ||"",
                /** 收支情况 */
                status:$scope.status ||"",
                /** 时间查询类型 */
                timeType:$scope.timeType ||"",
                /** 对方户名 */
                transName:$scope.transName ||"",
                /** 凭证号 */
                voucherNum:$scope.voucherNum ||"",
                rows:$scope.model.totalCount

            } 
            financeService.expBtlBankEx(requestParams).then(function(res){    //接口调用
                if (res.data.code === 1) {
                    // $.misMsg(res.data.msg);
                    // $state.reload();
                    let content = res.data.data; // 文件流
                    console.log(res.data.msg)
                    let blob = new Blob([content]);
                    let fileName = 'filename.xls';
                        if ('download' in document.createElement('a')) {  // 非IE下载
                        let link = document.createElement('a');
                        link.download = fileName;
                        link.style.display = 'none';
                        link.href = URL.createObjectURL(blob);
                        document.body.appendChild(link);
                        link.click();
                        URL.revokeObjectURL(link.href) ; // 释放URL 对象
                        document.body.removeChild(link);
                    } else {  // IE10+下载
                    navigator.msSaveBlob(blob);
                    }
                }else{
                    console.log("11111111")
                    $.misMsg(res.data.msg)
                }
            })
        }


        // 计算
        $scope.jsJieCreate = function(){
            let money1 = [];
            angular.forEach($scope.dataLists,function(data){
                money1.push(data.entity.tradeInMoney)
            });
            let jieMonenyDfList = [];
            console.log(jieMonenyDfList)
            angular.forEach($scope.createReimListArr,function(data){
                jieMonenyDfList.push(data.modal.incomeMoneyS)
            });
            $scope.jieMoneyTotle = Number((jieMonenyDfList).map(Number).reduce((total, num) => { return total + num })) + Number(money1.reduce((total, num) => { return total + num })) ; 
        }

        $scope.daiJieCreate = function(){
            let money2 = [];
            angular.forEach($scope.dataLists,function(data){
                money2.push(data.entity.tradeOutMoney)
            });
            let daiMonenyDfList2 = [];
            angular.forEach($scope.createReimListArr,function(data){
                daiMonenyDfList2.push(data.modal.payMoneyS)
            });
            $scope.daiMoneyTotle = Number((daiMonenyDfList2).map(Number).reduce((total, num) => { return total + num })) + Number(money2.reduce((total, num) => { return total + num })) ;
        }
        // 添加
        $scope.createReimListArr = [
            {
                modal:{
                    // unameS:'',
                    carNumS:'',
                    remarkS:'',
                    feeCourseS:'',
                    incomeMoneyS:'0',
                    payMoneyS:'0'
                }
            }
        ];
        $scope.createItem = function(){
            let info = {
                modal:{
                    // unameS:'',
                    carNumS:'',
                    remarkS:'',
                    feeCourseS:'',
                    incomeMoneyS:'0',
                    payMoneyS:'0'
                }
            }
            $scope.createReimListArr.push(info)
            $(function (){
                $('.selectpicker').selectpicker('refresh');
                $('.selectpicker').selectpicker('render');
            });
            console.log($scope.createReimListArr)
        };
        // 取消
        $scope.cancelSItem = function(index,obj){
            if($scope.createReimListArr.length < 2){
                $.misMsg("至少添加一条对方科目数据平账");
            }else{
                $scope.createReimListArr.splice(index, 1);
                $scope.jsJieCreate();
                $scope.daiJieCreate();
            }
            console.log($scope.createReimListArr)
        };
        // 生成凭证
        $scope.bankPin = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            console.log(selectedRows)
            if(selectedRows.length ===0){
                $.misMsg("请选择未操作的数据！");
            }else if(selectedRows.length === 1){
                if(selectedRows[0].entity.isCheck != "未操作"){
                    $.misMsg("请选择一条未操作的数据！");
                }else if(selectedRows[0].entity.isCheck == "已关联"){
                    $.misMsg("请选择一条未关联的数据！");
                }else{
                    console.log(77777)
                    $scope.createVoucherShow = true;
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                    $scope.dataLists = selectedRows;
                    $scope.findCourses();
                    $scope.getAllPlateNum();
                    $scope.companyCusCombo();
                    
                    if(selectedRows[0].entity.tradeInMoney == ''){
                        $scope.jieMoneyTotle = 0
                    }else{
                        $scope.jieMoneyTotle = selectedRows[0].entity.tradeInMoney;
                    }
                    if(selectedRows[0].entity.tradeOutMoney == ''){
                        $scope.daiMoneyTotle = 0
                    }else{
                        $scope.daiMoneyTotle = selectedRows[0].entity.tradeOutMoney;
                    }
                    
                }
            }else if(selectedRows.length > 1){
                let eq = true;
                let fg = true;
                angular.forEach(selectedRows,function(data){
                    if(data.entity.isCheck != "未操作"){
                        $.misMsg("请选择未操作的数据！");
                        eq = false;
                    }
                })
                angular.forEach(selectedRows,function(data){
                    if(data.entity.isCheck == "已关联"){
                        $.misMsg("请选择未关联的数据！");
                        fg = false;
                    }else{
                        fg = true;
                    }
                })
                if(eq && fg){
                    $scope.createVoucherShow = true;
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                    $scope.getAllPlateNum();
                    $scope.findCourses();
                    $scope.companyCusCombo();
                    $scope.dataLists = selectedRows;
                    let money1 = [];
                    angular.forEach($scope.dataLists,function(data){
                        money1.push(data.entity.tradeInMoney)
                    });
                    $scope.jieMoneyTotle =  money1.reduce((total, num) => { return total + num }); 

                    let money2 = [];
                    angular.forEach($scope.dataLists,function(data){
                        money2.push(data.entity.tradeOutMoney)
                    });
                    $scope.daiMoneyTotle =  money2.reduce((total, num) => { return total + num }); 
                }
            }
        }

        // 生成凭证-确认
        $scope.saveCreateYes = function(){
            var fg = true;
            var fd = true;
            if(fg == true){
                if($scope.jieMoneyTotle != $scope.daiMoneyTotle ){
                    $.misMsg("借贷账不平")
                }else{
                /** 报账id */
                let bzIdList = [];
                angular.forEach($scope.dataLists,function(data){
                        bzIdList.push(data.entity.id)
                });
                // /** 经办人 */
                // let unameJMyList = [];
                // angular.forEach($scope.unameJMy,function(data){
                //     unameJMyList.push(data)
                // });
                /** 车牌号 */
                let carNumMyList = [];
                angular.forEach($scope.carNumMy,function(data){
                    carNumMyList.push(data)
                });
                /** $scope.createInfo合并 */
                let hList = [];
                // hList=unameJMyList.map((e,i)=>{return [e+'='+$scope.unameWMy[i]+'='+$scope.carNumMy[i]+'='+bzIdList[i]+'='+$scope.feeCourseMy[i]]});
                hList=carNumMyList.map((e,i)=>{return [e+'='+bzIdList[i]+'='+$scope.feeCourseMy[i]]});
                $scope.createInfoRemin = hList.join("@");
    
                /** $scope.faceCourseInfo合并 */
                let faceCourseList = []; 
                console.log($scope.createReimListArr)
                for(var i=0;i<$scope.createReimListArr.length;i++){
                    if(!(/^\d+$|^\d+[.]?\d+$/.test(($scope.createReimListArr)[i].modal.incomeMoneyS)) || !(/^\d+$|^\d+[.]?\d+$/.test(($scope.createReimListArr)[i].modal.payMoneyS))){
                        $.misMsg("金额必须是数字");
                        fd = false;
                        break;
                    }else if(($scope.createReimListArr)[i].modal.incomeMoneyS == 0 && ($scope.createReimListArr)[i].modal.feeCourseS == '' && ($scope.createReimListArr)[i].modal.remarkS == '' && ($scope.createReimListArr)[i].modal.payMoneyS == 0){
                        $scope.addReimListArr.splice($scope.addReimListArr.length, i);
                    }else{
                        faceCourseList.push((($scope.createReimListArr)[i].modal.carNumS || "null")+'='+($scope.createReimListArr)[i].modal.feeCourseS+'='+(($scope.createReimListArr)[i].modal.remarkS || "null")+'='+($scope.createReimListArr)[i].modal.incomeMoneyS+'='+($scope.createReimListArr)[i].modal.payMoneyS)
                        fd = true;
                    }
                }
                if(fd){
                    $scope.faceCourseInfo  = faceCourseList.join("@");
                    let requestParams = {
                        createInfo:$scope.createInfoRemin,
                        faceCourseInfo:$scope.faceCourseInfo,
                        /** 往来客户账号 */
                        cusUname: $scope.unameWMy,
                        /** 经办人账号 */
                        jbrUname:$scope.unameJMy,
                        gainTime:$scope.gainTimeCreate,
                    }
                    console.log(requestParams)
                    financeService.createReimBtl(requestParams).then(function(res){
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
        };
        // 添加科目
        $scope.addCourseClick = function(){
            $scope.addCourseShow = true;
            $scope.findCoursesAddCourse();
            $scope.courseStatusAdd = '0';
            $scope.courseTypeAdd = '0';
        };
        // 转化为简称
        $scope.jc = function(){
            if($scope.courseNameMc == undefined){
                $scope.courseNameJc = ''
            }else{
                $scope.courseNameJc = Pinyin.GetJP($scope.courseNameMc);
            }
        }
        // 选择上级科目得到科目类别
        $scope.selectSuperiorCourse = function(){
            let content = $scope.superiorContent;
            console.log(content);
            $scope.courseLb = (content.split("-")[1]).split("/")[0];
            $scope.levelAddCourse = content.split("-")[0];
            $scope.parentid = (content.split("-")[1]).split("/")[1];
        }
        // 确认-增加科目
        $scope.addCourseSure = function(){
            // 检验科目名称是否可用
            let checkParams = {
                /** 科目名称 */
                courseName:$scope.courseLb,
                courseId:null,
                level:parseInt($scope.levelAddCourse)
            }
            financeService.checkCourseName(checkParams).then(function(res){
                if(res.data.code ===1){
                    // 添加-提交
                        // 新增子级科目时根据parentId获取科目已关联记录
                        let checkCherParams = {
                            parentId:$scope.parentid
                        }
                        financeService.findCourseLink(checkCherParams).then(function(res){
                            if(res.data.code ===1){
                                if(res.data.bankIds !=''){
                                   $scope.bankIds = (res.data.bankIds).join(",")
                                }else if(res.data.fctIds !=''){
                                    $scope.fctIds = (res.data.fctIds).join(",")
                                }
                                 // 添加-提交
                                let requestParams = {
                                    /** 科目名称 */
                                    courseName:$scope.courseNameMc,
                                    /** 科目简拼 */
                                    pinyinSimple: $scope.courseNameJc,
                                    /** 科目类别 */
                                    courseCategory: $scope.courseLb,
                                    /** 状态 */
                                    courseStatus: $scope.courseStatusAdd,
                                    /** 收支 */
                                    courseType: $scope.courseTypeAdd,
                                    level:$scope.levelAddCourse,
                                    parentId:$scope.parentid,
                                    /** 父级关联的银行记录id */
                                    bankIds:$scope.bankIds || "",
                                    /** 父级关联的科目交易记录id */
                                    fctIds:$scope.fctIds || ""
                                }
                                financeService.addFeeCourse(requestParams).then(function(res){
                                    if(res.data.code ===1){
                                        $.misMsg(res.data.msg);
                                        $scope.findCourses();
                                        $scope.findCoursesAddCourse();
                                        $scope.courseNameMc = "";
                                        $scope.courseNameJc = "";
                                        $scope.superiorContent = "";
                                        $scope.courseLb = "";
                                        $scope.addCourseShow = false;

                                    }else{
                                        $.misMsg(res.data.msg);
                                    }
                                })
                            }else{
                                $.misMsg(res.data.msg);
                            }
                        })
                }else{
                    $.misMsg(res.data.msg);
                }
            })
        }
        // 生成凭证取消
        $scope.closeCreateNo = function(){
            $scope.createVoucherShow = false;
        }
        // 添加科目取消
        $scope.closeAddCourseConfirm = function(){
            $scope.courseNameMc = "";
            $scope.courseNameJc = "";
            $scope.superiorContent = "";
            $scope.courseLb = "";
            $scope.addCourseShow = false;
        }
        
        // 关联员工报账
        // $scope.bankGl = function(){
        //     $scope.straffLinkShow = true;
        //     let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
        //     console.log(selectedRows)
        //     if(selectedRows.length ===0){
        //         $.misMsg("请选择需要关联的数据！");
        //     }else if(selectedRows.length >1 ){
        //         $.misMsg("请选择一条需要关联的数据！");
        //     }else{
        //         $scope.btlIdLink = selectedRows[0].entity.id;
        //     }
        // }
        // // 确定关联
        // $scope.straffLink = function(){
        //     let selectedRowsLink = $scope.gridApilLink.selection.getSelectedGridRows();
        //     console.log(selectedRowsLink)
        //     if(selectedRowsLink.length ===0){
        //         $.misMsg("请选择需要关联的数据！");
        //     }else{
        //         let idArr = [];
        //         angular.forEach(selectedRowsLink,function(item){
        //             idArr.push(item.entity.id)
        //         })
        //         $scope.staffReimIdsLink = idArr.join(",");
        //         let requestParams = {
        //             btlId:$scope.btlIdLink,
        //             staffReimIds:$scope.staffReimIdsLink
        //         }
        //         console.log(requestParams)
        //         financeService.linkStaffReim(requestParams).then(function(res){
        //             if (res.data.code === 1) {
        //                 // console.log(res)
        //                 $.misMsg(res.data.msg);
        //                 $state.reload();
        //             }else{
        //                 $.misMsg(res.data.msg)
        //             }
        //         })

        //     }
        // }
        // // 审核状态
        // $scope.isCheckArrLink = [
        //     {id:'-1',name:'已驳回'},
        //     {id:'0',name:'未审核'},
        //     {id:'1',name:'已审核'},
        //     {id:'2',name:'已生成凭证'},
        // ]; 
        // $scope.modelLink = {
        //     pageState: $state.current.name,
        //     empty: false,
        //     error: false
        // };
        // $scope.gridOptionslLink = {
        //     enableGridMenu: true, 
        //     rowHeight: 42, 
        //     enableColumnResizing: true,
        //     enableVerticalScrollbar : 0,
        //     enableHorizontalScrollbar:2,
        //     multiSelect:true,
        //     onRegisterApi: function (gridApi) {
        //         $scope.gridApilLink = gridApi;
        //     }
        // };
        // $scope.findStaffReimList = function(){
        //     $.misShowLoader();
        //     let requestParams = {
        //         page:parseInt(params.page) || 1,
        //         rows:parseInt(params.size) || 12,
        //         // find:$scope.keyword ||"",
        //         /** 操作标识 */
        //         operMark:$scope.operMarkLink ||"",
        //         /** 部门 */
        //         deptId:$scope.deptIdLink ||"",
        //         /** 结束时间 */
        //         eTime:$scope.eTimeLink ||"",
        //         /** 审核状态 */
        //         isCheck:$scope.isCheckLink ||"",
        //         /** 报账金额 */
        //         money:$scope.moneyLink ||"",
        //         /** 开支 */
        //         reimIsCar:$scope.reimIsCarLink ||"",
        //         /** 摘要 */
        //         remark:$scope.reimZyLink ||"",
        //         /** 添加开始时间 */
        //         sTime:$scope.sTimeLink ||"",
        //         /** 报销人账号 */
        //         uname:$scope.unameLink ||"",
        //         /** 车牌号 */
        //         plateNum:$scope.plateNumLink ||"",
        //         /** 凭证号  */
        //         voucherNo:$scope.voucherNoLink ||""

        //     } 
        //     financeService.findStaffReimList(requestParams).then(function(res){
        //         $scope.resultlLink = res.data;
        //         if(res.data.code===1){
        //             $scope.gridOptionslLink.data = $scope.resultlLink.data;
        //             $scope.modelLink.totalCount = $scope.resultlLink.count;
        //             $scope.modelLink.totalPage = Math.ceil($scope.resultlLink.count/parseInt(params.size));
        //             $scope.modelLink.pageNo = parseInt(params.page) ||1;
        //             $scope.modelLink.pageSize = parseInt(params.size) ||12;
        //             angular.forEach($scope.gridOptionslLink.data, function(item){
        //                 angular.forEach($scope.isCheckArrLink, function(data){
        //                     if((data.id).toString()===(item.isCheck).toString())item.isCheck = data.name;
        //                 });
        //             });                 
        //         }
        //     },function () {
        //         $scope.modelLink.error = true;
        //     }).finally(function () {
        //         $.misHideLoader();
        //         $scope.modelLink.empty = $scope.resultlLink === null || $scope.resultlLink.data === null || $scope.resultlLink.data.length === 0;
        //     });
        // };
        // $scope.searchKeyLink = function(){
        //     $scope.findStaffReimList();
        // };

        // $scope.gridOptionslLink.columnDefs = [
        //     {name: 'reimUser.realName', displayName: '报销人',minWidth: 100, enablePinning: false},
        //     {name: 'reimVoucherUrl', displayName: '图片',minWidth: 150, enablePinning: false,
        //     cellTemplate: `<img class="handle-click-a photo-style"  ng-if="row.entity.reimVoucherUrl" ng-click="grid.appScope.photoShow(row.entity)" id="{{row.entity.id}}" src="{{row.entity.reimVoucherUrl}}">
        //     <a class="handle-click-a" ng-if="!row.entity.reimVoucherUrl">无</a>`},
        //     {name: 'remark', displayName: '摘要',minWidth: 100, enablePinning: false},
        //     {name: 'voucherNum', displayName: '凭证号',minWidth: 100, enablePinning: false},
        //     {name: 'isCheck', displayName: '审核状态',minWidth: 100, enablePinning: false},
        //     {name: 'payMoney', displayName: '支出金额',minWidth: 100, enablePinning: false},
        //     {name: 'gathMoney', displayName: '收入金额',minWidth: 100, enablePinning: false},
        //     {name: 'addTime', displayName: '订单时间',minWidth: 100, enablePinning: false},
        //     // {name: 'mainOrderReim', displayName: '主订单引用',minWidth: 100, enablePinning: false},
        //     // {name: 'reqsrc', displayName: '数据来源',minWidth: 100, enablePinning: false},
        //     {name: 'operMark', displayName: '标识号',minWidth: 100, enablePinning: false},
        //     {name: 'deptId.name', displayName: '业务部门',minWidth: 100, enablePinning: false},
        //     {name: 'refuseReason', displayName: '驳回原因',minWidth: 100, enablePinning: false},
        //     {name: 'operNote', displayName: '操作备注',minWidth: 100, enablePinning: false},
            
            
        // ];
        // $scope.moreSearchActionLink = function(){
        //     $scope.searchFlagLinkShow = !$scope.searchFlagLinkShow;
        // };
        $scope.moreSearchAction = function(){
            $scope.searchFlagShow = !$scope.searchFlagShow;
        };
        ($scope.init = function(){
            // $scope.companyCusCombo();
            $scope.findBankTradeList();
            $scope.findBanks();
            $scope.getServiceManList();
            $scope.findMtypes();
            // $scope.findStaffReimList();
        })();
    }])