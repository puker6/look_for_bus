'use strict';

financeModule.controller('collectionListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService','businessService','logisticsService','officeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService,businessService,logisticsService,officeService) {
        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.compositor = "ASC"
        //日期选择
        $.datetimepicker.setLocale('ch');
        $('#startTime,#endTime,#gainTime').datetimepicker({
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
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };

        // 订单业务类型
        $scope.serviceTypeArr = [
            {id:'COUNTY_SER',name:'县际业务'},
            {id:'CITY_SER',name:'市际业务'},
            {id:'PROVINCE_SER',name:'省际业务'},
        ]; 

        // 订单状态
        $scope.payStatusArr = [
            {id:'UNPAID',name:'未付款'},
            {id:'DEPOSIT_PAID',name:'已付定金'},
            {id:'FULL_PAID',name:'全款已付'},
        ];

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
        // 获取员工列表
        $scope.getEmployeeList = function(){
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 400,
                // find:$scope.keyword ||"",
                unitNum:userMsg.company.unitNum
            }
            officeService.getEmployeeList(requestParams).then(function(res){
                if(res.data.code===1){
                    // console.log(res)
                    $scope.employeeList = res.data.data
                }
            })
        };
        $scope.getMainCarOrderForCollection = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
                // find:$scope.keyword ||"",
                /** 车辆是否自营  */
                businessType:$scope.businessType || "",
                /** 时间顺序  */
                compositor:$scope.compositor || "",
                /** 客户（用车方）  */
                customer:$scope.customer || "",
                /** 驾驶员uname  */
                driver:$scope.driver || "",
                /** 用车方负责人  */
                dutyService:$scope.dutyService || "",
                /** 结束时间  */
                endTime:$scope.endTime || "",
                /** 订单号  */
                orderNum:$scope.orderNum || "",
                /** 订单支付状态  */
                payStatus:$scope.payStatus || "",
                /** 车牌号  */
                plateNum:$scope.plateNum || "",
                /** 行程详情  */
                routeDetail:$scope.routeDetail || "",
                /** 业务员  */
                serviceMan:$scope.serviceMan || "",
                /** 开始时间  */
                startTime:$scope.startTime || "",
                /** 搜索时间类型 */
                timeType:$scope.timeType || ""

            } 
            financeService.getMainCarOrderForCollection(requestParams).then(function(res){
                $scope.result = res.data;
                /** 运价总价 */
                $scope.totalPrice = $scope.result.statics.totalPrice;
                /** 已收款 */
                $scope.totalAlGathPrice = $scope.result.statics.totalAlGathPrice;
                /** 应收款  */
                $scope.totalPriceY = Number($scope.totalPrice)-Number($scope.totalAlGathPrice);
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||12;
                    angular.forEach($scope.gridOptions.data, function(item){
                        var plateNumArr=[];
                        var  main_driverArr=[];
                        // let prices = [];
                        // prices.push(Number(item.price) - Number(item.alGathPrice));
                        item['receivableBalance']=Number(item.price) - Number(item.alGathPrice);
                        angular.forEach(item.mainCars, function(data){
                            plateNumArr.push(data.plateNum);
                            // if(data.main_driver !='' || data.main_driver !=null){
                            //     main_driverArr.push(data.main_driver);
                            // }
                        });
                        if(plateNumArr !=[] || main_driverArr !=[]){
                            item.mainCars.plateNum = plateNumArr.join(",");
                            // item.mainCars.main_driver = main_driverArr.join(",");
                            
                        }

                        angular.forEach($scope.serviceTypeArr, function(data){
                            if(data.id===item.serviceType)item.serviceType = data.name;
                        });
                        angular.forEach($scope.payStatusArr, function(data){
                            if(data.id===item.payStatus)item.payStatus = data.name;
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
            $scope.getMainCarOrderForCollection();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.gridOptions.columnDefs = [
            {name: 'mainOrderBase.companyName', displayName: '用车方',minWidth: 100, enablePinning: false},
            {name: 'mainOrderBase.dutyService', displayName: '用车负责人',minWidth: 100, enablePinning: false},
            {name: 'needSeats', displayName: '需求座位',minWidth: 100, enablePinning: false},
            {name: 'mainCars.plateNum', displayName: '车牌号',minWidth: 100, enablePinning: false},
            // {name: '', displayName: '发票',minWidth: 100, enablePinning: false},
            {name: 'remDriverCharge', displayName: '现收',minWidth: 100, enablePinning: false},
            // {name: 'mainCars.main_driver.realName', displayName: '驾驶员',minWidth: 100, enablePinning: false},
            {name: 'stime', displayName: '出发时间',minWidth: 100, enablePinning: false},
            {name: 'etime', displayName: '到达时间',minWidth: 100, enablePinning: false},
            {name: 'routeDetail', displayName: '用车详情',minWidth: 100, enablePinning: false},

            {name: 'orderNum', displayName: '订单号',minWidth: 100, enablePinning: false},  
            {name: 'needCars', displayName: '所需车辆数',minWidth: 100, enablePinning: false},
            {name: 'price', displayName: '订单价格',minWidth: 100, enablePinning: false},  
            {name: 'alGathPrice', displayName: '已收金额',minWidth: 100, enablePinning: false},
            {name: 'receivableBalance', displayName: '应收余额',minWidth: 100, enablePinning: false},
            // {name: 'deposit', displayName: '客户预存款',minWidth: 100, enablePinning: false},
            {name: 'travelPrepayPrice', displayName: '旅网金额',minWidth: 100, enablePinning: false},  
            {name: 'selfPrepayPrice', displayName: '自网金额',minWidth: 100, enablePinning: false},


            {name: 'serviceType', displayName: '订单业务类型',minWidth: 100, enablePinning: false},  
            {name: 'payStatus', displayName: '订单支付状态',minWidth: 100, enablePinning: false},
          
        ];



        // 取消收款
        $scope.collectionQx = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length > 1){
                $.misMsg("请选择一条收款数据！");
            }else if(selectedRows.length ===0){
                $.misMsg("请选择收款数据！");
            }else{
                let requestParams = {
                    /** 主订单id */
                    id:selectedRows[0].entity.id
                }
                financeService.cancelConfirmCollection(requestParams).then(function(res){
                    if(res.data.code===1){
                        $.misMsg(res.data.msg);
                        $state.reload();
                    }
                })
            }
        }

        $scope.moreSearchAction = function(){
            $scope.searchCollectionShow = !$scope.searchCollectionShow
        };

        // 收款弹框
        $scope.collectionBtn = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length ===0){
                $.misMsg("请选择订单数据！");
            }else{
                $scope.driverLists = [];
                if(selectedRows.length ===1){
                    console.log(userMsg)
                    if(userMsg.loginRole.name == "业务"){
                        $scope.gathType = '0';
                        $scope.typeCollectionShow = false;
                        // $scope.preMoneyShow = false;
                        $scope.cusIdShow = true;
                        $scope.routeDriver = "";
                        $scope.preMoney = "";
                        $scope.clickYw = true;
                        // 检测科目是否存在
                        let requestParams = {
                            courseNames: '预收账款'
                        }
                        financeService.getCreateReimCourse(requestParams).then(function(res){
                            if (res.data.code === 1) {
                                if(res.data.data == ""){
                                    $.misMsg("科目不存在请先添加");
                                }else{
                                    $scope.collectionShow = true;
                                    angular.forEach(res.data.data,function(data){
                                        if(data.courseName === "预收账款"){
                                            $scope.courseQt = false;
                                            $scope.courseYw = true;
                                            $scope.feeCourseMy = (data.id).toString();
                                            $scope.addReimListArr = [
                                                {
                                                    modal:{
                                                        remark:'',
                                                        feeCourse:data.id+'',
                                                        incomeMoney:'0',
                                                        payMoney:'0'
                                                    }
                                                },
                                                {
                                                    modal:{
                                                        remark:'',
                                                        feeCourse:data.id+'',
                                                        incomeMoney:'0',
                                                        payMoney:'0'
                                                    }
                                                }
                                                
                                            ];
                                            $scope.addItem = function(){
                                                let info = {
                                                    modal:{
                                                        remark:'',
                                                        feeCourse:data.id+'',
                                                        incomeMoney:'0',
                                                        payMoney:'0'
                                                    }
                                                }
                                                $scope.addReimListArr.push(info)
                                                // console.log($scope.addReimListArr)
                                            };
                                        }
                                    });
                                    $scope.write = false;
                                    $scope.dataLists = selectedRows;
                                    $scope.collectMoneyList = selectedRows;
                                    $scope.findCourses();
                                    $scope.idsCollection = selectedRows[0].entity.id;
                                    $scope.jieMoneyTotle = selectedRows[0].entity.price;
                                    $scope.daiMoneyTotle = 0;
                                    $scope.cusIds = parseInt(selectedRows[0].entity.mainOrderBase.baseUserId.id);
                                    angular.forEach(selectedRows[0].entity.mainCars,function(data){
                                        if(data.main_driver == null){
                                            console.log(444)
                                        }else{
                                            $scope.driverLists.push(data.main_driver.realName)
                                            $scope.routeDriver = $scope.driverLists[0];
                                            // console.log($scope.driverLists)
                                        }
                                    })

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
                                            angular.forEach(res.data.data,function(item){
                                                if(item.baseUserId.id === $scope.cusIds){
                                                    // $scope.money1 = item.preMoney;
                                                    $scope.cusId = $scope.cusIds+'/'+item.preMoney;
                                                    $scope.money = item.preMoney
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        })
                    }else{
                        $scope.courseQt = true;
                        $scope.courseYw = false;
                        $scope.write = false;
                        $scope.collectionShow = true;
                        $scope.dataLists = selectedRows;
                        $scope.collectMoneyList = selectedRows;
                        $scope.findCourses();
                        $scope.idsCollection = selectedRows[0].entity.id;
                        $scope.jieMoneyTotle = selectedRows[0].entity.price;
                        $scope.daiMoneyTotle = 0;
                        $scope.cusIds = parseInt(selectedRows[0].entity.mainOrderBase.baseUserId.id);
                        angular.forEach(selectedRows[0].entity.mainCars,function(data){
                            if(data.main_driver == null){
                                console.log(444)
                            }else{
                                $scope.driverLists.push(data.main_driver.realName)
                                $scope.routeDriver = $scope.driverLists[0];
                                // console.log($scope.driverLists)
                            }
                        })

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
                                angular.forEach(res.data.data,function(item){
                                    if(item.baseUserId.id === $scope.cusIds){
                                        // $scope.money1 = item.preMoney;
                                        $scope.cusId = $scope.cusIds+'/'+item.preMoney;
                                        $scope.money = item.preMoney
                                    }
                                })
                            }
                        });
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
                            $scope.addReimListArr.push(info)
                            // console.log($scope.addReimListArr)
                        };
                        }
                }else if(selectedRows.length > 1){
                    if(userMsg.loginRole.name == "业务"){
                        $scope.gathType = '0';
                        $scope.clickYw = true;
                        // 检测科目是否存在
                        let requestParams = {
                            courseNames: '预收账款'
                        }
                        financeService.getCreateReimCourse(requestParams).then(function(res){
                            if (res.data.code === 1) {
                                if(res.data.data == ""){
                                    $.misMsg("科目不存在请先添加");
                                }else{
                                    $scope.courseQt = false;
                                            $scope.courseYw = true;
                                            $scope.feeCourseMy = (data.id).toString();
                                            $scope.addReimListArr = [
                                                {
                                                    modal:{
                                                        remark:'',
                                                        feeCourse:data.id+'',
                                                        incomeMoney:'0',
                                                        payMoney:'0'
                                                    }
                                                },
                                                {
                                                    modal:{
                                                        remark:'',
                                                        feeCourse:data.id+'',
                                                        incomeMoney:'0',
                                                        payMoney:'0'
                                                    }
                                                }
                                                
                                            ];
                                            $scope.addItem = function(){
                                                let info = {
                                                    modal:{
                                                        remark:'',
                                                        feeCourse:data.id+'',
                                                        incomeMoney:'0',
                                                        payMoney:'0'
                                                    }
                                                }
                                                $scope.addReimListArr.push(info)
                                                // console.log($scope.addReimListArr)
                                            };
                                            $scope.write = true;
                                            let listIdArr = [];
                                            let priceArr = [];
                                            let idsCollect = [];
                                            var eq = true;
                                            angular.forEach(selectedRows,function(item){
                                                angular.forEach(item.entity.mainCars,function(data){
                                                    console.log(data)
                                                    if(data.main_driver == null){
                                                        console.log(222)
                                                    }else{
                                                        $scope.driverLists.push(data.main_driver.realName);
                                                        $scope.routeDriver = $scope.driverLists[0];
                                                    }
                                                })
                                            })
                                            for(var i=0; i<selectedRows.length; i++){
                                                listIdArr.push(selectedRows[i].entity.mainOrderBase.baseUserId.realName);
                                                priceArr.push(selectedRows[i].entity.price);
                                                idsCollect.push(selectedRows[i].entity.id)
                                            }
                                            for(var j=0; j<listIdArr.length;j++){
                                                if(listIdArr[0] != listIdArr[j]){
                                                    $.misMsg("必须是同一个客户的订单！");
                                                    eq = false;
                                                    break;
                                                }else{
                                                    eq = true;
                                                }
                                            }
                                            if(eq){
                                                $scope.collectionShow = true;
                                                $scope.dataLists = selectedRows;
                                                $scope.collectMoneyList = selectedRows;
                                                $scope.findCourses();
                                                $scope.idsCollection = idsCollect.join(",");
                                                $scope.jieMoneyTotle =  priceArr.reduce((total, num) => { return total + num });
                                                $scope.daiMoneyTotle = 0;
                                                $scope.cusIds = parseInt(selectedRows[0].entity.mainOrderBase.baseUserId.id);
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
                                                        angular.forEach(res.data.data,function(item){
                                                            if(item.baseUserId.id === $scope.cusIds){
                                                                // $scope.money1 = item.preMoney;
                                                                $scope.cusId = $scope.cusIds+'/'+item.preMoney;
                                                                $scope.money = item.preMoney
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                }
                            }
                        })
                    }else{
                        $scope.write = true;
                        let listIdArr = [];
                        let priceArr = [];
                        let idsCollect = [];
                        var eq = true;
                        angular.forEach(selectedRows,function(item){
                            angular.forEach(item.entity.mainCars,function(data){
                                console.log(data)
                                if(data.main_driver == null){
                                    console.log(222)
                                }else{
                                    $scope.driverLists.push(data.main_driver.realName);
                                    $scope.routeDriver = $scope.driverLists[0];
                                }
                            })
                        })
                        for(var i=0; i<selectedRows.length; i++){
                            listIdArr.push(selectedRows[i].entity.mainOrderBase.baseUserId.realName);
                            priceArr.push(selectedRows[i].entity.price);
                            idsCollect.push(selectedRows[i].entity.id)
                        }
                        for(var j=0; j<listIdArr.length;j++){
                            if(listIdArr[0] != listIdArr[j]){
                                $.misMsg("必须是同一个客户的订单！");
                                eq = false;
                                break;
                            }else{
                                eq = true;
                            }
                        }
                        if(eq){
                            $scope.collectionShow = true;
                            $scope.dataLists = selectedRows;
                            $scope.collectMoneyList = selectedRows;
                            $scope.findCourses();
                            $scope.idsCollection = idsCollect.join(",");
                            $scope.jieMoneyTotle =  priceArr.reduce((total, num) => { return total + num });
                            $scope.daiMoneyTotle = 0;
                            $scope.cusIds = parseInt(selectedRows[0].entity.mainOrderBase.baseUserId.id);
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
                                    angular.forEach(res.data.data,function(item){
                                        if(item.baseUserId.id === $scope.cusIds){
                                            // $scope.money1 = item.preMoney;
                                            $scope.cusId = $scope.cusIds+'/'+item.preMoney;
                                            $scope.money = item.preMoney
                                        }
                                    })
                                }
                            });
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
                                $scope.addReimListArr.push(info)
                                // console.log($scope.addReimListArr)
                            };
                        }
                    }
                }
            }
        };

        $scope.selectCollectionXz = function(){
            let cusSelect = $scope.cusId;
            $scope.money =  (cusSelect.split("/"))[1];
        };
        // 收款金额方式选择
        $scope.selectTypeCollection = function(){
            if($scope.gathType == "1"){
                $scope.typeCollectionShow = true;
                // $scope.preMoneyShow =true;
                $scope.cusIdShow = false;
                $scope.cusId ="";
            }else if($scope.gathType == "2"){
                $scope.typeCollectionShow = false;
                // $scope.preMoneyShow =true;
                $scope.cusIdShow = false;
                $scope.routeDriver = "";
                $scope.cusId ="";
            }else if($scope.gathType == "0"){
                $scope.typeCollectionShow = false;
                // $scope.preMoneyShow = false;
                $scope.cusIdShow = true;
                $scope.routeDriver = "";
                $scope.preMoney = "";
            }
        };

        // // 添加
        // $scope.addReimListArr = [
        //     {
        //         modal:{
        //             remark:'',
        //             feeCourse:'',
        //             incomeMoney:'0',
        //             payMoney:'0'
        //         }
        //     },
        //     {
        //         modal:{
        //             remark:'',
        //             feeCourse:'',
        //             incomeMoney:'0',
        //             payMoney:'0'
        //         }
        //     }
            
        // ];
        // $scope.addItem = function(){
        //     let info = {
        //         modal:{
        //             remark:'',
        //             feeCourse:'',
        //             incomeMoney:'0',
        //             payMoney:'0'
        //         }
        //     }
        //     $scope.addReimListArr.push(info)
        //     // console.log($scope.addReimListArr)
        // };
        // 取消
        $scope.cancelItem = function(index,obj){
            if($scope.addReimListArr.length < 2){
                $.misMsg("至少添加一条对方科目数据平账");
            }else{
                $scope.addReimListArr.splice(index, 1);
                $scope.daiJie();
            }
            // console.log($scope.addReimListArr)
        };
        $scope.jsJie = function(){
            console.log($scope.collectMoneyList)
            $scope.jieMoneyTotle = $scope.collectMoneyList[0].entity.price;
        }

        $scope.daiJie = function(){
            let daiMonenyDfList2 = [];
            angular.forEach($scope.addReimListArr,function(data){
                daiMonenyDfList2.push(data.modal.payMoney)
            });
            $scope.daiMoneyTotle = Number((daiMonenyDfList2).map(Number).reduce((total, num) => { return total + num }));
        }
        // 收款确认
        $scope.saveConfirmCollection = function(){
            let cusId = ($scope.cusId.split("/"))[0];
            let fd = true;
            if($scope.jieMoneyTotle != $scope.daiMoneyTotle ){
                $.misMsg("借贷账不平")
                return false;
            }
             /** 订单id */
             let dIdList = [];
             angular.forEach($scope.dataLists,function(data){
                     dIdList.push(data.entity.id)
             });
             /** $scope.createInfo合并 */
             let hList = [];
             hList=dIdList.map((e,i)=>{return [e+'='+$scope.feeCourseMy[i]]});
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
                $scope.gathMoney = $scope.jieMoneyTotle;
                let  requestParams= {
                    /** 客户id:gathType=0时此参数必有值，默认为空 */
                    downCusId:cusId || '',
                    /** 收款金额 */
                    gathMoney:$scope.gathMoney,
                    /** 订单记录id=科目id */
                    createInfo:$scope.createInfo,
                    /** 对方科目id=对方科目摘要=对方科目借方金额=对方科目贷方金额 */
                    faceCourseInfo:$scope.faceCourseInfo,
                    /** 收款类型 */
                    gathType:$scope.gathType,
                    /** gathType=1时此参数必有值，师傅信息 */
                    routeDriver:$scope.routeDriver || '',
                    gainTime:$scope.gainTime
                }
                console.log(requestParams)
                financeService.serviceGath(requestParams).then(function(res){
                    if (res.data.code === 1) {
                        $.misMsg(res.data.msg);
                        $state.reload();
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
            }
        };
        // 取消
        $scope.closeConfirmCollection = function(){
            $scope.collectionShow = false;
        };
        ($scope.init = function(){
            $scope.getMainCarOrderForCollection();
            $scope.companyCusCombo();
            $scope.getEmployeeList();
        })();
    }])