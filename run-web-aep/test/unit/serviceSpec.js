'use strict';
/**
 * @author           wangyu01@sefon.com
 * @createTime       2018-9-5 11:41:27
 * @description      common service test
 * @jasmine
 * @describe                 {Function}          声明语法.
 * @beforeEach               {Function}          在describe函数中每个Spec执行之前执行.
 * @beforeAll                {Function}          在describe函数中所有的Spec执行之前执行，但只执行一次，在Spec之间并不会被执行.
 * @getRangeDateList         {Function}          通过getRangeDateList方法计算出2个日期之间的时间列表
 * @convertTreeData          {Function}          通过convertTreeData方法转换json数组对象为树形结构
 */

describe('Unit Test: Services', () => {

    let $cookies, $httpBackend, $controller, $rootScope, comService, optionService, destroyCache, dateCalculateService;

    beforeEach(() => {

        module('aep');

        module('ngMockE2E');

        inject((_$cookies_, _$controller_, _$rootScope_, $injector, _$httpBackend_) => {

            $cookies = _$cookies_;

            $controller = _$controller_;

            $rootScope = _$rootScope_;

            comService = $injector.get('comService');

            optionService = $injector.get('optionService');

            destroyCache = $injector.get('destroyCache');

            dateCalculateService = $injector.get('dateCalculateService');

            $httpBackend = _$httpBackend_;
        })
    });

    describe('comService', () => {

        describe('getRangeDateList', () => {

            it("The getRangeDateList method is used to calculate the time list between two dates", () => {
                let start = '2018-8-30',
                    end = '2018-9-5',
                    arr = ['2018-08-30', '2018-08-31', '2018-09-01', '2018-09-02', '2018-09-03', '2018-09-04', '2018-09-05'];
                let newArr = comService.getRangeDateList(start, end);
                expect(newArr).toEqual(arr);
            });

        });

        describe('convertTreeData', () => {

            it("The convertTreeData method is used to convert the json array object to a tree structure", () => {
                let arr = [{
                        "parentId": "42d3d1f8795e45aa8309d991ed58b0f9",
                        "_id": "8891b74bd8f445ee8280b4972ae2e9ec",
                        "sourceName": "看来组织"
                    }, {
                        "parentId": "8891b74bd8f445ee8280b4972ae2e9ec",
                        "_id": "90ef946c05a34cc697a83960821afbdb",
                        "sourceName": "三级组织"
                    }, {
                        "_id": "42d3d1f8795e45aa8309d991ed58b0f9",
                        "sourceName": "正式组织"
                    }, {
                        "_id": "91a1d777fdcd4fe5bbb180266d9822a9",
                        "sourceName": "测试"
                    }, {
                        "_id": "afccf5b4375a444bb69d6caff2161f0d",
                        "sourceName": "3级组织",
                        "parentId": "c22fad1667924d94a591322da06492cd"
                    }, {
                        "_id": "c22fad1667924d94a591322da06492cd",
                        "sourceName": "2级测试",
                        "parentId": "91a1d777fdcd4fe5bbb180266d9822a9",
                    }, {
                        "parentId": "3d36646288df464eb1350a1c6010f429",
                        "_id": "a59bacef6bb547f399f6430ac186a35b",
                        "sourceName": "硬件"
                    }, {
                        "parentId": "",
                        "_id": "3d36646288df464eb1350a1c6010f429",
                        "sourceName": "研发"
                    }, {
                        "parentId": "3d36646288df464eb1350a1c6010f429",
                        "_id": "d5508b1fbe9a4baf82e0c80ab21d964b",
                        "sourceName": "软件"
                    }],
                    verifyArr = [{
                        "_id": "42d3d1f8795e45aa8309d991ed58b0f9",
                        "sourceName": "正式组织",
                        "children": [{
                            "parentId": "42d3d1f8795e45aa8309d991ed58b0f9",
                            "_id": "8891b74bd8f445ee8280b4972ae2e9ec",
                            "sourceName": "看来组织",
                            "children": [{
                                "parentId": "8891b74bd8f445ee8280b4972ae2e9ec",
                                "_id": "90ef946c05a34cc697a83960821afbdb",
                                "sourceName": "三级组织",
                                "children": []
                            }]
                        }]
                    }, {
                        "_id": "91a1d777fdcd4fe5bbb180266d9822a9",
                        "sourceName": "测试",
                        "children": [{
                            "_id": "c22fad1667924d94a591322da06492cd",
                            "sourceName": "2级测试",
                            "parentId": "91a1d777fdcd4fe5bbb180266d9822a9",
                            "children": [{
                                "_id": "afccf5b4375a444bb69d6caff2161f0d",
                                "sourceName": "3级组织",
                                "parentId": "c22fad1667924d94a591322da06492cd",
                                "children": []
                            }]
                        }]
                    }, {
                        "parentId": "",
                        "_id": "3d36646288df464eb1350a1c6010f429",
                        "sourceName": "研发",
                        "children": [{
                            "parentId": "3d36646288df464eb1350a1c6010f429",
                            "_id": "a59bacef6bb547f399f6430ac186a35b",
                            "sourceName": "硬件",
                            "children": []
                        }, {
                            "parentId": "3d36646288df464eb1350a1c6010f429",
                            "_id": "d5508b1fbe9a4baf82e0c80ab21d964b",
                            "sourceName": "软件",
                            "children": []
                        }]
                    }];
                let newArr = comService.convertTreeData(arr);
                expect(newArr).toEqual(verifyArr);
            });

        });

    });

    describe('optionService', () => {
        describe('.convertURL', () => {
            it("should add '&timestamp= timestamp' by  url with parameters or  add '?timestamp=timestamp' by url without parameters", () => {

                let url = 'http://www.baidu.com', timestamp = Number(new Date());

                let urlA = url + '?timestamp=' + timestamp;

                expect(optionService.convertURL(url)).toEqual(urlA);

                let urlB = url + '?new', urlC = urlB + '&timestamp=' + timestamp;

                expect(optionService.convertURL(urlB)).toEqual(urlC);

            })
        });

        describe('.findObjectDiff', () => {
            it('should compare tow objects to return the different element object', () => {
                let obj = {keyA: 'first', keyB: '12345', keyC: 'solid'},
                    objA = {keyA: 'first', keyB: '123456', keyC: 'solid'},
                    objB = {keyB: '123456'};

                expect(optionService.findObjectDiff(obj, objA)).toEqual(objB);
            })

        })

    });

    describe('destroyCache', () => {

        beforeEach(() => {

            $cookies.put('cookieA', 'ab');

            $cookies.put('cookieB', 'abc');

            localStorage.setItem('storageA', 'abcd');

            localStorage.setItem('storageB', 'abcde');
        });

        it('should declare all local storage and cookies be defined', () => {

            expect($cookies.get('cookieA')).toEqual('ab');

            expect($cookies.get('cookieB')).toEqual('abc');

            expect(localStorage.getItem('storageA')).toEqual('abcd');

            expect(localStorage.getItem('storageB')).toEqual('abcde');


        });

        describe('clearCache', () => {

            beforeEach(() => {
                destroyCache.clearCache();
            });

            it('should clean all declared local storage and cookies ', () => {

                expect($cookies.get('cookieA')).toBeUndefined();

                expect($cookies.get('cookieB')).toBeUndefined();

                expect(localStorage.getItem('storageA')).toBeNull();

                expect(localStorage.getItem('storageB')).toBeNull();
            });
        })
    });

    describe('dateCalculateService', () => {
        describe('getRangeDateList', () => {
            it("The getRangeDateList method is used to calculate the time list between two dates", () => {
                let start = '2018-8-30',
                    end = '2018-9-5',
                    arr = ['2018-08-30', '2018-08-31', '2018-09-01', '2018-09-02', '2018-09-03', '2018-09-04', '2018-09-05'];
                let newArr = comService.getRangeDateList(start, end);
                expect(newArr).toEqual(arr);
            });
        })
    });

    describe('userService', () => {

        let $scope, accessLayoutController, valid_respond = {
            "data": {
                "list": [
                    {
                        "sourceUI": "icon icon-hardware-develop",
                        "sourceName": "硬件管理",
                        "children": [
                            {
                                "sourceUrl": "aep.access.product",
                                "sourceName": "产品管理"
                            },
                            {
                                "sourceUrl": "aep.access.tactics",
                                "sourceName": "策略管理"
                            },
                            {
                                "sourceUrl": "aep.access.device",
                                "sourceName": "设备管理"
                            },
                            {
                                "sourceUrl": "aep.access.gateway",
                                "sourceName": "网关管理"
                            }
                        ]
                    }
                ]
            }
        };
        beforeEach(() => {

            inject(() => {

                $httpBackend.whenGET('./mocks/deviceAccessMenuLists.json').respond(() => {
                    return [200, valid_respond];
                });

                $scope = $rootScope.$new();

                accessLayoutController = () => {
                    return $controller('accessLayoutController', {
                        $scope: $scope
                    })
                }
            });
        });

        afterEach(() => {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should fetch list of menuLists.children', function () {
            $httpBackend.whenGET('./mocks/deviceAccessMenuLists.json').respond(valid_respond);
            accessLayoutController();
            $httpBackend.flush();
            expect($scope.menuLists[0].children.length).toBe(2);
            expect($scope.menuLists[0].sourceName).toBe('硬件管理');
            for (let i = 0; i < $scope.menuLists[0].children.length; i++) {
                console.log($scope.menuLists[0].children[i].sourceName);
            }
        });

    });

});