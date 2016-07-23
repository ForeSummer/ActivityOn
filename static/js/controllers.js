'use strict';

/* Controllers */

angular.module('act.controllers', []).
    controller('HomepageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'Session', '$mdDialog', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location, session, $mdDialog){
        console.log('HomepageCtrl');
        if (!$user.islogged) {
            window.location = '/user/login';
            console.log('turn to login fail');
        }
        
        //search access
        $scope.search = "";
        $scope.getResult = function() {
            //$http.post(urls.api + '').success(function(){

            //});
        };
        //logout
        $scope.logout = function(){
            $http.get(urls.api + '  /user/logout').success(function(data){
                console.log(data);
                //$csrf.show_error(data.error);
                if(data.error.code == 1){
                    session.destory();
                    window.location = urls + '/user/login';
                }
            });
        };
        //get message list
        $scope.messageList = function() {
            console.log("233");
            //window.location = urls + '/user/messages';
        };
        //get user info
        $scope.get_user_info = function() {
            $http.get(urls.api + '/user/info/?UID=' + session.userId).success(function(data) {
                if(data.ErrorCode == 1) {
                    $scope.avatarUrl = data.url;
                    $scope.nickname = data.nickname;
                }
                else {
                    console.log("get info error");
                }
            });
        };
        $scope.user_follow_num = 0;
        $scope.user_activity_num = 0;
        $scope.createActivity = function () {
            window.location = '/user/createAct';
        }
        $scope.confirmStatus = false;
        $scope.showAlert = function(isAbleToCancel, msg, ev) {
            if (!isAbleToCancel) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('注意!')
                    .textContent(msg)
                    .ariaLabel('Alert Dialog')
                    .ok('确定')
                    .targetEvent(ev)
                );
            } else {
                var confirm = $mdDialog.confirm()
                .title('请确认:')
                .textContent(msg)
                .ariaLabel('Confirm Dialog')
                .targetEvent(ev)
                .ok('我确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    $scope.confirmStatus = true;
                }, function() {
                    $scope.confirmStatus = false;
                });
            }
        };
    }]).
    controller('UserLoginCtrl', ['$scope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'Session', '$mdDialog', function($scope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, session, $mdDialog){
        console.log('UserLoginCtrl');
        $('.header-container').hide();
        $('.footer-container').hide();

        //for new user regist
        $scope.privateemail = "";
        $scope.password = "";
        $scope.confirm = "";
        $scope.openemail = "";
        $scope.nickname = "";
        //for user log in
        $scope.user_name = "";
        $scope.user_password = "";

        //error use
        $scope.errormessage = "";
        //use for check form of emails
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

        $scope.login_user = function(){
            var param = {
                'user_name': $scope.user_name,
                'user_password': $scope.user_password
            };
            console.log(param);
            $http.post(urls.api + "/user/login", $.param(param)).success(function(res){
                console.log(res);
                if(res.ErrorCode == 1){
                    //success
                    session.create(0, res.UID);
                    $('.header-container').show();
                    $('.footer-container').show();
                    window.location = '/user/homepage';
                    console.log("login succeed");
                }
                else {
                    $scope.user_name = "";
                    $scope.user_password = "";
                    $scope.errormessage = "用户名密码错误！";
                    $scope.alertError($scope.errormessage);
                }
            });
            /*session.create(0, 3);
            console.log(!$user.islogged);
            session.destory();
            console.log(!$user.islogged);*/

        };
           

        
        $scope.regist_user = function() {
            //check password&confirm
            if($scope.password != $scope.confirm) {
                $scope.password = "";
                $scope.confirm = "";
                $scope.errormessage = "两次输入密码不一致，请再次输入！";
                console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if($scope.password.length>18 || $scope.password.length<6) {
                $scope.password = "";
                $scope.confirm = "";
                $scope.errormessage = "请输入长度为6~18的密码！";
                console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if ($scope.nickname.length>16 || $scope.nickname.length<6) {
                $scope.nickname = "";
                $scope.errormessage = "请输入长度为6~16字节的昵称！";
                console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if(!reg.test($scope.privateemail)) {
                $scope.privateemail = "";
                $scope.errormessage = "请输入正确的登录邮箱！";
                console.log($scope.errormessage) ;
                $scope.alertError($scope.errormessage);
                return;
            }
            if(!reg.test($scope.openemail)) {
                $scope.openemail = "";
                $scope.errormessage = "请输入正确的公开邮箱！";
                console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            showAlert(true, "")
            var param = {
                'privateemail': $scope.privateemail,
                'password': $scope.password,
                'openemail': $scope.openemail,
                'nickname': $scope.nickname
            };
            console.log(param);
            $http.post(urls.api + "/user/regist", $.param(param)).success(function(data){
                console.log(data);
                //$csrf.show_error(data.error);
                if(data.ErrorCode == 1){
                    session.create(data.id,data.userid);
                    $('.header-container').show();
                    $('.footer-container').show();
                    window.location = '/user/homepage';
                }
                else {
                    $scope.password = "";
                    $scope.confirm = "";
                    if(data.ErrorCode == 0) {
                        $scope.privateEmail = "";
                    }
                    else {
                        $scope.nickname = "";
                    }
                }
            });
        };

        $scope.alertError = function(msg) {
            $scope.showAlert(false, msg);

        }

        $scope.confirmStatus = false;
        $scope.showAlert = function(isAbleToCancel, msg, ev) {
            if (!isAbleToCancel) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('注意!')
                    .textContent(msg)
                    .ariaLabel('Alert Dialog')
                    .ok('确定')
                    .targetEvent(ev)
                );
            } else {
                var confirm = $mdDialog.confirm()
                .title('请确认:')
                .textContent(msg)
                .ariaLabel('Confirm Dialog')
                .targetEvent(ev)
                .ok('我确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    $scope.confirmStatus = true;
                }, function() {
                    $scope.confirmStatus = false;
                });
            }
        };
    }]).
    controller('UserInfoCtrl', ['$scope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'Session', '$mdDialog', function($scope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, session, $mdDialog){
        console.log('UserInfoCtrl');
        //defualt is false
        $scope.isMe = true;
        $scope.user_name = "NickName";
        $scope.user_publicEmail = "email@wtf.com";
        $scope.user_info = "个人简介orz凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数";
        $scope.user_inact = ["写前期文档", "应付中期检查", "交大作业"];
        $scope.user_follow = ["李俊杰", "卫国扬", "唐人杰", "某某某", "abc", "一个很长的名字作为测试", "日了狗了", "可以的很django"];
        $scope.user_followed = ["你一点都不django", "django强无敌", "毕竟django", "python"];
        $scope.user_publicEmailLink = "mailto:" + $scope.user_publicEmail;
        //console.log($routeParams.user_id);
        $scope.get_user_info = function() {
            $http.get(urls.api + '/user/info/?UID=' + $routeParams.user_id).success(function(data) {
                if(data.ErrorCode == 1) {
                    $scope.user_name = dada.user_name;
                    $scope.user_publicEmail = data.user_openemail;
                    $scope.user_info = data.user_info;
                    $scope.user_inact = data.user_inact;
                    $scope.user_follow = data.user_follow;
                    $scope.user_followed = data.user_followed;
                    $scope.user_publicEmailLink = "mailto:" + data.user_publicEmail;
                }
                else {
                    console.log("get info error");
                }
            });
        };

        if ($routeParams.user_id == session.id) {
            $scope.isMe = true;
        }

        $scope.edit_user_info = function () {
            window.location = '/user/modify';
        }

        $scope.confirmStatus = false;
        $scope.showAlert = function(isAbleToCancel, msg, ev) {
            if (!isAbleToCancel) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('注意!')
                    .textContent(msg)
                    .ariaLabel('Alert Dialog')
                    .ok('确定')
                    .targetEvent(ev)
                );
            } else {
                var confirm = $mdDialog.confirm()
                .title('请确认:')
                .textContent(msg)
                .ariaLabel('Confirm Dialog')
                .targetEvent(ev)
                .ok('我确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    $scope.confirmStatus = true;
                }, function() {
                    $scope.confirmStatus = false;
                });
            }
        };
    }]).
    controller('UserModifyInfoCtrl', ['$scope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'Session', '$mdDialog', function($scope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, session, $mdDialog){
        console.log('UserModifyInfoCtrl');
        $scope.user_name = "假装有用户名";
        $scope.user_pass = "123456";
        $scope.confirm = "123456";
        $scope.user_publicEmail = "django@python.css";
        $scope.user_info = "假装有一个非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的个人信息介绍";
        $scope.errormessage = "";
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        $scope.modifyInfo = function () {
            if($scope.user_pass != $scope.confirm) {
                $scope.user_pass = "";
                $scope.confirm = "";
                $scope.errormessage = "两次输入密码不一致，请再次输入！";
                console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if($scope.user_pass.length>18 || $scope.user_pass.length<6) {
                $scope.user_pass = "";
                $scope.confirm = "";
                $scope.errormessage = "请输入长度为6~18的密码！";
                console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if ($scope.user_name.length>16 || $scope.user_name.length<6) {
                $scope.user_name = "";
                $scope.errormessage = "请输入长度为6~16字节的昵称！";
                console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if(!reg.test($scope.user_publicEmail)) {
                $scope.user_publicEmail = "";
                $scope.errormessage = "请输入正确的公开邮箱！";
                console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            var param = {
                'nickname': $scope.user_name,
                'password': $scope.user_pass,
                'openemail': $scope.user_publicEmail,
                'info': $scope.user_info
            };
            $http.post(urls.api + "/user/modify", $.param(param)).success(function(data){
                console.log(data);
                //$csrf.show_error(data.error);
                if(data.error.code == 1){
                    session.create(data.id,data.userid);
                    window.location = urls + '/user/homepage';
                }
            });
        }

        $scope.confirmStatus = false;
        $scope.alertError = function(msg) {
            $scope.showAlert(false, msg);
        }
        $scope.showAlert = function(isAbleToCancel, msg, ev) {
            if (!isAbleToCancel) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('注意!')
                    .textContent(msg)
                    .ariaLabel('Alert Dialog')
                    .ok('确定')
                    .targetEvent(ev)
                );
            } else {
                var confirm = $mdDialog.confirm()
                .title('请确认:')
                .textContent(msg)
                .ariaLabel('Confirm Dialog')
                .targetEvent(ev)
                .ok('我确定')
                .cancel('取消');
                $mdDialog.show(confirm).then(function() {
                    $scope.confirmStatus = true;
                }, function() {
                    $scope.confirmStatus = false;
                });
            }
        };
    }]).
    controller('ActivityLoginCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        console.log('ActivityLoginCtrl');

    }]).
    controller('ActivityManageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        console.log('ActivityManageCtrl');
        
       
    }]).
    controller('RegStatisticCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('RegStatisticCtrl');
        
    }]).
    controller('SetEmailCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location',function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location){
        console.log('SetEmailCtrl');
       
    }]).
    controller('FormViewCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location){
        console.log('FormViewCtrl');
        

    }]).
	
    controller('ActivityStatisticCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location){
        console.log('ActivityStatisticCtrl');
        
    }]).
	controller('InstructionCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        //console.log('InstructionCtrl');
        
    }]).
    controller('ActivityRegistCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', '$timeout', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location, $timeout){
        
    }]).
    controller('FixCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        //console.log('FixCtrl');
    }]);
