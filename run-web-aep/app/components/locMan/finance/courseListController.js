'use strict';

financeModule.controller('courseListController', [
    '$scope', '$rootScope','$state', '$http', '$cookies', 'appSettings','financeService',
    function ($scope, $rootScope,$state, $http, $cookies,appSettings,financeService,) {
        let params = $state.params;
        let userMsg = JSON.parse($cookies.get(appSettings.userMsg)) || '';
        //日期选择
        $.datetimepicker.setLocale('ch');
        $('#sTime,#eTime').datetimepicker({
            format: "Y-m-d H:i:s",      //格式化日期
            timepicker: true,    //打开时间选项
            todayButton: true,
            // step: 1,  //时间间隔为1  分钟
        });
        
        $scope.keyword = params.keyword ||'';
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
        // 状态
        $scope.courseStatusArr = [
            {id:'0',name:'可用'},
            {id:'1',name:'不可用'},
        ]; 
        // 收支
        $scope.courseTypeArr = [
            {id:'0',name:'收入'},
            {id:'1',name:'支出'},
        ]; 
        // 类别状态
        $scope.courseCategoryArr = [
            {id:'PROPERTY',name:'资产类'},
            {id:'DEBT',name:'负债类'},
            {id:'LEGAL',name:'权益类'},
            {id:'LOSSES',name:'损益类'},
            {id:'COST',name:'成本类'},
        ]; 
        $scope.model = {
            pageState: $state.current.name,
            empty: false,
            error: false
        };

        

        $scope.findFeeCourses = function(){
            $.misShowLoader();
            let requestParams = {
                page:parseInt(params.page) || 1,
                rows:parseInt(params.size) || 12,
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
                // console.log(res)
                $scope.result = res.data;
                if(res.data.code===1){
                    $scope.gridOptions.data = $scope.result.data;
                    $scope.model.totalCount = $scope.result.count;
                    $scope.model.totalPage = Math.ceil($scope.result.count/parseInt(params.size));
                    $scope.model.pageNo = parseInt(params.page) ||1;
                    $scope.model.pageSize = parseInt(params.size) ||12;
                    angular.forEach($scope.gridOptions.data, function(item){
                        angular.forEach($scope.courseStatusArr, function(data){
                            if((data.id).toString()===(item.courseStatus).toString())item.courseStatus = data.name;
                        });
                        angular.forEach($scope.courseTypeArr, function(data){
                            if((data.id).toString()===(item.courseType).toString())item.courseType = data.name;
                        });
                        angular.forEach($scope.courseCategoryArr, function(data){
                            if(data.id===item.courseCategory)item.courseCategory = data.name;
                        });
                    });
                }
            },function () {
                $scope.model.error = true;
            }).finally(function () {
                $.misHideLoader();
                $scope.model.empty = $scope.result === null || $scope.result.data === null || $scope.result.data.length === 0;
            });
            $scope.gridOptions.columnDefs = [
                {name: 'courseNum', displayName: '科目编码',minWidth: 80, enablePinning: true,
                cellTemplate: `<div ng-if="row.entity.level === 1" class="title-place">{{row.entity.courseNum}}</div>
                <div ng-if="row.entity.level === 2" class="title-place-two">{{row.entity.courseNum}}</div>
                <div ng-if="row.entity.level === 3" class="title-place-three">{{row.entity.courseNum}}</div>`},
                {name: 'courseName', displayName: '科目名称',minWidth: 100, enablePinning: false,
                cellTemplate: `<div ng-if="row.entity.level === 1" class="title-place">{{row.entity.courseName}}</div>
                <div ng-if="row.entity.level === 2" class="title-place-two">{{row.entity.courseName}}</div>
                <div ng-if="row.entity.level === 3" class="title-place-three">{{row.entity.courseName}}</div>`},
                {name: 'pinyinSimple', displayName: '科目简拼',minWidth: 100, enablePinning: false,
                cellTemplate: `<div ng-if="row.entity.level === 1" class="title-place">{{row.entity.pinyinSimple}}</div>
                <div ng-if="row.entity.level === 2" class="title-place-two">{{row.entity.pinyinSimple}}</div>
                <div ng-if="row.entity.level === 3" class="title-place-three">{{row.entity.pinyinSimple}}</div>`},
                {name: 'courseCategory', displayName: '科目类别',minWidth: 100, enablePinning: false},
                {name: 'courseStatus', displayName: '状态',minWidth: 100, enablePinning: false},
                {name: 'courseType', displayName: '收支',minWidth: 100, enablePinning: false},
                {name: 'addTime', displayName: '添加时间',minWidth: 100, enablePinning: false},
                // {
                //     name: '操 作', width: 120,enableColumnMoving: false,pinnedRight:true,enablePinning: false,cellClass: 'grid-status-label',
                //     cellTemplate: `<a class="handle-click-a" ng-click="grid.appScope.lookSubOrder(row.entity)">查看子订单</a>`
                // },
                {
                    name: '操 作', width: 200,enableColumnMoving: false,pinnedRight:true,enablePinning: false,cellClass: 'grid-status-label',
                    cellTemplate: `<div  ng-if="row.entity.level === 1"> 
                    <a class="handle-click-a"  ng-click="grid.appScope.addTwoCourse(row.entity)">新增</a>
                    <a class="handle-click-a" ng-if="row.entity.isLastCourse ===0"></a>
                    <a class="handle-click-a" ng-if="row.entity.isLastCourse ===1" ng-click="grid.appScope.delectOneCourse(row.entity)">删除</a>
                    <a class="handle-click-a" ng-if="row.entity.isLastCourse ===1"  ng-click="grid.appScope.editCourse(row.entity)">修改</a>
                    </div>
                    <div  ng-if="row.entity.level === 2">
                    <a class="handle-click-a" ng-click="grid.appScope.addThreeCourse(row.entity)">新增</a>
                    <a class="handle-click-a" ng-if="row.entity.isLastCourse ===1"  ng-click="grid.appScope.editCourse(row.entity)">修改</a>
                    <a class="handle-click-a" ng-click="grid.appScope.userTwoCourse(row.entity)">启用/停用</a>
                    <a class="handle-click-a" ng-if="row.entity.isLastCourse ===0"></a>
                    <a class="handle-click-a" ng-if="row.entity.isLastCourse ===1" ng-click="grid.appScope.delectTwoCourse(row.entity)">删除</a>
                    </div>
                    <div  ng-if="row.entity.level === 3">
                    <a class="handle-click-a" ng-if="row.entity.isLastCourse ===1"  ng-click="grid.appScope.editCourse(row.entity)">修改</a>
                    <a class="handle-click-a"  ng-click="grid.appScope.userThreeCourse(row.entity)">启用/停用</a>
                    <a class="handle-click-a" ng-if="row.entity.isLastCourse ===0"></a>
                    <a class="handle-click-a" ng-if="row.entity.isLastCourse ===1" ng-click="grid.appScope.delectThreeCourse(row.entity)">删除</a>
                    </div>
                    `
                }
            ];
        };

    
    //     // 查看第二级
    //    $scope.lookSubOrder = function(obj){
    //     //    console.log(obj);
    //        $scope.lookTwoShow = true;
    //        let requestParams = {
    //         parentId:obj.id
    //     }
    //     financeService.getCourseByParentId(requestParams).then(function(res){
    //         if(res.data.code===1){
    //             $scope.courseTwoList = res.data.data;
    //             angular.forEach($scope.courseTwoList, function(item){
    //                 angular.forEach($scope.courseStatusArr, function(data){
    //                     if((data.id).toString()===(item.courseStatus).toString())item.courseStatus = data.name;
    //                 });
    //                 angular.forEach($scope.courseTypeArr, function(data){
    //                     if((data.id).toString()===(item.courseType).toString())item.courseType = data.name;
    //                 });
    //                 angular.forEach($scope.courseCategoryArr, function(data){
    //                     if(data.id===item.courseCategory)item.courseCategory = data.name;
    //                 });
    //             });
    //         }
    //     })
    //    };

    //     // 查看第三级
    //    $scope.lookCourseThree = function(obj){
    //     $scope.lookThreeShow = true;
    //     let requestParams = {
    //         parentId:obj.id
    //     }
    //     financeService.getCourseByParentId(requestParams).then(function(res){
    //         // console.log(res)
    //         if(res.data.code===1){
    //             $scope.courseThreeList = res.data.data;
    //             angular.forEach($scope.courseThreeList, function(item){
    //                 angular.forEach($scope.courseStatusArr, function(data){
    //                     if((data.id).toString()===(item.courseStatus).toString())item.courseStatus = data.name;
    //                 });
    //                 angular.forEach($scope.courseTypeArr, function(data){
    //                     if((data.id).toString()===(item.courseType).toString())item.courseType = data.name;
    //                 });
    //                 angular.forEach($scope.courseCategoryArr, function(data){
    //                     if(data.id===item.courseCategory)item.courseCategory = data.name;
    //                 });
    //             });
    //         }
    //     })
    //    }



        // 修改
        $scope.editCourse = function(obj){
            $state.go("aep.loc.course_compile",{flag:"edit",courseId:obj.id,level:obj.level,levelName:obj.courseName});
        }

        // 增加或者修改 第一层
        $scope.compileCourse = function(v){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            console.log(selectedRows)
            if(v==='add'){
                $state.go("aep.loc.course_compile",{flag:v,level:1,parentid:"null"});
            }
            // else{
            //     if(selectedRows.length ===0){
            //         $.misMsg("请选择需要修改的数据！");
            //     }else{
            //         if(selectedRows[0].entity.level != 1){
            //             $.misMsg("请选择第一层的数据进行修改！");
            //         }else{
            //             $state.go("aep.loc.course_compile",{flag:v,courseId:selectedRows[0].entity.id,level:1,levelName:selectedRows[0].entity.courseName,parentid:"null"})
            //         }
                    
            //     }
            // }
        };

        // 添加第二层
        $scope.addTwoCourse = function(obj){
            let level = Number(obj.level)+Number(1);
            $state.go("aep.loc.course_compile",{flag:"add",level:level,levelName:obj.courseCategory,parentid:obj.id});
            console.log(obj)
            
        }
        // 修改第二层
        // $scope.editTwoCourse = function(obj){
        //     $state.go("aep.loc.course_compile",{flag:"edit",courseId:obj.id,level:obj.level,levelName:obj.courseName,parentid:obj.parentCourseId.id});
        //     console.log(obj)

        // }
        // 删除第二层
        $scope.delectTwoCourse = function(obj){
            let info = {
                title:"提示信息",
                content:"是否确定删除所选科目 ？ "
            }
            $.misConfirm(info,function(){
            let requestParams = {
                id:(obj.id).toString()
            }
            financeService.deleteCourse(requestParams).then(function(res){
                if (res.data.code === 1) {
                    $.misMsg(res.data.msg);
                    $state.reload();
                }else{
                    $.misMsg(res.data.msg)
                }
            })
            })
        }
        // 可用第二层
        $scope.userTwoCourse = function(obj){
            let info = {
                title:"提示信息",
                content:"是否确定改变状态 ？ "
            }
            $.misConfirm(info,function(){
                let requestParams = {
                    id:obj.id,
                }
                financeService.changeCourseStatus(requestParams).then(function(res){
                    if (res.data.code === 1) {
                        $.misMsg(res.data.msg);
                        $state.reload();
                    }else{
                        $.misMsg(res.data.msg)
                    }
                })
            });
        }
        
        // 添加第三层
        $scope.addThreeCourse = function(s){
            let level = Number(s.level)+Number(1);
            $state.go("aep.loc.course_compile",{flag:"add",level:level,levelName:s.courseCategory,parentid:s.id});
        }
        // // 修改第三层
        // $scope.editThreeCourse = function(obj){
        //     $state.go("aep.loc.course_compile",{flag:"edit",courseId:obj.id,level:obj.level,levelName:obj.courseName,parentid:obj.parentId});

        // }
        // 删除第三层
        $scope.delectThreeCourse = function(obj){
            let info = {
                title:"提示信息",
                content:"是否确定删除所选科目 ？ "
            }
            $.misConfirm(info,function(){
            let requestParams = {
                id:(obj.id).toString()
            }
            financeService.deleteCourse(requestParams).then(function(res){
                if (res.data.code === 1) {
                    $.misMsg(res.data.msg);
                    $state.reload();
                }else{
                    $.misMsg(res.data.msg)
                }
            })
            })
        }
        // 可用第三层
        $scope.userThreeCourse = function(obj){
            let info = {
                title:"提示信息",
                content:"是否确定改变状态 ？ "
            }
            $.misConfirm(info,function(){
                let requestParams = {
                    id:obj.id,
                }
                financeService.changeCourseStatus(requestParams).then(function(res){
                    if (res.data.code === 1) {
                        $.misMsg(res.data.msg);
                        $state.reload();
                    }else{
                        $.misMsg(res.data.msg)
                    }
                })
            });
        }

        // 关闭第二层 第三层弹框
        $scope.twoCloseConfirm = function(){
            $scope.lookTwoShow = false;
        };
        $scope.threeCloseConfirm = function(){
            $scope.lookThreeShow = false;
        };
        
        // 删除
        $scope.deleteCourse = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            if(selectedRows.length ===0){
                $.misMsg("请选择需要删除的数据！");
            }else{
                let info = {
                    title:"提示信息",
                    content:"是否确定删除所选科目 ？ "
                }
                $.misConfirm(info,function(){
                    let requestParams = {
                        id:(selectedRows[0].entity.id).toString()
                    }
                    financeService.deleteCourse  (requestParams).then(function(res){
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

        // 删除第一层
        $scope.delectOneCourse = function(obj){
            let info = {
                title:"提示信息",
                content:"是否确定删除所选科目 ？ "
            }
            $.misConfirm(info,function(){
            let requestParams = {
                id:(obj.id).toString()
            }
            financeService.deleteCourse(requestParams).then(function(res){
                if (res.data.code === 1) {
                    $.misMsg(res.data.msg);
                    $state.reload();
                }else{
                    $.misMsg(res.data.msg)
                }
            })
            })
        }


        // 可用
        $scope.userCourse = function(){
            let selectedRows = $scope.gridApi.selection.getSelectedGridRows();
            // console.log(selectedRows);
            if(selectedRows.length > 1){
                $.misMsg("请选择一条需要改变状态的数据！");
            }else if(selectedRows.length ===0){
                $.misMsg("请选择需要改变状态的数据！");
            }else{
                if(selectedRows[0].entity.level != 1){
                    $.misMsg("请选择第一层的数据进行修改！");
                }else{
                    let info = {
                        title:"提示信息",
                        content:"是否确定改变状态 ？ "
                    }
                    $.misConfirm(info,function(){
                        let requestParams = {
                            id:selectedRows[0].entity.id,
                        }
                        financeService.changeCourseStatus(requestParams).then(function(res){
                            if (res.data.code === 1) {
                                $.misMsg(res.data.msg);
                                $state.reload();
                            }else{
                                $.misMsg(res.data.msg)
                            }
                        })
                    });
                }
                
            }
        };

        $scope.searchKey = function(){
            params.keyword = $scope.keyword ||'';
            $scope.findFeeCourses();
        };

        $scope.myKeyup = function(event){
            if(event.keyCode===13){
                $scope.searchKey();
            }
        };

        $scope.closeConfirm = function(){
            $scope.levelSelectShow = false;
        };
        $scope.init = function(){
            $scope.findFeeCourses();
        };
        $scope.init();
    }])