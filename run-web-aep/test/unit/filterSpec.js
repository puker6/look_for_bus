'use strict';
/**
 * @author           wangyu01@sefon.com
 * @createTime       2018-9-5 16:20:47
 * @description      common filter test
 * @jasmine
 * @param {Function} describe - 声明语法.
 * @param {Function} beforeEach - 在describe函数中每个Spec执行之前执行.
 * @param {Function} beforeAll - 在describe函数中所有的Spec执行之前执行，但只执行一次，在Spec之间并不会被执行.
 */

describe('Unit Test: Filters', () => {

    let filter;

    beforeEach(()=>{
        module('aep');
        inject(($filter) => {

            filter = $filter;

        });
    });

    describe('statusIcon',()=>{
        it('The filter methods of statusIcon is used to filter data, find the corresponding style', ()=>{

            expect(filter('statusIcon')('进行中')).toEqual('label label-info');

            expect(filter('statusIcon')('已完成')).toEqual('label label-success');

            expect(filter('statusIcon')('警告')).toEqual('label label-warning');

            expect(filter('statusIcon')('错误')).toEqual('label label-danger');

            expect(filter('statusIcon')('')).toEqual('label label-primary');

        });

    });

    describe('portType',()=>{
        it('The filter methods of portType is used to filter data, find the corresponding style', ()=>{

            expect(filter('portType')('1')).toEqual('GET');

            expect(filter('portType')('2')).toEqual('POST');

            expect(filter('portType')('3')).toEqual('PUT');

            expect(filter('portType')('4')).toEqual('DELETE');

            expect(filter('portType')('')).toEqual('POST');
        });

    });

    describe('emptyInfo',()=>{
        it('The filter methods of emptyInfo is used to filter,determine whether the aggregation is empty', ()=>{

            expect(filter('emptyInfo')('')).toEqual('无');

            expect(filter('emptyInfo')(undefined)).toEqual('无');

            expect(filter('emptyInfo')('test')).toEqual('test');

        });
    });

    describe('stateFilter',()=>{
        it('The filter methods of stateFilter is used to filter data, find the corresponding style', ()=>{

            expect(filter('stateFilter')('valid')).toEqual('启用');

            expect(filter('stateFilter')('')).toEqual('禁用');

        });

    });

    describe('stateAbleFilter',()=>{
        it('The filter methods of stateAbleFilter is used to filter data, find the corresponding style', ()=>{

            expect(filter('stateAbleFilter')('enabled')).toEqual('启用');

            expect(filter('stateAbleFilter')('')).toEqual('禁用');

        });

    });

    describe('onlineStateFilter',()=>{
        it('The filter methods of onlineStateFilter is used to filter data, find the corresponding style', ()=>{

            expect(filter('onlineStateFilter')('online')).toEqual('在线');

            expect(filter('onlineStateFilter')('offline')).toEqual('离线');

            expect(filter('onlineStateFilter')('unkown')).toEqual('未知');

            expect(filter('onlineStateFilter')()).toEqual('未知');

            expect(filter('onlineStateFilter')('')).toEqual('未知');

        });

    });

    describe('firmwareStateFilter',()=>{
        it('The filter methods of firmwareStateFilter is used to filter data, find the corresponding style', ()=>{

            expect(filter('firmwareStateFilter')('verified')).toEqual('已验证');

            expect(filter('firmwareStateFilter')('Unverified')).toEqual('未验证');

            expect(filter('firmwareStateFilter')()).toEqual('未验证');

        });

    });

    describe('pointDataType',()=>{
        it('The filter methods of pointDataType is used to filter data, find the corresponding style', ()=>{

            expect(filter('pointDataType')('boolean')).toEqual('布尔值');

            expect(filter('pointDataType')('number')).toEqual('数值');

            expect(filter('pointDataType')('byte')).toEqual('扩展');

            expect(filter('pointDataType')('enum')).toEqual('枚举');

        });

    });

    describe('myGeneralStatus',()=>{
        it('The filter methods of myGeneralStatus is used to filter data, find the corresponding style', ()=>{

            expect(filter('myGeneralStatus')('0')).toEqual('已撤回');

            expect(filter('myGeneralStatus')('1')).toEqual('待审核');

            expect(filter('myGeneralStatus')('2')).toEqual('被拒绝');

            expect(filter('myGeneralStatus')('4')).toEqual('处理中');

            expect(filter('myGeneralStatus')('5')).toEqual('已完成');

            expect(filter('myGeneralStatus')('7')).toEqual('已过期');

        });

    });

    describe('myFaultStatus',()=>{
        it('The filter methods of myFaultStatus is used to filter data, find the corresponding style', ()=>{

            expect(filter('myFaultStatus')('1')).toEqual('处理中');

            expect(filter('myFaultStatus')('2')).toEqual('待确认');

            expect(filter('myFaultStatus')('3')).toEqual('待审批');

            expect(filter('myFaultStatus')('4')).toEqual('被拒绝');

            expect(filter('myFaultStatus')('5')).toEqual('已完成');

            expect(filter('myFaultStatus')('6')).toEqual('已撤回');

        });

    });

    describe('myfaultTypeName',()=>{
        it('The filter methods of myfaultTypeName is used to filter data, find the corresponding style', ()=>{

            expect(filter('myfaultTypeName')(1)).toEqual('硬件锁体故障');

            expect(filter('myfaultTypeName')(2)).toEqual('App错误');

            expect(filter('myfaultTypeName')(3)).toEqual('web端错误');


        });

    });

    describe('readWriteType',()=>{
        it('The filter methods of readWriteType is used to filter data, find the corresponding style', ()=>{

            expect(filter('readWriteType')('read')).toEqual('只读');

            expect(filter('readWriteType')('write')).toEqual('可写');

        });

    });

    describe('readWriteType',()=>{
        it('The filter methods of readWriteType is used to filter data, find the corresponding style', ()=>{

            expect(filter('PercentValue')('0.5')).toEqual('50.00%');

            expect(filter('PercentValue')(undefined)).toEqual('0');

        });

    });

    describe('serviceTypeIconFilter',()=>{
        it('The filter methods of serviceTypeIconFilter is used to filter data, find the corresponding style', ()=>{

            expect(filter('serviceTypeIconFilter')('IOT')).toEqual('nav-icon-iot');

            expect(filter('serviceTypeIconFilter')('LOCMAN')).toEqual('nav-icon-loc');

            expect(filter('serviceTypeIconFilter')('OPERATION')).toEqual('nav-icon-operation');

            expect(filter('serviceTypeIconFilter')('MAINTAIN')).toEqual('nav-icon-maintain');

            expect(filter('serviceTypeIconFilter')('BIGDATA')).toEqual('nav-icon-data');

            expect(filter('serviceTypeIconFilter')()).toEqual('nav-icon-iot');

        });

    });

    describe('routerStateFilter',()=>{
        it('The filter methods of routerStateFilter is used to filter data, find the corresponding style', ()=>{

            expect(filter('routerStateFilter')('IOT')).toEqual('aep.access.**');

            expect(filter('routerStateFilter')('LOCMAN')).toEqual('aep.loc.**');

            expect(filter('routerStateFilter')('OPERATION')).toEqual('aep.operation.**');

            expect(filter('routerStateFilter')('MAINTAIN')).toEqual('aep.maintain.**');

            expect(filter('routerStateFilter')('BIGDATA')).toEqual('aep.data.**');

            expect(filter('routerStateFilter')()).toEqual('');

        });

    });

});