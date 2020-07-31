'use strict';

financeModule.controller('mainReimCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService','officeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService,officeService) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        $scope.params.flag==='add'?$scope.title = "添加凭证记录":$scope.title ="编辑凭证记录";

         //日期选择
         $('#gainTime').datetimepicker({
            format: "Y-m-d",      //格式化日期
            timepicker: false,    //打开时间选项
            todayButton: true,
            step: 1,  //时间间隔为1  分钟
        });
        $scope.backPage = function(){
        $state.go("aep.loc.main_reim");
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
                console.log($scope.feeCourseList)
                // $scope.transTreeData($scope.feeCourseList);
                // console.log( $scope.feeCourseList);
            })
        };

        // 获取凭证摘要列表
        $scope.findReimRemarks = function(){
            financeService.findReimRemarks().then(function(res){
                $scope.datas = res.data.data;
                $scope.remarksList = res.data.data;
            })
        };

        // 获取焦点选择框出现
        $scope.focusRemark = function(){
            if($scope.remarksList !=''){
                $scope.remarkSelectShow = true;
            }
            $scope.remarksList = $scope.datas;
            
        }
        
        //将下拉选的数据值赋值给文本框
        $scope.optionClick = function(){
            $scope.remarkSelectShow = false;
            $scope.remark = $scope.remarkSelectList;
        }
        $scope.remarkSelect1 = function(){
            $scope.remark = $scope.remarkSelectList;
            
        }

        //获取的数据值与下拉选逐个比较，如果包含则放在临时变量副本，并用临时变量副本替换下拉选原先的数值，如果数据为空或找不到，就用初始下拉选项副本替换
        $scope.changeKeyValue=function(v){
            var newDate=[]; //临时下拉选副本
        //如果包含就添加
        angular.forEach($scope.remarksList ,function(data){
           if(data.indexOf(v)>=0){
            newDate.unshift(data);
            }
        });
        //用下拉选副本替换原来的数据
        $scope.remarksList=newDate;
        //如果不包含或者输入的是空字符串则用初始变量副本做替换
            if($scope.remarksList.length==0 || ''==v){
                $scope.remarksList=$scope.datas;
                $scope.remarkSelectShow = false;
            }else if(v !=''){
                $scope.remarkSelectShow = true;
                $scope.remarkSelectList = '';
            }
        };

        // 获取报销人账号
        $scope.getCustomBaseInfo = function(){
            financeService.getCustomBaseInfo().then(function(res){
                if(res.data.code===1){
                    $scope.unameList = res.data.data;
                }
            })
        };
        // 摘要
        $scope.remarkSelect = function(){
             $scope.remark = $scope.remarkSelectList;
        }
        $scope.imgUrlArr = {  //图片base64集合
            idCardFrontImgUrl:[],
        };
        $scope.resFileUrl = {  //服务器返回图片路径集合
            idCardFrontImgUrl:'',
        };
        $scope.addPic = function (v) {
            document.getElementById(v).click();
        };
        $scope.multipleFileUpload = function(e,id){
            let file = document.querySelector('input[id='+id+']').files;
                lrz(file[0]).then(function (rst) {        //获取图片base64编码，用于页面展示
                    $scope.imgUrlArr.idCardFrontImgUrl.splice(0,1,rst.base64);
                    $scope.$apply($scope.imgUrlArr.idCardFrontImgUrl);
                    return rst;
                })
                
            let formData = new FormData();
                formData.append('file', file[0]);  //获取图片文件流格式参数
                formData.append('userName', userMsg.company.baseUserId.uname); //加入参数userName
    
            officeService.imgUpload(formData).then(function(res){    //接口调用
                if(res.data.code===1){
                    $scope.resFileUrl.idCardFrontImgUrl = res.data.url;
                }else{
                    $.misMsg(res.data.msg);
                }
            })
        };


        //查询凭证信息
        $scope.findReimById = function(){
            let requestParams = {
                id:$scope.params.mainReimId ||''
            }
           financeService.findReimById(requestParams).then(function(res){
               console.log(res)
                if(res.data.code===1){
                    let result = res.data.data;
                    console.log(result)
                    $scope.datasList = result.courseTrades;
                    console.log(res.data.data);
                     /** 记账时间 */
                     $scope.gainTime = result.addTime; 
                }
            })
        }

        $scope.remarkEdit = function(obj){
            console.log(obj)
            $scope.modifyFeeCourseArr = [];
            console.log((obj.feeCourseId.id)+'='+(obj.remark));
            $scope.modifyFeeCourseArr.push((obj.feeCourseId.id)+'='+(obj.remark))
        }

        // 添加/修改凭证记录
        $scope.saveData = function(obj){
            if($scope.params.flag === 'edit'){
                // 修改-提交
                // let feeCourseIdArr = [];
                // angular.forEach($scope.datasList,function(item){
                //     feeCourseIdArr.push(item.feeCourseId.id)
                // })
                // let feeCourseIdXg = [];
                // let xgId = []
                // angular.forEach($scope.conId,function(data){
                //     feeCourseIdXg.push(data)
                // })
                // console.log(feeCourseIdXg);
                // $scope.modifyFeeCourse =feeCourseIdXg.join("@");
                // console.log($scope.modifyFeeCourse)
                $scope.modifyFeeCourse =$scope.modifyFeeCourseArr.join("@");
                let requestParams = {
                    /** id */
                    updId:$scope.params.mainReimId,
                    /** 科目id,多条科目@ 拼接 */
                    modifyFeeCourse: $scope.modifyFeeCourse,
                    /** 记账时间 */
                    gainTime: $scope.gainTime,
                }
                financeService.modifyReim(requestParams).then(function(res){
                    if(res.data.code ===1){
                        $state.go("aep.loc.main_reim");
                        $.misMsg(res.data.msg);
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
                
            }else{
                 // 添加-提交
                //  let rr =  ($scope.feeCourseId).toString()
                //  let requestParams = {
                //     /** 科目id,多条科目逗号拼接 */
                //     feeCourseId: rr,
                //     /** 记账时间 */
                //     gainTime: $scope.gainTime || "",
                //     /** 摘要 */
                //     remark: $scope.remark || "",
                //     /** 金额 */
                //     totalMoney : $scope.totalMoney  || "",
                //     /** 报销人账号 */
                //     uname : $scope.uname  || "",
                //     /** 账号 */
                //     voucherUrl: $scope.resFileUrl.idCardFrontImgUrl ||"",  
                // }
                // financeService.adupReimburse(requestParams).then(function(res){
                //     if(res.data.code ===1){
                //         $state.go("aep.loc.reim_list");
                //         $.misMsg(res.data.msg);
                //     }else{
                //         $.misMsg(res.data.msg);
                //     }
                // })
                            
                   
                
                
            }
        };

        ($scope.init = function(){
            // bodyevent("#typenum","#makeupCo");
            $scope.findCourses();
            // $scope.findReimRemarks();
            // $scope.findBankList();
            $scope. getCustomBaseInfo();
            if($scope.params.flag==='edit'){
                $scope.findReimById();
            }else if($scope.params.flag==='add'){
                // $scope.tradeStatus = "0" // 默认收入
            }
        })();
    }])