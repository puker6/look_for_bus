'use strict';

businessModule.controller('orderCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', '$timeout','$interval', 'appSettings','businessService',
    function ($scope, $rootScope,$state, $http, $cookies, $timeout, $interval,appSettings,businessService,) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.params.flag==='add'?$scope.title = "新增订单":$scope.title ="编辑订单";
        $scope.showTabOne = true;
        $scope.tripWay = "pickupAirport";
        $scope.goType = "1";
        $scope.triffic = "";
        $scope.citySelectName = "成都市";
        $scope.wayNumShow = true;
        $scope.isHighSpeed = "0";
        $scope.carNumber = 1;
        $scope.backCarNumber = 1;
        $scope.masterMoney = 0;
        $scope.otherPrice = 0;
        //
        $scope.clientId='';
        $scope.ownerPerson='';
        $scope.serviceMan='';
        $scope.goTime='';
        $scope.linkName=userMsg.company.baseUserId.realName ||'';
        $scope.linkPhone=userMsg.company.baseUserId.phone ||'';
        $scope.seatNumber='';
        $scope.unitPrice='';
        $scope.totalPrice='';
        $scope.routeDetail = '';
        //
        $scope.passAddressInputArr = [];
        $scope.backPassAddressInputArr = [];
        $scope.passAddressArr = [];
        $scope.backPassAddressArr = [];
        // $scope.ownerPersonList = [];

        //包车变量初始化=============================
        $scope.chartLinkName=userMsg.company.baseUserId.realName ||'';
        $scope.chartLinkPhone=userMsg.company.baseUserId.phone ||'';
        $scope.daysArr = [];
        $scope.daysListArr = [];
        $scope.scenicGatherArr = [];
        $scope.daysListType = [];
        $scope.routeMsgArr = [];
        $scope.isActive = 0;
        // $scope.isActiveInfo = 0;
        $scope.chartIsHighSpeed = true;
        $scope.mainOrderNum = "";
        $scope.chartStartTimeRes = "";
        $scope.chartDays = 0;
        $scope.savaBtnShow = false;
        $scope.chartStimeRecord = [];

        $scope.travelType = [
            {
                name:'周边游',
                msg:'不选景点在100公里内4.5小时2个景点可安排',
                arrow:'（可自选景点）',
                id:1
            },{
                name:'市内一日游',
                msg:'不选景点在200公里内9小时4个景点可安排',
                arrow:'（可自选景点）',
                id:2
            },{
                name:'周边一日游',
                msg:'不选景点在400公里内9小时3个景点可安排',
                arrow:'（可自选景点）',
                id:3
            }
        ];
        $scope.init = function(){
            $scope.getClientList();
            $scope.getServiceManList();
            $scope.getStationList();
            loadMapAutocomplete("startSuggestId","startSearchResultPanel");
            loadMapAutocomplete("endSuggestId","endSearchResultPanel");
            loadMapAutocomplete("backStartSuggestId","backStartSearchResultPanel");
            loadMapAutocomplete("backEndSuggestId","backEndSearchResultPanel");
            chartLoadMapAutocomplete("chartStartSuggestId","chartStartSearchResultPanel");
            chartLoadMapAutocomplete("chartEndSuggestId","chartEndSearchResultPanel");
            chartLoadMapAutocomplete("chartScenicSuggestId","chartScenicSearchResultPanel");
            
            // searchEndAdress();
            // searchPassAdress();
            // backSearchStartAdress();
            // backSearchEndAdress();
            // backSearchPassAdress();
            //$scope.getLoctionArea();
        };
        $scope.checkTab = function(v){
            $scope.showTabOne = !$scope.showTabOne;
        };
        $scope.changeSeat = function(v){
            if(v==='go'&&Number($scope.seatNumber)>9){
                $scope.triFFicShow = false;
            }else{
                $scope.triFFicShow = true;
            }
            if(v==='back'&&Number($scope.backSeatNumber)>9){
                $scope.backTrifficShow = false;
            }else{
                $scope.backTrifficShow = true;
            }
        };
        $scope.getClientList = function(){
            let requestParams = {
                page:1,
                rows:100,
                find:$scope.keyword ||"",
                unitNum:userMsg.company.unitNum,
                unitName:'',
                serviceMan:'',
                recomMan:'',
            }
            businessService.getClientList(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.clientList = res.data.data;
                }
            });
        };
        $scope.serviceManList = [];
        $scope.getServiceManList = function(){
            let requestParams = {
                unitNum:userMsg.company.unitNum ||""
            }
            businessService.getServiceManList(requestParams).then(function(res){
                if(res.data.code===1){
                    $scope.serviceManList = res.data.data;
                    let info = {
                        realName:userMsg.company.baseUserId.realName,
                        phone:userMsg.company.baseUserId.phone
                    }
                    $scope.serviceMan = info.realName;
                    $scope.serviceManList.push(info);
                }
            })
        };
        $scope.selectClient = function(){
            $scope.ownerPersonList = [];
            for(let i in $scope.clientList){
                if($scope.clientId===($scope.clientList[i].id).toString()){
                    // $scope.serviceMan = $scope.clientList[i].serviceMan;
                    if($scope.clientList[i].personInCharge!==null &&$scope.clientList[i].personInCharge.length!==0){
                        $scope.ownerPersonList = $scope.clientList[i].personInCharge;
                    }else{
                        let info = {
                            name:$scope.clientList[i].baseUserId.realName,
                            phone:$scope.clientList[i].baseUserId.phone,
                            companyName:$scope.clientList[i].unitName
                        }
                        $scope.ownerPersonList.push(info);
                    }
                    $scope.ownerPerson = $scope.ownerPersonList[0].name;
                }
            }
        };
        //获取站点列表
        $scope.getStationList = function(){
            let requestTravelWay;
            if($scope.tripWay !=="otherWay"){
                if($scope.tripWay==="pickupAirport"||$scope.tripWay==="dropAirport"){
                    requestTravelWay = '1';
                    
                }else if($scope.tripWay==="pickupTrain"||$scope.tripWay==="dropTrain"){
                        requestTravelWay = '2';  
                }else{
                    requestTravelWay = '3';
                }
                let requestParams = {
                    city:$scope.citySelect ||"成都市",
                    travelWay:requestTravelWay||""
                }
                businessService.getStationList(requestParams).then(function(res){
                    if(res.data.code===1){
                        $scope.stationList = res.data.data;
                    }
                })
                if($scope.tripWay==="pickupAirport"||$scope.tripWay==="pickupTrain"){
                    $scope.startAddressShow = false;
                    $scope.endAddressShow = false;
                    $scope.wayNumShow = true;
                    $scope.backWayNumShow = true;
                    $scope.backStartAddressShow = false;
                    $scope.backEndAddressShow = false;
                }else if($scope.tripWay==="dropAirport"||$scope.tripWay==="dropTrain"){
                    $scope.startAddressShow = true;
                    $scope.endAddressShow = true;
                    $scope.wayNumShow = true;
                    $scope.backWayNumShow = true;
                    $scope.backStartAddressShow = true;
                    $scope.backEndAddressShow = true;
                }
            }else{
                $scope.startAddressShow = true;
                $scope.endAddressShow = false;
                $scope.wayNumShow = false;
                $scope.backWayNumShow = false;
                $scope.backStartAddressShow = false;
                $scope.backEndAddressShow = true;
            }
            
        };
        //切换站点列表
        $scope.checkBackStation = function(){
            if($scope.backTripWay==="pickupAirport"||$scope.backTripWay==="pickupTrain"){
                $scope.backStartAddressShow = true;
                $scope.backEndAddressShow = true;
            }else if($scope.backTripWay==="dropAirport"||$scope.backTripWay==="dropTrain"){
                $scope.backStartAddressShow = false;
                $scope.backEndAddressShow = false;
            }else{
                $scope.backStartAddressShow = false;
                $scope.backEndAddressShow = true;
            }
        };
        //获取起点终点位置
        function loadMapAutocomplete (suggestId,adressId){
            function G(id) {
                return document.getElementById(id);
            }
            var map = new BMap.Map("l-map");
            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {"input" : suggestId
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
                G(adressId).innerHTML = str;
            });
            var myValue,addressDetail,addressDetail,areaCity,LatLng,areaAll;
            var localSearch = new BMap.LocalSearch(map);
            ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                //详细地址
                addressDetail = myValue;
                //城市区域
                areaCity = _value.city + '-'+ _value.district;
                G(adressId).innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                // setPlace();

                var keyword = myValue;
                localSearch.setSearchCompleteCallback(function (searchResult) {
                    var poi = searchResult.getPoi(0);
                            // 经纬度
                    LatLng = formatDecimal(poi.point.lng,6)+','+formatDecimal(poi.point.lat,6);
                            //省市区
                    areaAll = poi.province+'-'+areaCity;
                            //传参数据
                    if(suggestId==="startSuggestId"){
                        $scope.requestStartAdress = addressDetail+'='+LatLng+'='+areaAll;
                        $scope.jsonStartAdress = {
                            addressDetail:addressDetail,
                            LatLng:LatLng,
                            areaAll:areaAll
                        }
                    }else if(suggestId==="endSuggestId"){
                        $scope.requestEndAdress = addressDetail+'='+LatLng+'='+areaAll;
                        $scope.jsonEndAdress = {
                            addressDetail:addressDetail,
                            LatLng:LatLng,
                            areaAll:areaAll
                        }
                    }else if(suggestId==="backStartSuggestId"){
                        $scope.requestBackStartAdress = addressDetail+'='+LatLng+'='+areaAll;
                    }else if(suggestId==="backEndSuggestId"){
                        $scope.requestBackEndAdress = addressDetail+'='+LatLng+'='+areaAll;
                    }
                    
            });
                localSearch.search(keyword);
            });
        };
        //获取途经点位置
        function passLoadMapAutocomplete (suggestId,adressId,flag){
            var c=document.getElementById(suggestId).value;
            function G(id) {
                return document.getElementById(id);
            }
            var map = new BMap.Map("l-map");
            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {"input" : suggestId
                ,"location" : map
            });
            
            ac.setInputValue(c);
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
                G(adressId).innerHTML = str;
            });
            var myValue,addressDetail,addressDetail,areaCity,LatLng,areaAll;
            var localSearch = new BMap.LocalSearch(map);
            ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                //详细地址
                addressDetail = myValue;
                //城市区域
                areaCity = _value.city + '-'+ _value.district;
                G(adressId).innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                // setPlace();

                var keyword = myValue;
                localSearch.setSearchCompleteCallback(function (searchResult) {
                    var poi = searchResult.getPoi(0);
                            // 经纬度
                    LatLng = formatDecimal(poi.point.lng,6)+','+formatDecimal(poi.point.lat,6);
                            //省市区
                    areaAll = poi.province+'-'+areaCity;
                            //传参数据
                    // $scope.requestBackPassAdress = addressDetail+'='+LatLng+'='+areaAll;
                    let info = {
                            addressDetail:addressDetail,
                            LatLng:LatLng,
                            areaAll:areaAll,
                            suggestId:suggestId
                        }
                    if(flag==="pass"){
                        $scope.passAddressArr.push(info)
                    }else{
                        $scope.backPassAddressArr.push(info)
                    }
                    
            });
                localSearch.search(keyword);
            });
        };
        
        let arrLengthFlag = 0;
        let backArrLen = 0;
        //添加途经点
        $scope.passAdressAction = function(){
            let arrLength = $scope.passAddressInputArr.length;
            if($scope.passAddressInputArr.length>5){
                $.misMsg("途经点最多添加 6 个！")
            }else{
                let info = {
                    passId:'passId'+arrLengthFlag,
                    passModal:'passAddress'+arrLengthFlag,
                    suggestId:'suggestId'+arrLengthFlag
                }
                $scope.passAddressInputArr.push(info)
                $timeout(function(){
                    passLoadMapAutocomplete($scope.passAddressInputArr[arrLength].suggestId,$scope.passAddressInputArr[arrLength].passId,'pass')
                }) 
                arrLengthFlag++;
            }            
        };
        //取消途经点
        $scope.cancelPassAdressAction = function(index,obj){
            $scope.passAddressInputArr.splice(index, 1);
            for(let i=0;i<$scope.passAddressArr.length;i++){
                if(obj.suggestId===$scope.passAddressArr[i].suggestId){
                    $scope.passAddressArr.splice(i,1)
                }
            }
        };
        //添加返程途经点
        $scope.backPassAdressAction = function(){
            let arrLength = $scope.backPassAddressInputArr.length;
            if($scope.backPassAddressInputArr.length>5){
                $.misMsg("途经点最多添加 6 个！")
            }else{
                let info = {
                    passId:'backPassId'+backArrLen,
                    // backPassModal:"backPassModal"+backArrLen,
                    suggestId:'backPuggestId'+backArrLen,
                }
                $scope.backPassAddressInputArr.push(info)
                backArrLen++;
                $timeout(function(){
                    passLoadMapAutocomplete($scope.backPassAddressInputArr[arrLength].suggestId,$scope.backPassAddressInputArr[arrLength].passId,'backPass')
                }) 
                
            }
        };
        //取消返程途经点
        $scope.backCancelPassAdressAction = function(index,obj){
            $scope.backPassAddressInputArr.splice(index, 1);
            for(let i=0;i<$scope.backPassAddressArr.length;i++){
                if(obj.suggestId===$scope.backPassAddressArr[i].suggestId){
                    $scope.backPassAddressArr.splice(i,1)
                }
            }
        };
        //通过经纬度查询地点区域信息
        $scope.getLoctionArea = function(){
            let requestParams = "30.254572,104.704577";
            $.ajax({
                url: 'http://api.map.baidu.com/geocoder/v2/?callback=getLoctionArea&location='+requestParams+'&output=json&pois=1&ak=x9mIiLLIl9qYijcZXVXrpWrMsDKrW4fY',
                type: 'GET',
                async:false,//设置同步。ajax默认异步
                dataType: 'jsonp',
                jsonp:'callback',//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback:"callback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                timeout: 5000,
                contentType: 'application/json; charset=utf-8',
                success: function (result){
                }
            })
        };
        //添加返程
        $scope.backTarckAction = function(v){
            if($scope.clientId===''||$scope.ownerPerson===''||$scope.serviceMan===''||$scope.tripWay===''||$scope.goTime===''||$scope.linkName===''
            ||$scope.linkPhone===''||$scope.seatNumber===''||$scope.carNumber===''||$scope.unitPrice===''||$scope.totalPrice===''||$scope.routeDetail===''){
                $.misMsg("数据未填写完整，请补充！");
                return;
            }
            for(let i in $scope.passAddressArr){
                let info = {
                    passId:'backPassId'+backArrLen,
                    suggestId:'backPuggestId'+backArrLen,
                    backPassModal:$scope.passAddressArr[$scope.passAddressArr.length-1-i].addressDetail,
                }
                $scope.backPassAddressInputArr.push(info);
                let addressInfo = {
                    suggestId:'backPuggestId'+backArrLen,
                    addressDetail:$scope.passAddressArr[$scope.passAddressArr.length-1-i].addressDetail,
                    LatLng:$scope.passAddressArr[$scope.passAddressArr.length-1-i].LatLng,
                    areaAll:$scope.passAddressArr[$scope.passAddressArr.length-1-i].areaAll
                }
                
                $scope.backPassAddressArr.push(addressInfo)

                backArrLen++;
                $timeout(function(){
                    passLoadMapAutocomplete($scope.backPassAddressInputArr[i].suggestId,$scope.backPassAddressInputArr[i].passId,"backPass")
                }) 
                //$scope.backPassAddressArr.push($scope.passAddressArr[$scope.passAddressArr.length-1-i])
            }
            // for(let i in $scope.backPassAddressArr){
            //     let info = {
            //         passId:'backPassId'+backArrLen,
            //         backPassModal:$scope.backPassAddressArr[i].addressDetail,
            //         suggestId:'backPuggestId'+backArrLen,
            //     }
            //     $scope.backPassAddressInputArr.push(info);
            //     backArrLen++;
            //     $timeout(function(){
            //         passLoadMapAutocomplete($scope.backPassAddressInputArr[i].suggestId,$scope.backPassAddressInputArr[i].passId,"backPass")
            //     }) 
                
            // }    
            $scope.backSeatNumber = $scope.seatNumber;
            $scope.backGoType = $scope.goType;
            $scope.backCarNumber = $scope.carNumber;
            $scope.backUnitPrice = $scope.unitPrice;
            $scope.backTotalPrice = $scope.totalPrice; 
            $scope.backTarckShow = !$scope.backTarckShow;
            $scope.backGoType = $scope.goType ||"1";
            $scope.backLinkName = $scope.linkName;
            $scope.backLinkPhone = $scope.linkPhone;
            if($scope.tripWay==="pickupAirport")$scope.backTripWay="dropAirport";
            if($scope.tripWay==="dropAirport")$scope.backTripWay="pickupAirport";
            if($scope.tripWay==="pickupTrain")$scope.backTripWay="dropTrain";
            if($scope.tripWay==="dropTrain")$scope.backTripWay="pickupTrain";
            if($scope.tripWay==="otherWay")$scope.backTripWay="otherWay";
            if(v==='add'){
                $scope.backIsHighSpeed = $scope.isHighSpeed;
                $scope.backStartAddressSec = $scope.endAddressSec;
                $scope.backEndAddressSec = $scope.startAddressSec;
                if($scope.jsonStartAdress!==undefined){
                    $scope.backEndAddress = $scope.jsonStartAdress.addressDetail;
                    $scope.requestBackEndAdress = $scope.jsonStartAdress.addressDetail+'='+$scope.jsonStartAdress.LatLng+'='+$scope.jsonStartAdress.areaAll;
                    
                };
                if($scope.jsonEndAdress!==undefined){
                    $scope.backStartAddress = $scope.jsonEndAdress.addressDetail;
                    $scope.requestBackStartAdress = $scope.jsonEndAdress.addressDetail+'='+$scope.jsonEndAdress.LatLng+'='+$scope.jsonEndAdress.areaAll;
                }
                // if($scope.jsonPassAdress!==undefined){
                //     $scope.backPassAddress = $scope.jsonPassAdress.addressDetail;
                //     $scope.requestBackPassAdress = $scope.jsonPassAdress.addressDetail+'='+$scope.jsonPassAdress.LatLng+'='+$scope.jsonPassAdress.areaAll;
                // }

            }

        };
        //计算去程总价
        $scope.imputedPrice = function(){
            $scope.totalPrice = $scope.carNumber * $scope.unitPrice;
        };
        //计算返程总价
        $scope.backImputedPrice = function(){
            $scope.backTotalPrice = $scope.backCarNumber * $scope.backUnitPrice;
        };
        $scope.compareGoTime = function(){
            if($scope.goTime!==""&&$scope.goTime!==null&&$scope.goTime!==undefined&&$scope.backGoTime!==""&&$scope.backGoTime!==null&&$scope.backGoTime!==undefined){
                if($scope.goTime>=$scope.backGoTime){
                    $.misMsg("返程时间不能小于去程时间！");
                    $scope.backGoTime = "";
                }
            }
        };
        $scope.requestPassAdressArr = [];
        $scope.backRequestPassAdressArr = [];
        //保存单程接送数据
        $scope.saveData = function(){

            let requestPassAddress,backRequestPassAddress;
            if($scope.passAddressArr.length===0){
                requestPassAddress = "";
            }else{
                for(let i=0;i<$scope.passAddressArr.length;i++){
                    $scope.requestPassAdressArr.push($scope.passAddressArr[i].addressDetail+'='+$scope.passAddressArr[i].LatLng+'='+$scope.passAddressArr[i].areaAll)
                }
            }
            requestPassAddress = $scope.requestPassAdressArr.join(';')
            if($scope.backPassAddressArr.length===0){
                backRequestPassAddress = "";
            }else{
                for(let i=0;i<$scope.passAddressArr.length;i++){
                    $scope.backRequestPassAdressArr.push($scope.backPassAddressArr[i].addressDetail+'='+$scope.backPassAddressArr[i].LatLng+'='+$scope.backPassAddressArr[i].areaAll)
                }
            }
            backRequestPassAddress = $scope.backRequestPassAdressArr.join(';')
            $.misShow3DLoader()
            let requestStartAddressSec,requestEndAddressSec,requestIsShuttle;
            let requestBackStartAddressSec,requestBackEndAddressSec,requestBackIsShuttle;
            for(let i in $scope.stationList){
                if($scope.startAddressSec===($scope.stationList[i].id).toString()){
                    requestStartAddressSec = $scope.stationList[i].name+'='+$scope.stationList[i].mapPoint.lng+','+$scope.stationList[i].mapPoint.lat+'='+$scope.stationList[i].county;
                }
                if($scope.endAddressSec===($scope.stationList[i].id).toString()){
                    requestEndAddressSec = $scope.stationList[i].name+'='+$scope.stationList[i].mapPoint.lng+','+$scope.stationList[i].mapPoint.lat+'='+$scope.stationList[i].county;
                }
                if($scope.backStartAddressSec===($scope.stationList[i].id).toString()){
                    requestBackStartAddressSec = $scope.stationList[i].name+'='+$scope.stationList[i].mapPoint.lng+','+$scope.stationList[i].mapPoint.lat+'='+$scope.stationList[i].county;
                }
                if($scope.backEndAddressSec===($scope.stationList[i].id).toString()){
                    requestBackEndAddressSec = $scope.stationList[i].name+'='+$scope.stationList[i].mapPoint.lng+','+$scope.stationList[i].mapPoint.lat+'='+$scope.stationList[i].county;
                }
            }
            if($scope.startAddressShow===false){
                $scope.requestStartAdress = requestStartAddressSec;
            }
            if($scope.endAddressShow===true){
                $scope.requestEndAdress = requestEndAddressSec;
            }
            if($scope.backStartAddressShow===true){
                $scope.requestBackStartAdress = requestBackStartAddressSec;
            }
            if($scope.backEndAddressShow===false){
                $scope.requestBackEndAdress = requestBackEndAddressSec;
            }
            if($scope.tripWay==="pickupAirport"||$scope.tripWay==="pickupTrain"){
                requestIsShuttle = 0;
            }else if($scope.tripWay==="dropAirport"||$scope.tripWay==="dropTrain"){
                requestIsShuttle = 1;
            }else{
                requestIsShuttle = 2;
            }
            if($scope.backTripWay==="pickupAirport"||$scope.backTripWay==="pickupTrain"){
                requestBackIsShuttle = 0;
            }else if($scope.backTripWay==="dropAirport"||$scope.backTripWay==="dropTrain"){
                requestBackIsShuttle = 1;
            }else{
                requestBackIsShuttle = 2;
            }
            let requestPackParams;
            let requestParams = {
                cars:$scope.carNumber ||"",//车辆数
                companyCusId:$scope.clientId ||'',//客户id
                dutyService :$scope.ownerPerson ||'',//业务负责人
                epoint :$scope.requestEndAdress||'',//到达地点 成都市双流机场T1=103.961858,30.574378=四川省-成都市-武侯区
                wayNum  :$scope.wayNum ||'',//航班号
                fdTime:$scope.goTime ||'',//起飞降落时间
                isHighSpeed :$scope.isHighSpeed ||0,//是否走高速
                isShuttle :requestIsShuttle,//0接1送2其它
                limitNum:$scope.triffic ||'',//限号
                mainOrderNum:'',//主订单号
                note:$scope.goRemark ||'',//备注
                otherPrice:$scope.otherPrice ||'',//其它费用
                otherPriceNote:$scope.otherPriceNote ||'',//其它费用备注
                reasonTime:$scope.reasonTime||'',//延长时间
                remindRouteCash:$scope.masterMoney||'',//师傅现收
                routeDetail:$scope.routeDetail ||'',//行程详情
                routeLink :$scope.linkName+'-'+$scope.linkPhone ||'',//行车联系人：姓名-15999999999
                routeNo  :1,//行程数 eg：去程1 返程2
                routePrice  :$scope.totalPrice||'',//行程价格
                seats  :$scope.seatNumber ||'',//座位数
                serviceMan  :$scope.serviceMan ||'',//业务员
                spoint  :$scope.requestStartAdress||"",//出发地点 成都市天府广场=104.072811,30.663669=四川省-成都市-武侯区
                stime   :$scope.goTime ||'',//出发时间
                wpoints :requestPassAddress||""//途经地点：成都市成都东站=104.147105,30.634466=四川省-成都市-武侯区
            }
            businessService.addOrderMsg(requestParams).then(function(res){
                if(res.data.code===1){
                    if($scope.backTarckShow === true){
                        requestPackParams = {
                            cars:$scope.backCarNumber ||"",//车辆数
                            companyCusId:$scope.clientId ||'',//客户id
                            dutyService :$scope.ownerPerson ||'',//业务负责人
                            epoint :$scope.requestBackEndAdress||'',//到达地点 成都市双流机场T1=103.961858,30.574378=四川省-成都市-武侯区
                            wayNum  :$scope.backWayNum ||'',//航班号
                            fdTime:$scope.backGoTime ||'',//起飞降落时间
                            isHighSpeed :$scope.backIsHighSpeed ||0,//是否走高速
                            isShuttle :requestBackIsShuttle,//0接1送2其它
                            limitNum:$scope.backTriffic ||'',//限号
                            mainOrderNum:res.data.mainOrderNum,//主订单号
                            note:$scope.backGoRemark ||'',//备注
                            otherPrice:$scope.backOtherPrice ||'',//其它费用
                            otherPriceNote:$scope.backOtherPriceNote ||'',//其它费用备注
                            reasonTime:$scope.backReasonTime||'',//延长时间
                            remindRouteCash:$scope.backMasterMoney||'',//师傅现收
                            routeDetail:$scope.backRouteDetail ||'',//行程详情
                            routeLink :$scope.linkName+'-'+$scope.linkPhone ||'',//行车联系人：姓名-15999999999
                            routeNo  :2,//行程数 eg：去程1 返程2
                            routePrice  :$scope.backTotalPrice||'',//行程价格
                            seats  :$scope.backSeatNumber ||'',//座位数
                            serviceMan  :$scope.serviceMan ||'',//业务员
                            spoint  :$scope.requestBackStartAdress||"",//出发地点 成都市天府广场=104.072811,30.663669=四川省-成都市-武侯区
                            stime   :$scope.backGoTime ||'',//出发时间
                            wpoints :backRequestPassAddress||""//途经地点：成都市成都东站=104.147105,30.634466=四川省-成都市-武侯区
                        }
                        businessService.addOrderMsg(requestPackParams).then(function(res){
                            if(res.data.code===1){
                                $state.go("aep.loc.order_list");
                                $.misMsg(res.data.msg);
                            }else{
                                $.misMsg(res.data.msg);
                            }
                        }).finally(function(){
                            $.misHide3DLoader()
                        });
                    }else{
                        $state.go("aep.loc.order_list");
                        $.misMsg(res.data.msg);
                    }
                    
                }else{
                    $.misMsg(res.data.msg);
                }
            }).finally(function(){
                $.misHide3DLoader()
            });
            
        };
        //截取6位小数
        function formatDecimal(num, decimal) {
            num = num.toString()
            let index = num.indexOf('.');
            if (index !== -1) {
                num = num.substring(0, decimal + index + 1)
            } else {
                num = num.substring(0)
            }
            return parseFloat(num).toFixed(decimal)
        };
        $scope.backPage = function(){
            $state.go("aep.loc.order_list")
        };
        //===============旅游包车订单 start ==============
        function computeTime(v){
            laydate.render({
                elem: '#chartEndDate',
                min:$scope.chartStartDate,
                done: function(value, date, endDate){
                    $scope.chartEndDate = value ||"";
                    $scope.chartEndTime = $scope.chartEndDate+" "+$scope.chartEndTimestamp;
                    computeTime('end')
                },
            });
            let startDay,endDay;
            if($scope.chartStartTime !==''&&$scope.chartStartTime!==null&&$scope.chartStartTime!==undefined&&$scope.chartEndTime !==''&&$scope.chartEndTime!==null&&$scope.chartEndTime!==undefined){
                if($scope.chartStartTime > $scope.chartEndTime){
                    $.misMsg("出发时间不能大于返程时间！")
                }else{
                    if($scope.chartStartTime!==null &&$scope.chartStartTime!==undefined&&$scope.chartStartTime!==''){
                        startDay = Date.parse(new Date($scope.chartStartTime.substring(0,10)));
                    }
                    if($scope.chartEndTime!==null &&$scope.chartEndTime!==undefined&&$scope.chartEndTime!==''){
                        endDay = Date.parse(new Date($scope.chartEndTime.substring(0,10)));
                    }
                    if(v !=='days'&&$scope.chartStartTime!==null &&$scope.chartStartTime!==undefined&&$scope.chartStartTime!==''
                    &&$scope.chartEndTime!==null &&$scope.chartEndTime!==undefined&&$scope.chartEndTime!==''){
                        $scope.chartDays = getNumberOfDays(startDay,endDay);
                        $scope.daysArr = getEveryDays($scope.chartStartTime.substring(0,10),$scope.chartEndTime.substring(0,10));
                        $scope.daysListArr = [];
                        for(let i in $scope.daysArr){
                            let num = Number(i)+Number(1);
                            let info = {
                                name:'第'+num+'天',
                                day:$scope.daysArr[i],
                                type:'',
                                scenicListMsg:'',
                                addressMsg:[],
                                curDayFlag:num
                            }
                            $scope.daysListArr.push(info);
                        }
                    }
                }
            }
            $scope.$apply();
        };
        //两个日期计算天数
        function getNumberOfDays(date1,date2){
            //date1：开始日期，date2结束日期
            var a1 = Date.parse(new Date(date1));
            var a2 = Date.parse(new Date(date2));
            var day = parseInt((a2-a1)/ (1000 * 60 * 60 * 24))+1;//核心：时间戳相减，然后除以天数
            return day
        };
        //===获取两个日期中间每天集合 start=====================
        function getEveryDays(day1, day2) {
            // 获取入参字符串形式日期的Date型日期
            var st = day1.getDate();
            var et = day2.getDate();
            var retArr = [];
            // 获取开始日期的年，月，日
            var yyyy = st.getFullYear(),
                mm = st.getMonth(),
                dd = st.getDate();
            
            // 循环
            while (st.getTime() != et.getTime()) {
                retArr.push(st.getYMD());
                
                // 使用dd++进行天数的自增
                st = new Date(yyyy, mm, dd++);
            }
        
            // 将结束日期的天放进数组
            retArr.push(et.getYMD());
            if(retArr.length>1){
                retArr.splice(0,1)
            }
            return retArr; // 或可换为return ret;
        }
        // 将结果放在数组中，使用数组的join方法返回连接起来的字符串，并给不足两位的天和月十位上补零
        Date.prototype.getYMD = function(){
            return [this.getFullYear(), fz(this.getMonth() + 1), fz(this.getDate())].join("-");
        }
        // 给String对象添加getDate方法，使字符串形式的日期返回为Date型的日期
        String.prototype.getDate = function(){
            var strArr = this.split('-');
            return new Date(strArr[0], strArr[1] - 1, strArr[2]);
        }
        // 给月和天，不足两位的前面补0
        function fz(num) {
            if (num < 10) {
                num = "0" + num;
            }
            return num
        }
        //===获取两个日期中间每天集合 end=====================

        //时间加一天
        function dateAdd(startDate){
            startDate = new Date(startDate);
            startDate = +startDate + 1000*60*60*24;
            startDate = new Date(startDate);
            var nextStartDate = fz(startDate.getFullYear())+"-"+fz((startDate.getMonth()+1))+"-"+fz(startDate.getDate())+" "+fz(startDate.getHours())+":"+fz(startDate.getMinutes());
            return nextStartDate;
        };
        //时间加十小时
        function timeAdd(startDate){
            startDate = new Date(startDate);
            startDate = +startDate + 1000*60*60*10;
            startDate = new Date(startDate);
            var nextStartDate = fz(startDate.getFullYear())+"-"+fz((startDate.getMonth()+1))+"-"+fz(startDate.getDate())+" "+fz(startDate.getHours())+":"+fz(startDate.getMinutes());
            return nextStartDate;
        };
        $scope.chartTempDataArr = [];
        $scope.actionIndex = function(index,obj){
            $scope.isActive = index;
            $scope.scenicGatherArr = [];
            for(let i in $scope.daysListArr[$scope.isActive].addressMsg){
                let info = {
                    addressDetail:$scope.daysListArr[$scope.isActive].addressMsg[i].addressDetail,
                    LatLng:$scope.daysListArr[$scope.isActive].addressMsg[i].LatLng,
                    areaAll:$scope.daysListArr[$scope.isActive].addressMsg[i].areaAll
                }
                $scope.scenicGatherArr.push(info);
            }
            if(hasValue($scope.chartTempDataArr,obj)===true){
                for(let i in $scope.chartTempDataArr){
                    if(Number(obj.curDayFlag)===$scope.chartTempDataArr[i].curDay){
                        $scope.chartStartTimeRes = $scope.chartTempDataArr[i].stime;
                    }
                }
            }else{
                let arrTemp = [];
                for(let i in $scope.chartTempDataArr){
                    arrTemp.push($scope.chartTempDataArr[i].curDay)
                }
                let dayTemp = arrTemp.sort(function (a, b) {return a-b;})
                for(let i in $scope.chartTempDataArr){
                    if(dayTemp[dayTemp.length-1]===$scope.chartTempDataArr[i].curDay){
                        $scope.chartStartTimeRes = dateAdd($scope.chartTempDataArr[i].stime)
                    }
                }
                
            }
            
            // $scope.chartStartTimeRes = $scope.chartStimeRecord[$scope.isActive]||'';
        };
        //判断是否是已经添加的行程天数
        function hasValue(arr,obj){
            for(let i in arr){
                if(Number(arr[i].curDay) == Number(obj.curDayFlag)){
                    return true;
                }  
            }
            return false;
        };
        $scope.actionInfoIndex = function(index,obj){
            $scope.isActiveInfo = index;
            $scope.daysListArr[$scope.isActive].type = obj.name;
            $scope.ywTypeRes = obj.id;
        };
        //获取区县
        $scope.getCountyList = function(obj){
            $scope.countyNameAll = obj;
            let requestPackParams = {
                city:obj
            }
            businessService.getCountyList(requestPackParams).then(function(res){
                if(res.data.code===1){
                    $scope.countyList = res.data.data;
                }else{
                    $.misMsg(res.data.msg);
                }
            })
        };
        $scope.chooseScenic = function(){
            $scope.chartScenicName = '';
            let request = {
                cityName:$scope.countyNameAll,
                countyName:$scope.recommendArea
            }
            businessService.getCountyJdList(request).then(function(res){
                if(res.data.code===1){
                    $scope.countyJdList = res.data.data;
                    // angular.forEach($scope.countyJdList,function(data){
                    //     $('#driveType_select').append("<option value="+data.id+">"+data.mapAddr+"</option>");
                    //     $('#driveType_select').selectpicker('refresh');
                    //     $('#driveType_select').selectpicker('render');
                    // })
                }else{
                    $.misMsg(res.data.msg);
                }
            })
        };
        $scope.chooseScenicSure = function(){
            for(let i in $scope.countyJdList){
                if(Number($scope.chartScenicName)===$scope.countyJdList[i].id){
                    let info = {
                        addressDetail:$scope.countyJdList[i].mapAddr,
                        LatLng:$scope.countyJdList[i].lngLat,
                        areaAll:$scope.countyJdList[i].city+"-"+$scope.countyJdList[i].county
                    }
                    $scope.scenicGatherArr.push(info);
                    $scope.daysListArr[$scope.isActive].addressMsg.push(info);
                }
            }
            let addressMsgListArr = [];
            for(let i in $scope.daysListArr[$scope.isActive].addressMsg){
                addressMsgListArr.push($scope.daysListArr[$scope.isActive].addressMsg[i].addressDetail)
            }
            $scope.daysListArr[$scope.isActive].scenicListMsg = addressMsgListArr.join(" | ");
        };
        // $scope.getCountyList();
        $scope.confirmScenic = function(){
            $scope.chartScenicAdress = "";
        };
        $scope.deleteScenic = function(obj){
            for(let i in $scope.scenicGatherArr){
                if(obj.addressDetail===$scope.scenicGatherArr[i].addressDetail){
                    $scope.scenicGatherArr.splice(i,1)
                }
            }
            for(let i in $scope.daysListArr[$scope.isActive].addressMsg){
                if(obj.addressDetail===$scope.daysListArr[$scope.isActive].addressMsg[i].addressDetail){
                    $scope.daysListArr[$scope.isActive].addressMsg.splice(i,1)
                }
            }
            let addressMsgListArr = [];
            for(let i in $scope.daysListArr[$scope.isActive].addressMsg){
                addressMsgListArr.push($scope.daysListArr[$scope.isActive].addressMsg[i].addressDetail)
            }
            $scope.daysListArr[$scope.isActive].scenicListMsg = addressMsgListArr.join(" | ");
        };
        function chartLoadMapAutocomplete (suggestId,adressId){
            // var c=document.getElementById(suggestId).value;
            function G(id) {
                return document.getElementById(id);
            }
            var map = new BMap.Map("l-map");
            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {"input" : suggestId
                ,"location" : map
            });
            
            // ac.setInputValue(c);
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
                G(adressId).innerHTML = str;
            });
            var myValue,addressDetail,addressDetail,areaCity,LatLng,areaAll;
            var localSearch = new BMap.LocalSearch(map);
            ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                //详细地址
                addressDetail = myValue;
                //城市区域
                areaCity = _value.city + '-'+ _value.district;
                G(adressId).innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                // setPlace();

                var keyword = myValue;
                localSearch.setSearchCompleteCallback(function (searchResult) {
                    
                    var poi = searchResult.getPoi(0);
                            // 经纬度
                    LatLng = formatDecimal(poi.point.lng,6)+','+formatDecimal(poi.point.lat,6);
                            //省市区
                    areaAll = poi.province+'-'+areaCity;
                            //传参数据
                    
                    let info = {
                            addressDetail:addressDetail,
                            LatLng:LatLng,
                            areaAll:areaAll,
                        }
                        if(suggestId==='chartScenicSuggestId'){
                            $scope.scenicGatherArr.push(info)
                            $scope.daysListArr[$scope.isActive].addressMsg.push(info);
                            // let addressDetailArr = [];
                            // for(let i in $scope.scenicGatherArr){
                            //     addressDetailArr.push($scope.scenicGatherArr[i].addressDetail)
                            //     $scope.daysListArr[$scope.isActive].addressMsg.push(info);
                            // }
                            let addressMsgListArr = [];
                            for(let i in $scope.daysListArr[$scope.isActive].addressMsg){
                                addressMsgListArr.push($scope.daysListArr[$scope.isActive].addressMsg[i].addressDetail)
                            }
                            $scope.daysListArr[$scope.isActive].scenicListMsg = addressMsgListArr.join(" | ");
                        }else if(suggestId==='chartEndSuggestId'){
                            $scope.chartEndAdressRes = info.addressDetail +'='+info.LatLng +'='+info.areaAll;
                            $scope.chartEndAdress = info.addressDetail;
                        }else if(suggestId==='chartStartSuggestId'){
                            $scope.chartStartAdressRes = info.addressDetail +'='+info.LatLng +'='+info.areaAll;
                            $scope.getCountyList(poi.city);
                        }
                                            
            });
                localSearch.search(keyword);
            });
        };
        //保存包车行程临时数据
        $scope.chartSaveItems = function(){
            let isHighSpeedRes,scenicGatherRes,scenicGatherResArr = [];
            if($scope.isHighSpeed===true){
                isHighSpeedRes = 1;
            }else{
                isHighSpeedRes = 0;
            }
            if($scope.scenicGatherArr.length !==0){
                for(let i in $scope.scenicGatherArr){
                    scenicGatherResArr.push($scope.scenicGatherArr[i].addressDetail+'='+$scope.scenicGatherArr[i].LatLng+'='+$scope.scenicGatherArr[i].areaAll)
                }
                scenicGatherRes = scenicGatherResArr.join(';')
            }else{
                scenicGatherRes = "";
            }
            if($scope.chartStartTimeRes===""){
                $scope.chartStartTimeRes = $scope.chartStartTime;
            }
            if(($scope.isActive+1)===$scope.daysListArr.length){
                $scope.endTimeRes = $scope.chartEndTime;
            }else{
                $scope.endTimeRes = timeAdd($scope.chartStartTimeRes);
            }
            $scope.chartStimeRecord[$scope.isActive] = $scope.chartStartTimeRes;
            $.misShow3DLoader()
            let requestPackParams = {
                cars:$scope.chartCars||2,//车辆数
                curDay:$scope.isActive+1||"1",//行程数
                epoint:$scope.chartEndAdressRes ||"",//到达地点
                etime:$scope.endTimeRes||"",//结束时间
                isHighSpeed:isHighSpeedRes,//是否走高速
                limitNum:$scope.chartLimitNum ||'',//限号
                mainOrderNum:$scope.mainOrderNum ||'',//主订单号
                note:$scope.chartNote ||'',//备注
                otherPrice:$scope.chartOtherPrice ||'',//其它费用
                otherPriceNote:$scope.chartOtherPriceNote ||'',//其它费用说明
                remindRouteCash:$scope.chartRemindRouteCash ||'',//提醒师傅现收
                routeDetail:$scope.chartRouteDetail ||'',//行程详情
                routeLink:$scope.chartLinkName +'-'+$scope.chartLinkPhone||'',
                routePrice:$scope.chartRoutePrice||'',//行程价格
                seats:$scope.chartSeats||'',//座位数
                spoint:$scope.chartStartAdressRes ||"",//出发点
                stime:$scope.chartStartTimeRes ||'',//出发时间
                wpoints:scenicGatherRes ||'',//途经点
                ywType:$scope.ywTypeRes ||''//1-周边游；2-市内一日游；3-周边一日游；
            }
            $scope.chartTempDataArr.push(requestPackParams);
            businessService.addCharteredOrderMsg(requestPackParams).then(function(res){
                if(res.data.code===1){
                    let routeInfo = {
                        curDay:requestPackParams.curDay,
                        spoint:(requestPackParams.spoint).split('=')[0],
                        epoint:requestPackParams.epoint.split('=')[0],
                        index:$scope.isActive,
                        stime:requestPackParams.stime,
                        etime:requestPackParams.etime,
                    }
                    $scope.routeMsgArr.push(routeInfo);
                    for(let i=0;i<$scope.routeMsgArr.length;i++){
                        for(let j=i+1;j<$scope.routeMsgArr.length;j++){
                            if($scope.routeMsgArr[i].curDay === $scope.routeMsgArr[j].curDay){         //第一个等同于第二个，splice方法删除第二个
                                $scope.routeMsgArr.splice(i,1);
                                j--;
                            }
                        }
                    }
                    //$state.go("aep.loc.order_list");
                    if(($scope.isActive+1)===$scope.daysListArr.length){
                        $scope.savaBtnShow = true;
                    }
                    $scope.chartStartTimeRes = dateAdd($scope.chartStartTimeRes);
                    $scope.isActive++;
                    $scope.scenicGatherArr = [];
                    $scope.chartEndAdress = "";
                    $scope.mainOrderNum = res.data.mainOrderNum;
                    $scope.chartStartAdressRes = $scope.chartEndAdressRes;
                    $scope.chartEndAdressRes = "";
                    

                    $.misMsg(res.data.msg);
                    
                }else{
                    $.misMsg(res.data.msg);
                }
            }).finally(function(){
                $.misHide3DLoader()
            });
        };
        //保存包车数据
        $scope.charteredSaveData = function(){
            let requestPackParams = {
                companyCusId :$scope.clientId ||'',
                dutyService :$scope.ownerPerson||'',
                mainOrderNum :$scope.mainOrderNum||'',
                routeLink :$scope.chartLinkName +"-"+$scope.chartLinkPhone,
                serviceMan :$scope.serviceMan||''
            }
            businessService.addChartMainOrderMsg(requestPackParams).then(function(res){
                if(res.data.code===1){
                    $state.go("aep.loc.order_list");
                    $.misMsg(res.data.msg);
                    
                }else{
                    $.misMsg(res.data.msg);
                }
            }).finally(function(){
                $.misHide3DLoader()
            });
        };
        //===============旅游包车订单 end ================
        $scope.init();
        $.datetimepicker.setLocale('ch');
        $('#goTime,#backGoTime').datetimepicker({
            format: "Y-m-d H:i",      //格式化日期
            timepicker: true,    //打开时间选项
            todayButton: true,
            minDate: new Date(),
            step: 30,  //时间间隔为1
        });

        $scope.chartStartTimestamp = '07:00';
        $scope.chartStartDate = "";
        $scope.chartEndTimestamp = '19:00';
        $scope.chartEndDate = "";
        let todayDate = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
        //包车出发时间
        laydate.render({
            elem: '#chartStartDate',
            min:todayDate,
            done: function(value, date, endDate){
                $scope.chartStartDate = value ||"";
                $scope.chartStartTime = $scope.chartStartDate+" "+$scope.chartStartTimestamp;
                computeTime('start')
            },
        });
        laydate.render({
            elem: '#chartStartTimestamp',
            type: 'time',
            format: 'HH:mm',
            value:'07:00',
            done: function(value, date, endDate){
                $scope.chartStartTimestamp = value||'07:00';
                $scope.chartStartTime = $scope.chartStartDate+" "+$scope.chartStartTimestamp;
                computeTime('start')
            },
            ready: formatminutes
        });
        //包车返程时间
        // laydate.render({
        //     elem: '#chartEndDate',
        //     min:$scope.chartStartDate,
        //     done: function(value, date, endDate){
        //         $scope.chartEndDate = value ||"";
        //         $scope.chartEndTime = $scope.chartEndDate+" "+$scope.chartEndTimestamp;
        //         computeTime('end')
        //     },
        // });
        laydate.render({
            elem: '#chartEndTimestamp',
            type: 'time',
            format: 'HH:mm',
            value:'19:00',
            done: function(value, date, endDate){
                $scope.chartEndTimestamp = value ||"19:00";
                $scope.chartEndTime = $scope.chartEndDate+" "+$scope.chartEndTimestamp;
                computeTime('end')
            },
            ready: formatminutes
        });

        function formatminutes(date){
            var aa = $(".laydate-time-list li ol")[1];
            var showtime = $($(".laydate-time-list li ol")[1]).find("li");
            for (var i = 0; i < showtime.length; i++) {
                var t00 = showtime[i].innerText;
                if (t00 != "00" && t00 != "10" && t00 != "20" && t00 != "30" && t00 != "40" && t00 != "50") {
                showtime[i].hidden = true;
                }
            }
            $($(".laydate-time-list li ol")[2]).find("li").remove(); //清空秒 
        }
        
        
        
        // let cityName = new Vcity.CitySelector({input:'citySelect'});
        // console.log(cityName)
    }])