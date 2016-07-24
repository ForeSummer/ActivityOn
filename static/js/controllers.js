'use strict';

/* Controllers */

angular.module('act.controllers', []).
    controller('HeaderCtrl', ['$scope', '$rootScope','$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', '$mdDialog', function($scope, $rootScope, $http, $csrf, urls, $filter, $routeParams, $user, $location, $mdDialog){
        console.log("homepage");
        //search access
        $scope.search = "";
        $scope.avatarUrl = "/static/images/admin.png";
        $scope.nickname = "";
        $scope.getResult = function() {
            if(!$user.isLogged()) {
                return;
            }
            //$http.post(urls.api + '').success(function(){

            //});
        };
        //logout
        $scope.logout = function(){
            var message = "你确定要登出嘛？～";
            console.log(message);
            $scope.showAlert(true, message, function() {
                $http.get(urls.api + '/user/logout').success(function(data){
                    console.log(data);
                    $user.destory();
                    window.location = '/';
                    //$csrf.show_error(data.error);
                    if(data.ErrorCode == 1){
                        $user.destory();
                        window.location = '/';
                    }
                });
            });
        };
        $scope.returnHome = function(){
            $location.url('/');
        };
        //get message list
        $scope.messageList = function() {
            get_user_info();
            console.log($user.userId);
            //console.log("233");
            //window.location = urls + '/user/messages';
        };
        //get user info
        $scope.get_user_info = function() {
            $http.get(urls.api + '/user/info/?UID=' + $user.userId).success(function(data) {
                if(data.ErrorCode == 1) {
                    $scope.avatarUrl = data.UAvatar;
                    $scope.nickname = data.UName;
                    console.log(data);
                }
                else {
                    console.log("get info error");
                }
            });
        };
        $scope.infoDetail = function() {
            $location.url('/user/'+ $user.userId + '/info');
        };
        $scope.user_follow_num = 0;
        $scope.user_activity_num = 0;
        $scope.createActivity = function () {
            $location.url('/user/createAct');
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
        $rootScope.$on('userLog', function(event, data){
            $scope.get_user_info();
        });
        $rootScope.$on('userNameChange', function(event, data){
            $scope.nickname = data;
        });
        //$scope.get_user_info();
    }]).
    controller('HomepageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', '$mdDialog', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location, $mdDialog){
        console.log('HomepageCtrl');
        if (!$user.isLogged()) {
            console.log($user.isLogged);
            $location.url('/user/login');
            console.log('turn to login fail');
        }
        //console.log("homepage");
        //get user info
        $scope.user_follow_num = 0;
        $scope.user_activity_num = 0;
        $scope.createActivity = function () {
            $location.url('/act/create');
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
    controller('UserLoginCtrl', ['$scope', '$rootScope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', '$mdDialog', function($scope, $rootScope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, $mdDialog){
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
                    console.log($user);
                    $user.create(1, res.UID);
                    $rootScope.$broadcast('userLog');
                    $('.header-container').show();
                    $('.footer-container').show();
                    //console.log($user.isLogged());
                    $location.url('/');
                    //console.log("login succeed");
                }
                else {
                    $scope.user_name = "";
                    $scope.user_password = "";
                    $scope.errormessage = "用户名密码错误！";
                    $scope.alertError($scope.errormessage);
                }
            });
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
            //showAlert(true, "")
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
                    $user.create(1,data.UID);
                    console.log($user.isLogged());
                    $rootScope.$broadcast('userLog');
                    $('.header-container').show();
                    $('.footer-container').show();
                    $location.url('/');
                }
                else {
                    $scope.password = "";
                    $scope.confirm = "";
                    if(data.ErrorCode == 0) {
                        $scope.alertError("登陆邮箱已被注册");
                        $scope.privateEmail = "";
                    }
                    else {
                        $scope.alertError("该昵称已被注册");
                        $scope.nickname = "";
                    }
                }
            });
        };

        $scope.alertError = function(msg) {
            $scope.showAlert(false, msg);

        }

        //$scope.confirmStatus = false;
        $scope.showAlert = function(isAbleToCancel, msg, yesFunc, noFunc, ev) {
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
                    //$scope.confirmStatus = true;
                    yesFunc();
                }, function() {
                    //$scope.confirmStatus = false;
                    noFunc();
                });
            }
        };
    }]).
    controller('UserInfoCtrl', ['$scope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', '$mdDialog', function($scope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, $mdDialog){
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
                    $scope.user_name = data.UName;
                    $scope.user_publicEmail = data.UPublicEmail;
                    $scope.user_info = data.UInfo;
                    $scope.user_inact = data.UInact;
                    $scope.user_follow = data.UFollow;
                    $scope.user_followed = data.UFollowed;
                    $scope.user_publicEmailLink = "mailto:" + data.UPublicEmail;
                }
                else {
                    console.log("get info error");
                }
            });
        };

        if ($routeParams.user_id == $user.id) {
            $scope.isMe = true;
        }

        $scope.edit_user_info = function () {
            $location.url('/user/modify');
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
        $scope.get_user_info();
    }]).
    controller('UserModifyInfoCtrl', ['$scope', '$rootScope','$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', '$mdDialog', function($scope, $rootScope,$window, $http, $csrf, urls, $filter, $routeParams, $user, $location, $mdDialog){
        console.log('UserModifyInfoCtrl');
        $scope.user_name = "假装有用户名";
        $scope.user_publicEmail = "django@python.css";
        $scope.user_info = "假装有一个非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的个人信息介绍";
        $scope.errormessage = "";
        $scope.get_user_info = function() {
            $http.get(urls.api + '/user/info/?UID=' + $user.userId).success(function(data) {
                console.log(data);
                if(data.ErrorCode == 1) {
                    $scope.user_name = data.UName;
                    $scope.user_publicEmail = data.UPublicEmail;
                    $scope.user_info = data.UInfo;
                    $scope.user_inact = data.UInact;
                    $scope.user_follow = data.UFollow;
                    $scope.user_followed = data.UFollowed;
                    $scope.user_publicEmailLink = "mailto:" + data.UPublicEmail;
                }
                else {
                    console.log("get info error");
                }
            });
        };
        $scope.modifyInfo = function () {
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
                'UID': $user.userId,
                'UName': $scope.user_name,
                'UPublicEmail': $scope.user_publicEmail,
                'UInfo': $scope.user_info
            };
            $http.post(urls.api + "/user/modify", $.param(param)).success(function(data){
                console.log(data);
                //$csrf.show_error(data.error);
                if(data.ErrorCode == 1){
                    $rootScope.$broadcast('userNameChange', $scope.user_name);
                    $location.url('/');
                    //window.location = urls + '/user/homepage';
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

        $scope.get_user_info();
        $scope.modifyPassword = function () {
            $location.url('/user/password');
        }
    }]).
    controller('UserModifyPassCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', '$mdDialog', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $mdDialog){
        $scope.user_orgin_pass = "";
        $scope.user_pass = "";
        $scope.confirm = "";
        $scope.modifyPass = function () {
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
            var param = {
                'UID': $user.userId,
                'UPassword': $scope.user_orgin_pass,
                'NewUPassword': $scope.user_pass
            };
            console.log(param);
            $http.post(urls.api + "/user/modifyPassword", $.param(param)).success(function(res){
                console.log(res);
                if(res.ErrorCode == 1){
                    $location.url('/');
                }
                else {
                    $scope.user_orgin_pass = "";
                    $scope.errormessage = "密码错误！";
                    $scope.alertError($scope.errormessage);
                }
            });
        }
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
    controller('ActivityCreateCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        console.log('ActivityCreateCtrl');
        $scope.act_title = "写大作业";
        $scope.act_location = "宿舍";
        $scope.act_maxRegister = 3;
        $scope.act_summary = "花10天时间写一个有很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多代码的大作业";
        $scope.act_info = "花10天时间写一个有很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多代码的大作业";
        $scope.act_startDate = new Date();
        $scope.act_endDate = new Date();
        $scope.act_entryDDL = new Date();
        $scope.act_type = 3;
        $scope.types = act_types;

        $scope.createAct = function () {
            var param = {
                'Admin': $user.userId,
                'Type': $scope.act_type,
                'MaxRegister': $scope.act_maxRegister,
                'EntryDDL': $scope.act_entryDDL,
                'StartTime': $scope.act_startDate,
                'EndTime': $scope.act_endDate,
                'Title': $scope.act_title,
                'Location': $scope.act_location,
                'Summary': $scope.act_summary,
                'Info': $scope.act_info
            };
            $http.post(urls.api + "/act/create", $.param(param)).success(function(res){
                console.log(res);
                if(res.ErrorCode == 1){
                    //success message
                    //1 button back to home page
                    //2 button come to show it page
                    $location.url('/');
                }
                else {
                    //error message
                }
            });
            console.log($scope.act_startDate);
        }
    }]).
    controller('ActivityInfoCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        console.log('ActivityInfoCtrl');
        $scope.act_admin = "老师";
        $scope.act_title = "写大作业";
        $scope.act_location = "宿舍";
        $scope.act_startDate = "2016-7-20";
        $scope.act_endDate = "2016-7-29";
        $scope.act_entryDDL = "2016-7-28";
        $scope.types = act_types;
        $scope.act_type = $scope.types[3].name;
        $scope.act_info = "花10天时间写一个有很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多代码的大作业";
        $scope.isAdmin = true;
        $scope.act_maxRegister = 3;
        //max regester
        //default false
        $scope.act_register = ["李俊杰", "卫国扬", "唐人杰", "某某某", "abc", "一个很长的名字作为测试", "日了狗了", "可以的很django"];
        $scope.act_unregister = ["你一点都不django", "django强无敌", "毕竟django", "python"];
        $scope.get_act_info = function() {
            $http.get(urls.api + '/act/info/?AId=' + $routeParams.act_id).success(function(data) {
                if(data.ErrorCode == 1) {
                    //update values
                    $scope.act_admin = data.Admin;
                    $scope.act_title = data.Title;
                    $scope.act_location = data.Location;
                    $scope.act_startDate = data.StartTime;
                    $scope.act_endDate = data.EndTime;
                    $scope.act_entryDDL = data.EntryDDL;
                    $scope.act_info = data.Info;
                    $scope.act_register = data.Register;
                    $scope.act_unregister = data.Unregister;
                    $scope.act_maxRegister = data.MaxRegister;
                    $scope.act_type = data.Type;
                    if(data.Admin == $user.userId) {
                        $scope.isAdmin = true;
                    }
                }
                else {
                    console.log("get act info error");
                }
            });
        };

        $scope.modifyInfo = function() {
            if(!$scope.isAdmin) {
                return;
            }
            $location.url('/act/' + $routeParams.act_id + '/modify');
        };
        $scope.verifyUser = function() {
            if(!$scope.isAdmin) {
                return;
            }
            //turn to verify page
            $location.url();
        };
        $scope.joinIn = function() {
            var param = {
                //user id act id
            };
            //http post

            //if 1 success message
            //if 0 error message
            //if -1 you have already join the act
        };
    }]).
    controller('ActivityManageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location){
        console.log('ActivityManageCtrl');
        //data
        $scope.act_title = "写大作业";
        $scope.act_location = "宿舍";
        $scope.act_maxRegister = 3;
        $scope.act_summary = "花10天时间写一个有很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多代码的大作业";
        $scope.act_info = "花10天时间写一个有很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多代码的大作业";
        $scope.act_startDate = new Date();
        $scope.act_endDate = new Date();
        $scope.act_entryDDL = new Date();
        $scope.act_type = 3;
        $scope.types = act_types;
        //function
        $scope.get_act_info = function() {
            $http.get(urls.api + '/act/info/?AID=' + $routeParams.act_id).success(function(data) {
                if(data.ErrorCode == 1) {
                    //update values
                    $scope.act_admin = data.Admin;
                    $scope.act_title = data.Title;
                    $scope.act_location = data.Location;
                    $scope.act_startDate = data.StartTime;
                    $scope.act_endDate = data.EndTime;
                    $scope.act_entryDDL = data.EntryDDL;
                    $scope.act_info = data.Info;
                    $scope.act_register = data.Register;
                    $scope.act_unregister = data.Unregister;
                    $scope.act_maxRegister = data.MaxRegister;
                    $scope.act_type = data.Type;
                    if(data.Admin == $user.userId) {
                        $scope.isAdmin = true;
                    }
                }
                else {
                    console.log("get act info error");
                }
            });
        };

        $scope.modifyInfo = function() {
            var param = {
                'Admin': $user.userId,
                'AID': $routeParams.act_id,
                'Type': $scope.act_type,
                'MaxRegister': $scope.act_maxRegister,
                'EntryDDL': $scope.act_entryDDL,
                'StartTime': $scope.act_startDate,
                'EndTime': $scope.act_endDate,
                'Title': $scope.act_title,
                'Location': $scope.act_location,
                'Summary': $scope.act_summary,
                'Info': $scope.act_info
            };
            $http.post(urls.api + '/act/modify', $.param(param)).success(function(res){
                console.log(res);
                if(res.ErrorCode == 1){
                    //success message
                    //1 button back to home page
                    //2 button come to show it page
                    $location.url('/');
                }
                else {
                    //error message
                }
            });
        };

        $scope.deleteAct = function() {
            var param = {
                'UID': $user.userId,
                'AID': $routeParams.act_id
            };
            $http.post(urls.api + 'act/delete', $.param(param)).success(function(res) {
                if(res.ErrorCode == 1) {

                }
                else {

                }
            })
        };
        
        $scope.get_user_info();
        if($scope.act_admin != $user.userId) {
            $location.url('/');
        }
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
