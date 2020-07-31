'use strict';

logisticsModule.controller('vehicleCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','logisticsService','officeService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,logisticsService,officeService,) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.params.flag==='add'?$scope.title = "添加车辆":$scope.title ="编辑车辆";
        $.datetimepicker.setLocale('ch');
        //日期选择
        $('#form_datetime').datetimepicker({
            format: "Y-m-d",      //格式化日期
            timepicker: false,    //打开时间选项
            todayButton: true,
            step: 1,  //时间间隔为1  分钟
        });
        $('#ksTime,#jsTime,#xTime').datetimepicker({
            format: "Y-m-d H:i:s",      //格式化日期
            timepicker: true,    //打开时间选项
            todayButton: true,
            step: 1,  //时间间隔为1  分钟
        });
        // 维修报修时间选择
        $scope.timeSelect = function(v){
            if(v =="1"){
                $scope.extendShow = true;
                $scope.downShow = false;
            }else if(v =="2"){
                $scope.extendShow = false;
                $scope.downShow = true;
            }else{
                $scope.extendShow = false;
                $scope.downShow = false;
            }
        };


        


        // 检验车牌号-输入框的格式是否正确
        $scope.$watch('plateNumber',  function(newValue, oldValue) {
            if($scope.params.flag==='add'){
                if(newValue == undefined){
                    // console.log(334456789)
                }else{
                    if($scope.plateNumber.length > 6){
                        $scope.plateNumber = oldValue;
                        return false;
                    }else if(!(/^[A-Za-z0-9]+$/.test($scope.plateNumber))){
                        $scope.plateNumber = oldValue;
                        return false;
                    }
                }
            }else if($scope.params.flag==='edit'){
                return true;
            }
        });
        // 检验座位数-输入框的格式是否正确
        $scope.$watch('seats',  function(newValue, oldValue) {
            if(newValue == undefined){
                // console.log(334456789)
            }else{
                if($scope.seats.length > 10){
                    $scope.seats = oldValue;
                    return false;
                }else if(!(/^[1-9]\d*$/.test($scope.seats))){
                    $scope.seats = oldValue;
                    // console.log(oldValue)
                    return false;
                }
            }
        });

        // 检验续航里程，正常耗油的格式是否正确
        $scope.$watch('mileage', function(newValue, oldValue) {
            if(newValue == undefined){
                // console.log(334456789)
            }else{
                if($scope.mileage.length > 10){
                    $scope.mileage = oldValue;
                    return false;
                }else if(!(/^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/.test($scope.mileage))){
                    $scope.mileage = oldValue;
                    return false;
                }else if($scope.mileage == 0){
                    $scope.mileage = oldValue;
                    return false;
                }
            }
        });
        $scope.$watch('fuel', function(newValue, oldValue) {
            if(newValue == undefined){
                // console.log(334456789)
            }else{
                if($scope.fuel.length > 10){
                    $scope.fuel = oldValue;
                    return false;
                }else if(!(/^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/.test($scope.fuel))){
                    $scope.fuel = oldValue;
                    return false;
                }else if($scope.fuel == 0){
                    $scope.fuel = oldValue;
                    return false;
                }
            }
        });
        

        $scope.resFileUrl = {  //服务器返回图片路径集合
            businessImgUrl:'',
        };

        $scope.imgUrlArr = {  //图片base64集合
            businessImgUrl:[],
        };

        $scope.addPic = function (v) {
            document.getElementById(v).click();
        };
        $scope.multipleFileUpload = function(e,id){
            let file = document.querySelector('input[id='+id+']').files;
                lrz(file[0]).then(function (rst) {        //获取图片base64编码，用于页面展示
                    if(id==='businessImg'){
                        $scope.imgUrlArr.businessImgUrl.splice(0,1,rst.base64);
                        $scope.$apply($scope.imgUrlArr.businessImgUrl);
                    }
                    return rst;
                })
                
            let formData = new FormData();
                formData.append('file', file[0]);  //获取图片文件流格式参数
                formData.append('userName', userMsg.company.baseUserId.uname); //加入参数userName
    
            logisticsService.imgUpload(formData).then(function(res){    //接口调用
                if(res.data.code===1){
                    $scope.resFileUrl.businessImgUrl = res.data.url;
                }else{
                    $.misMsg(res.data.msg);
                }
            })
        };

        $scope.getCompanyCusIsDepend = function(){
                // 获取添加车辆所属公司下拉框
                let requestParams = {
                    unitNum:userMsg.company.unitNum ||""
                }
                logisticsService.getCompanyCusIsDepend(requestParams).then(function(res){
                    // console.log(res)
                    if(res.data.code === 1){
                        let compangList = res.data.data;
                        $scope.list = compangList;
                        /** 所属公司简称 */
                        $scope.belongComapnySimName = compangList.unitSimple;
                        /** 所属公司名称 */
                        $scope.belongCompanyName = compangList.unitName;
                    }
                })
            }
        
        // 获取车辆品牌
            $scope.carBrand = function(){
                let requestParams = {
                    carType:$scope.vehicleType
                }
                logisticsService.getCarBrands(requestParams).then(function(res){
                    // console.log(res)
                    if(res.data.code === 1){
                        let result = res.data;
                        $scope.carBrandList = result.data;
                    }
                })
                
            }


        // 获取城市列表
        $scope.getCitys = function(){
            let requestParams = {
                provinceCode:""
            }
            logisticsService.getCitys(requestParams).then(function(res){
                if(res.data.code ===1){
                    let result = res.data;
                    $scope.cityList = result.data;
                    $(function (){
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('render');
                    });
                    

                }
            })
        }
        

        $scope.selectCtiy = function(){
            let requestParams = {
                id:$scope.cityId
            }
            logisticsService.getPlateNumShort(requestParams).then(function(res){
                if(res.data.code === 0){
                    let result = res.data;
                    $scope.plateNumShortList = result.data;
                    $scope.plateNumShort = result.data[0];
                }
            })
        }
        

        //查询-车辆信息
        $scope.vehicleFindById = function(){
            let requestParams = {
                id:$scope.params.vehicleId||''
            }
            logisticsService.vehicleFindById(requestParams).then(function(res){
                if(res.data.code===1){
                    let result = res.data.data;
                    /** 车牌号 */
                    $scope.plateNumber = result.plateNumber;
                    /** 座位数 */
                    $scope.seats = result.seats;
                    /** 车辆类型 */
                    if(result.vehicleType == "BUS"){
                        $scope.vehicleType = '0'
                    }else if(result.vehicleType == "MINIBUS"){
                        $scope.vehicleType = '1'
                    }else if(result.vehicleType == "MPV"){
                        $scope.vehicleType = '2'
                    }else if(result.vehicleType == "SUV"){
                        $scope.vehicleType = '3'
                    }else if(result.vehicleType == "CAR"){
                        $scope.vehicleType = '4'
                    }else{
                        $scope.vehicleType = '5'
                    }
                    /** 车辆类型 */
                    $scope.businessType = result.businessType;
                    /** 车辆状态 1是正常 */
                    if(result.status == "0"){
                        $scope.status = (result.status).toString();
                        $scope.ksTime = '';
                        $scope.jsTime = '';
                        $scope.xTime = '';
                        $scope.extendShow = false;
                        $scope.downShow = false;
                    }else if(result.status == "1"){
                        $scope.status = (result.status).toString();
                        $scope.extendShow = true;
                        $scope.downShow = false;
                        $scope.xTime = '';
                        $scope.ksTime = result.statusTimeslot.substring(0,19);
                        $scope.jsTime = result.statusTimeslot.substring(20,39);
                    }else if(result.status == "2"){
                        $scope.status = (result.status).toString();
                        $scope.extendShow = true;
                        $scope.downShow = false;
                        $scope.xTime = '';
                        $scope.ksTime = result.statusTimeslot.substring(0,19);
                        $scope.jsTime = result.statusTimeslot.substring(20,39);
                    }else if(result.status == "3"){
                        $scope.status = (result.status).toString();
                        $scope.extendShow = false;
                        $scope.downShow = true;
                        $scope.ksTime = '';
                        $scope.jsTime = '';
                        $scope.xTime = result.statusTimeslot;
                    }
                    /** 购买日期 */
                    $scope.purchaseDate = result.purchaseDate,
                    /** 车辆品牌 */
                    $scope.carBrand();
                    $scope.brandId = (result.brandId).toString();
                    /** 车辆性质 */
                    $scope.carUsage = result.carUsage;
                    /** 关联公司id */
                    $scope.companyAll = result.companyId+"|"+result.belongComapnySimName+"|"+result.belongCompanyName
                    /** 动力来源 */
                    $scope.powerSource = result.powerSource;
                    /** 续航里程 */
                    $scope.mileage = result.mileage;
                    /** 正常油耗 */
                    $scope.fuel = result.fuel; 
                    /** 正常油耗 价格 */
                    $scope.fuelPrice = result.fuelPrice;
                    /** 停靠地址全称 */
                    $scope.dockedAddress = result.dockedAddress;
                    /** 可跑区域 */
                    $scope.runningArea = (result.runningArea).toString();
                    /** 停靠地址简称 */
                    $scope.simpleDockedAddress = result.simpleDockedAddress;
                    /** 停靠地址纬度 */
                    $scope.dockedLatitude = result.dockedLatitude;
                    /** 停靠地址经度 */
                    $scope.dockedLongitude = result.dockedLongitude;
                    /** 驾照图片 */
                    $scope.imgUrlArr.businessImgUrl = [result.travelLicensePhotoURL];
                    $scope.resFileUrl = {
                        businessImgUrl:result.travelLicensePhotoURL,
                    };
                    /** 驾照需求 */
                    $scope.drivingType = result.drivingType;
                    /** 所属公司简称 */
                    $scope.belongComapnySimName = result.belongComapnySimName;
                    /** 所属公司名称 */
                    $scope.belongCompanyName = result.belongComapnySimName;
                }
            })
        }



        // 地图
        function G(id) {
            return document.getElementById(id);
        }

        var map = new BMap.Map("l-map");
        map.centerAndZoom("中国",12);      // 初始化地图,设置城市和地图级别。

        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {"input" : "suggestId"
            ,"location" : map
        });

        ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
        var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }    
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }    
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        var localSearch = new BMap.LocalSearch(map);
        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            $scope.dockedAddress = myValue;
            G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
            setPlace();

        var keyword = myValue;
        localSearch.setSearchCompleteCallback(function (searchResult) {
    　　　　var poi = searchResult.getPoi(0);
            // console.log(poi)
            // 经度
            $scope.dockedLongitude = poi.point.lng;
            // console.log(poi.point.lng)
            // 纬度
            $scope.dockedLatitude = poi.point.lat;
            // console.log(poi.point.lat);
    　　　　 map.centerAndZoom(poi.point, 13);
    　　});
            localSearch.search(keyword);
        });

        function setPlace(){
            map.clearOverlays();    //清除地图上所有覆盖物
            function myFun(){
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp));    //添加标注
            }
            var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
            });
            local.search(myValue);
        }



        // 添加/修改-车辆
        $scope.saveData = function(){
            if($scope.params.flag==='edit'){
                if($scope.status === "0"){
                    var statusTimeslot2 = null;
                }else if($scope.status === "1" || $scope.status === "2"){
                    var statusTimeslot2 = $scope.ksTime+'-'+$scope.jsTime;
                    // console.log(statusTimeslot2)
                }else if($scope.status === "3"){
                    var statusTimeslot2 = $scope.xTime;
                }
                let companyAll = $scope.companyAll.split("|");
                let companyId = companyAll[0];
                let belongComapnySimName = companyAll[1];
                let belongCompanyName = companyAll[2];
                // 修改-提交
                let requestParams = {
                    id: $scope.params.vehicleId ||'',
                    /** 公司编号 */
                    unitNum: userMsg.company.unitNum,
                    /** 车牌号 */
                    plateNumber:$scope.plateNumber,
                    /** 座位数 */
                    seats: $scope.seats,
                    /** 车辆类型 */
                    vehicleType:parseInt($scope.vehicleType),
                    /** 车辆类型-自营 */
                    businessType: "MYSELF",
                    /** 车辆状态 1是正常 */
                    status: $scope.status,
                    /** 购买日期 */
                    purchaseDate:$scope.purchaseDate,
                    /** 车辆品牌 */
                    brandId: $scope.brandId,
                    /** 车辆性质 */
                    carUsage: $scope.carUsage,
                    /** 关联公司id */
                    companyId: companyId,
                    /** 动力来源 */
                    powerSource: $scope.powerSource,
                    /** 续航里程 */
                    mileage: $scope.mileage,
                    /** 正常油耗 */
                    fuel: $scope.fuel,
                    /** 正常油耗 价格 */
                    fuelPrice:$scope.fuelPrice,
                    /** 停靠地址全称 */
                    dockedAddress: $scope.dockedAddress || '',
                    /** 停靠地址简称 */
                    simpleDockedAddress: $scope.dockedAddress || '',
                    /** 停靠地址纬度 */
                    dockedLatitude: $scope.dockedLatitude || '',
                    /** 停靠地址经度 */
                    dockedLongitude: $scope.dockedLongitude || '',
                    /** 驾照图片 */
                    travelLicensePhotoURL: $scope.resFileUrl.businessImgUrl,
                    /** 驾照需求 */
                    drivingType: $scope.drivingType,
                    /** 所属公司简称 */
                    belongComapnySimName: belongComapnySimName,
                    /** 所属公司名称 */
                    belongCompanyName: belongCompanyName,
                   /** 可跑区域 */
                    runningArea:$scope.runningArea,
                    /** 报修-维修时间段 */
                    statusTimeslot:statusTimeslot2
                }
                logisticsService.vehicleUpdate(requestParams).then(function(res){
                    // console.log(res)
                    if(res.data.code===1){
                        $state.go("aep.loc.vehicle_list");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                });
            }else{
                // 添加-提交
                let requestParams = {
                    plateNum:$scope.plateNumShort+''+$scope.plateNumber
                }
                logisticsService.checkPlateNum(requestParams).then(function(res){
                    if(res.data.code === 0){
                        $scope.plateNumber = '';
                        $.misMsg(res.data.msg);
                    }else{
                        // $scope.checkPlateNumber();
                        if($scope.status ==="0"){
                            var statusTimeslot1 = null;
                        }else if($scope.status ==="1" || $scope.status ==="2"){
                            var statusTimeslot1 = $scope.ksTime+'-'+$scope.jsTime;
                            // console.log(statusTimeslot1)
                        }else if($scope.status ==="3"){
                            var statusTimeslot1 = $scope.xTime;
                        }
                        let companyAll = $scope.companyAll.split("|");
                        let companyId = companyAll[0];
                        let belongComapnySimName = companyAll[1];
                        let belongCompanyName = companyAll[2];
                        let requestParams = {
                             /** 公司编号 */
                             unitNum: userMsg.company.unitNum,
                             /** 车牌号 */
                             plateNumber:$scope.plateNumShort+''+$scope.plateNumber,
                             /** 座位数 */
                             seats: $scope.seats,
                             /** 车辆类型 */
                             vehicleType:parseInt($scope.vehicleType),
                             /** 车辆类型-自营 */
                             businessType: "MYSELF",
                             /** 车辆状态 1是正常 */
                             status: $scope.status,
                             /** 购买日期 */
                             purchaseDate:$scope.purchaseDate,
                             /** 车辆品牌 */
                             brandId: $scope.brandId,
                             /** 车辆性质 */
                             carUsage: $scope.carUsage,
                             /** 关联公司id */
                             companyId: companyId,
                             /** 动力来源 */
                             powerSource: $scope.powerSource,
                             /** 续航里程 */
                             mileage: $scope.mileage,
                             /** 正常油耗 */
                             fuel: $scope.fuel,
                             /** 正常油耗 价格 */
                             fuelPrice:$scope.fuelPrice,
                             /** 停靠地址全称 */
                             dockedAddress: $scope.dockedAddress,
                             /** 停靠地址简称 */
                             simpleDockedAddress: $scope.dockedAddress,
                             /** 停靠地址纬度 */
                             dockedLatitude: $scope.dockedLatitude,
                             /** 停靠地址经度 */
                             dockedLongitude: $scope.dockedLongitude,
                             /** 驾照图片 */
                             travelLicensePhotoURL: $scope.resFileUrl.businessImgUrl,
                             /** 驾照需求 */
                             drivingType: $scope.drivingType,
                             /** 所属公司简称 */
                             belongComapnySimName: belongComapnySimName,
                             /** 所属公司名称 */
                             belongCompanyName: belongCompanyName,
                            /** 可跑区域 */
                             runningArea:$scope.runningArea,
                             /** 报修-维修时间段 */
                             statusTimeslot:statusTimeslot1
                            
                        }
                        console.log(requestParams)
                        logisticsService.vehicleAdd(requestParams).then(function(res){
                            // console.log(res)
                            if(res.data.code===1){
                                $state.go("aep.loc.vehicle_list");
                                $.misMsg(res.data.msg);
                            }else{
                                $.misMsg(res.data.msg);
                            }
                        });
                    }
                })
            }
           
        };  
        $scope.backPage = function(){
            $state.go("aep.loc.vehicle_list");
        };

        ($scope.init = function(){
            $scope.getCompanyCusIsDepend();
            $scope.getCitys();
            if($scope.params.flag==='edit'){
                $scope.selectShow = false;
                $scope.vehicleFindById();
            }else{
                $scope.status = "0";
                $scope.selectShow = true;
            }
        })();

        // $scope.init();
    }])