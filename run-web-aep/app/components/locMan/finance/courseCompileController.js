'use strict';

financeModule.controller('courseCompileController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService) {
        $scope.params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        // console.log(userMsg)
        $scope.params.flag==='add'?$scope.title = "添加科目":$scope.title ="编辑科目";
        $scope.courseStatus = '0';
        $scope.courseType = '0'
        let params = $state.params;
        
        $scope.level = params.level;
        // $scope.levelName = params.levelName;
        $scope.parentid = params.parentid;
        if(params.levelName == '资产类'){
            $scope.courseCategory = "PROPERTY";
        }else if(params.levelName == '负债类'){
            $scope.courseCategory = "DEBT";
        }else if(params.levelName == '权益类'){
            $scope.courseCategory = "LEGAL";
        }else if(params.levelName == '损益类'){
            $scope.courseCategory = "LOSSES";
        }else if(params.levelName == '成本类'){
            $scope.courseCategory = "COST";
        }
        
        $scope.backPage = function(){
        $state.go("aep.loc.course_list");
        };

        $scope.jc = function(){
            if($scope.courseName == undefined){
                $scope.pinyinSimple = ''
            }else{
                $scope.pinyinSimple = Pinyin.GetJP($scope.courseName);
            }
        }
       
        $scope.getCourseById = function(){
            let requestParams = {
                id:$scope.params.courseId ||''
            }
           financeService.getCourseById(requestParams).then(function(res){
                console.log(res)
                if(res.data.code===1){
                    let result = res.data.data;
                    /** 科目编码 */
                    $scope.courseNum  = result.courseNum;
                    /** 科目名称 */
                    if($scope.level == 1){
                        $scope.courseName = result.courseName;
                    }else{
                        $scope.courseName = result.courseName.split('-')[result.courseName.split('-').length - 1];
                    }
                    /** 科目简拼 */
                    $scope.pinyinSimple= result.pinyinSimple;
                    /** 科目类别 */
                    $scope.courseCategory= result.courseCategory;
                    /** 状态 */
                    $scope.courseStatus= (result.courseStatus).toString();
                    /** 收支 */
                    $scope.courseType = (result.courseType).toString();
                    $scope.level = result.level;
                    if(result.parentCourseId == undefined){
                        $scope.parentId = null;
                    }else{
                        $scope.parentId = result.parentCourseId.id;
                    }
                    $scope.addTime = result.addTime;
                    $scope.unitNum = result.unitNum;
                }
            })
        }


        // 添加/修改科目
        $scope.saveData = function(){
            // if($scope.level == 1){
            //     $scope.courseNames = $scope.courseName
            // }else{
            //     if($scope.level == 2){
            //         $scope.courseNames = ($scope.levelName.split('-'))[0]+"-"+ $scope.courseName
            //     }else{
            //         $scope.courseNames = $scope.levelName.split('-')[$scope.levelName.split('-').length - 3]+"-"+$scope.levelName.split('-')[$scope.levelName.split('-').length - 2]+"-"+ $scope.courseName
            //     }
            // }
            if($scope.params.flag === 'edit'){
                // 检验科目名称是否可用
                let checkParams = {
                    /** 科目名称 */
                    courseName:$scope.courseName,
                    courseId:parseInt($scope.params.courseId),
                    level:parseInt($scope.level)
                }
                financeService.checkCourseName(checkParams).then(function(res){
                    if(res.data.code ===1){
                        // 修改-提交
                        let requestParams = {
                            upId:parseInt($scope.params.courseId),
                            /** 科目编码 */
                            courseNum: $scope.courseNum,
                            /** 科目名称 */
                            courseName: $scope.courseName,
                            /** 科目简拼 */
                            pinyinSimple: $scope.pinyinSimple,
                            /** 科目类别 */
                            courseCategory: $scope.courseCategory,
                            /** 状态 */
                            courseStatus: $scope.courseStatus,
                            /** 收支 */
                            courseType: parseInt($scope.courseType),
                            // level:$scope.level,
                            // parentCourseId:$scope.parentid,
                            // unitNum: $scope.unitNum,
                            // addTime: $scope.addTime,
                            // isLastCourse:'1'
                        }
                        financeService.updateCourse(requestParams).then(function(res){
                            if(res.data.code ===1){
                                $state.go("aep.loc.course_list");
                                $.misMsg(res.data.msg);
                            }else{
                                $.misMsg(res.data.msg);
                            }
                        })
                    }
                    else{
                        $.misMsg(res.data.msg);
                    }
                })
            }else{
                // if($scope.level == '1'){
                //     $scope.courseNames = $scope.courseName
                // }else{
                //     $scope.courseNames = $scope.levelName+"-"+$scope.courseName
                // }
                // 检验科目名称是否可用
                let checkParams = {
                    /** 科目名称 */
                    courseName:$scope.courseName,
                    courseId:null,
                    level:parseInt($scope.level)
                }
                financeService.checkCourseName(checkParams).then(function(res){
                    if(res.data.code ===1){
                        if($scope.level == '1'){
                             // 添加-提交
                            let requestParams = {
                                /** 科目名称 */
                                courseName:$scope.courseName,
                                /** 科目简拼 */
                                pinyinSimple: $scope.pinyinSimple,
                                /** 科目类别 */
                                courseCategory: $scope.courseCategory,
                                /** 状态 */
                                courseStatus: $scope.courseStatus,
                                /** 收支 */
                                courseType: $scope.courseType,
                                level:$scope.level,
                                parentId:$scope.parentid,
                                /** 父级关联的银行记录id */
                                bankIds:$scope.bankIds || "",
                                /** 父级关联的科目交易记录id */
                                fctIds:$scope.fctIds || ""
                            }
                            financeService.addFeeCourse(requestParams).then(function(res){
                                if(res.data.code ===1){
                                    $state.go("aep.loc.course_list");
                                    $.misMsg(res.data.msg);
                                }else{
                                    $.misMsg(res.data.msg);
                                }
                            })
                        }else{
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
                                        courseName:$scope.courseName,
                                        /** 科目简拼 */
                                        pinyinSimple: $scope.pinyinSimple,
                                        /** 科目类别 */
                                        courseCategory: $scope.courseCategory,
                                        /** 状态 */
                                        courseStatus: $scope.courseStatus,
                                        /** 收支 */
                                        courseType: $scope.courseType,
                                        level:$scope.level,
                                        parentId:$scope.parentid,
                                        /** 父级关联的银行记录id */
                                        bankIds:$scope.bankIds || "",
                                        /** 父级关联的科目交易记录id */
                                        fctIds:$scope.fctIds || ""
                                    }
                                    financeService.addFeeCourse(requestParams).then(function(res){
                                        if(res.data.code ===1){
                                            $state.go("aep.loc.course_list");
                                            $.misMsg(res.data.msg);
                                        }else{
                                            $.misMsg(res.data.msg);
                                        }
                                    })
                                }else{
                                    $.misMsg(res.data.msg);
                                }
                            })
                        }
                    }else{
                        $.misMsg(res.data.msg);
                    }
                })
            }








            // if($scope.level == 1){
            //     $scope.courseNames = $scope.courseName
            // }else{
            //     if($scope.level == 2){
            //         $scope.courseNames = ($scope.levelName.split('-'))[0]+"-"+ $scope.courseName
            //     }else{
            //         $scope.courseNames = $scope.levelName.split('-')[$scope.levelName.split('-').length - 3]+"-"+$scope.levelName.split('-')[$scope.levelName.split('-').length - 2]+"-"+ $scope.courseName
            //     }
            // }
            // if($scope.params.flag === 'edit'){
            //     // 检验科目名称是否可用
            //     let checkParams = {
            //         /** 科目名称 */
            //         courseName:$scope.courseNames,
            //         courseId:parseInt($scope.params.courseId)
            //     }
            //     financeService.checkCourseName(checkParams).then(function(res){
            //         if(res.data.code ===1){
            //             // 修改-提交
            //             let requestParams = {
            //                 id:parseInt($scope.params.courseId),
            //                 /** 科目编码 */
            //                 courseNum: $scope.courseNum,
            //                 /** 科目名称 */
            //                 courseName: $scope.courseNames,
            //                 /** 科目简拼 */
            //                 pinyinSimple: $scope.pinyinSimple,
            //                 /** 科目类别 */
            //                 courseCategory: $scope.courseCategory,
            //                 /** 状态 */
            //                 courseStatus: $scope.courseStatus,
            //                 /** 收支 */
            //                 courseType: parseInt($scope.courseType),
            //                 level:$scope.level,
            //                 parentId:$scope.parentid,
            //                 unitNum: $scope.unitNum,
            //                 addTime: $scope.addTime,
            //                 isLastCourse:'1'
            //             }
            //             financeService.updateCourse(requestParams).then(function(res){
            //                 if(res.data.code ===1){
            //                     $state.go("aep.loc.course_list");
            //                     $.misMsg(res.data.msg);
            //                 }else{
            //                     $.misMsg(res.data.msg);
            //                 }
            //             })
            //         }
            //         else{
            //             $.misMsg(res.data.msg);
            //         }
            //     })
            // }else{
            //     if($scope.level == '1'){
            //         $scope.courseNames = $scope.courseName
            //     }else{
            //         $scope.courseNames = $scope.levelName+"-"+$scope.courseName
            //     }
            //     // 检验科目名称是否可用
            //     let checkParams = {
            //         /** 科目名称 */
            //         courseName:$scope.courseNames,
            //         courseId:null,
            //     }
            //     financeService.checkCourseName(checkParams).then(function(res){
            //         if(res.data.code ===1){
            //              // 添加-提交
            //             let requestParams = {
            //                 /** 科目名称 */
            //                 courseName:$scope.courseNames,
            //                 /** 科目简拼 */
            //                 pinyinSimple: $scope.pinyinSimple || "",
            //                 /** 科目类别 */
            //                 courseCategory: $scope.courseCategory,
            //                 /** 状态 */
            //                 courseStatus: $scope.courseStatus || "",
            //                 /** 收支 */
            //                 courseType: $scope.courseType || "",
            //                 level:$scope.level,
            //                 parentId:$scope.parentid,
            //             }
            //             financeService.addFeeCourse(requestParams).then(function(res){
            //                 if(res.data.code ===1){
            //                     $state.go("aep.loc.course_list");
            //                     $.misMsg(res.data.msg);
            //                 }else{
            //                     $.misMsg(res.data.msg);
            //                 }
            //             })
            //         }else{
            //             $.misMsg(res.data.msg);
            //         }
            //     })
            // }
        };

        ($scope.init = function(){
            if($scope.params.flag==='edit'){
                $scope.getCourseById();
            }else if($scope.params.flag==='add'){
                if($scope.level == '1'){
                    $scope.levelSelectShow = false;
                }else if($scope.level == '2' || $scope.level == '3' ){
                    $scope.levelSelectShow = true;
                }
                // $scope.levelSelectShow = true;
                // console.log($scope.levelName)
            }
        })();


        
    }])