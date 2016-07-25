'use strict';

/* Controllers */

angular.module('act.controllers', []).
    controller('HeaderCtrl', ['$scope', '$rootScope','$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'AlertService', function($scope, $rootScope, $http, $csrf, urls, $filter, $routeParams, $user, $location, $alert){
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
            $alert.showAlert(true, message, function() {
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
            //console.log($user.userId);
            //console.log("233");
            //window.location = urls + '/user/messages';
        };
        //get user info
        $scope.get_user_info = function() {
            $http.get(urls.api + '/user/info/?UID=' + $user.userId).success(function(data) {
                if(data.ErrorCode == 1) {
                    $scope.avatarUrl = data.UAvatar;
                    $scope.nickname = data.UName;
                    //console.log(data);
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

        $rootScope.$on('userLog', function(event, data){
            $scope.get_user_info();
        });
        $rootScope.$on('userNameChange', function(event, data){
            $scope.nickname = data;
        });

        $scope.messageList = function () {
            $location.url('user/message');
        }
        //$scope.get_user_info();
    }]).
    controller('HomepageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'AlertService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $location, $alert){
        console.log('HomepageCtrl');
        if (!$user.isLogged()) {
            //console.log($user.isLogged);
            $location.url('/user/login');
            //console.log('turn to login fail');
        }
        //console.log("homepage");
        //get user info
        $scope.user_follow_num = 0;
        $scope.user_activity_num = 0;
        $scope.user_organize_num = 0;
        $scope.createActivity = function () {
            $location.url('/act/create');
        }
        $scope.user_timeline = [
        {"user": "李俊杰", "act": "写后端", "isAdmin": true, "ago": "10分钟前", "summary": "用django@python.shit写一大堆无聊冗长毫无意义的后端代码并把它们强行放到工程里冒充自己有很多代码量"},
        {"user": "卫国扬", "act": "写前端逻辑", "isAdmin": true, "ago": "10分钟前", "summary": "用angularJS写一大堆无聊冗长毫无意义的前段逻辑代码并把它们强行放到工程里冒充自己有很多代码量"},
        {"user": "唐人杰", "act": "写前端样式", "isAdmin": false, "ago": "10分钟前", "summary": "用HTML和less写一大堆无聊冗长毫无意义而且难看的前段样式代码并把它们强行放到工程里冒充自己有很多代码量"}];
        $scope.jump = function (index, type) {
            console.log("Jump to " + index + "," + type);
        }
        $scope.user_suggest = ["写代码", "写大作业", "发呆"];
        $scope.search = function (content) {
            console.log(content);
        }
        $scope.getActList = function () {
            $location.url("/user/actlist");
        }
        $scope.isFirstLogin = false;
        if($user.guestAID) {
            $scope.isFirstLogin = true;
        }
        $scope.lastUrl = "登录前查看的活动页面";
        $scope.hasFollow = true;
        $scope.jumpBack = function () {
            var id = $user.guestAID;
            guestAID = null;
            $location.url('/act/'+ id + '/info');
        }


        //
        
    }]).
    controller('UserLoginCtrl', ['$scope', '$rootScope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'AlertService', function($scope, $rootScope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, $alert){
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
            //console.log(param);
            $http.post(urls.api + "/user/login", $.param(param)).success(function(res){
                console.log(res);
                if(res.ErrorCode == 1){
                    //success
                    //console.log($user);
                    $user.create(1, res.UID);
                    $alert.showAlert(false, "登陆成功！", function(){
                        $rootScope.$broadcast('userLog');
                        $('.header-container').show();
                        $('.footer-container').show();
                        //console.log($user.isLogged());
                        $location.url('/');
                    });
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
                //console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if($scope.password.length>18 || $scope.password.length<6) {
                $scope.password = "";
                $scope.confirm = "";
                $scope.errormessage = "请输入长度为6~18的密码！";
                //console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if ($scope.nickname.length>16 || $scope.nickname.length<6) {
                $scope.nickname = "";
                $scope.errormessage = "请输入长度为6~16字节的昵称！";
                //console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if(!reg.test($scope.privateemail)) {
                $scope.privateemail = "";
                $scope.errormessage = "请输入正确的登录邮箱！";
                //console.log($scope.errormessage) ;
                $scope.alertError($scope.errormessage);
                return;
            }
            if(!reg.test($scope.openemail)) {
                $scope.openemail = "";
                $scope.errormessage = "请输入正确的公开邮箱！";
                //console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            //ToDo: if public email == private email
            if($scope.openemail == $scope.privateemail) {
                $alert.showAlert(true, "登陆邮箱和公开邮箱相同，可能引发安全问题！是否继续注册？", function() {
                    $scope.registPost();
                }, function() {
                    $scope.privateemail = "";
                    $scope.openemail = "";
                });
            }
            else {
                $scope.registPost();
            }
            
        };
        $scope.registPost = function() {
            var random = Math.floor(Math.random()*8+1);
            //for random avatar
            var param = {
                'privateemail': $scope.privateemail,
                'password': $scope.password,
                'openemail': $scope.openemail,
                'nickname': $scope.nickname
            };
            //console.log(param);
            $http.post(urls.api + "/user/regist", $.param(param)).success(function(data){
                //console.log(data);
                //$csrf.show_error(data.error);
                if(data.ErrorCode == 1){
                    $user.create(1,data.UID);
                    $alert.showAlert(false, "注册成功！", function() {
                        //console.log($user.isLogged());
                        $rootScope.$broadcast('userLog');
                        $('.header-container').show();
                        $('.footer-container').show();
                        $location.url('/');
                    });
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
        }
        $scope.alertError = function(msg) {
            $alert.showAlert(false, msg);
        }
        //$scope.confirmStatus = false;
    }]).
    controller('UserInfoCtrl', ['$scope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'AlertService', function($scope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, $alert){
        console.log('UserInfoCtrl');
        //defualt is false
        $scope.isMe = false;
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

        if ($routeParams.user_id == $user.userId) {
            $scope.isMe = true;
        }

        $scope.edit_user_info = function () {
            $location.url('/user/modify');
        }
        $scope.getFollowStatus = function() {
            var param = {
                'UID': $user.userId,
                'FollowID': parseInt($routeParams.user_id)
            };
            $http.post().success(function(data) {
                if(data.ErrorCode) {
                    $scope,isFollowed = data.isFollowed;
                }
                else {
                    console.log("get follow status error");
                }
            });
        };
        //$scope.getFollowStatus();
        $scope.confirmStatus = false;
        $scope.get_user_info();

        $scope.isFollowed = false;
        $scope.isShowFollow = !$scope.isMe && !$scope.isFollowed;
        $scope.isShowUnFollow = !$scope.isMe && $scope.isFollowed;
        /*$scope.follow_user = function () {
            var param = {
                'UID': $user.userId,
                'FollowID': parseInt($routeParams.user_id)
            };

            $http.post(urls.api + '/user/follow', $.param(param)).success(function(data) {
                if(data.ErrorCode == 1) {
                    $alert.showAlert(false, "关注用户成功！",function(){});
                    $scope.isFollowed = true;
                }
                else {
                    console.log("follow error");
                }
            });
        };*/
        $scope.follow_user = function () {
            var param = {
                'UID': 20,
                'UnfollowID': parseInt($routeParams.user_id)
            };
            $http.post(urls.api + '/user/unfollow', $.param(param)).success(function(data) {
                if(data.ErrorCode == 1) {
                    $alert.showAlert(false, "取消关注用户成功！");
                    $scope.isFollowed = false;
                }
                else {
                    console.log("unfollow error");
                }
            });
        };
    }]).
    controller('UserModifyInfoCtrl', ['$scope', '$rootScope','$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'AlertService', function($scope, $rootScope,$window, $http, $csrf, urls, $filter, $routeParams, $user, $location, $alert){
        console.log('UserModifyInfoCtrl');
        $scope.init = function() {
            $scope.user_name = "假装有用户名";
            $scope.user_publicEmail = "django@python.css";
            $scope.user_info = "假装有一个非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的个人信息介绍";
            $scope.errormessage = "";
        };
        $scope.init();
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
                //console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if(!reg.test($scope.user_publicEmail)) {
                $scope.user_publicEmail = "";
                $scope.errormessage = "请输入正确的公开邮箱！";
                //console.log($scope.errormessage);
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
                //console.log(data);
                //$csrf.show_error(data.error);
                if(data.ErrorCode == 1){
                    $alert.showAlert(false, "修改成功！", function() {
                        $rootScope.$broadcast('userNameChange', $scope.user_name);
                        $location.url('/');
                    });
                }
                else {
                    $alert.showAlert(false, "修改失败！");
                    $scope.init();
                }
            });
        }

        $scope.confirmStatus = false;
        $scope.get_user_info();
        $scope.modifyPassword = function () {
            $location.url('/user/password');
        }
    }]).
    controller('UserModifyPassCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', 'AlertService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $alert){
        $scope.user_orgin_pass = "";
        $scope.user_pass = "";
        $scope.confirm = "";
        $scope.modifyPass = function () {
            if($scope.user_pass != $scope.confirm) {
                $scope.user_pass = "";
                $scope.confirm = "";
                $scope.errormessage = "两次输入密码不一致，请再次输入！";
                //console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            if($scope.user_pass.length>18 || $scope.user_pass.length<6) {
                $scope.user_pass = "";
                $scope.confirm = "";
                $scope.errormessage = "请输入长度为6~18的密码！";
                //console.log($scope.errormessage);
                $scope.alertError($scope.errormessage);
                return;
            }
            var param = {
                'UID': $user.userId,
                'UPassword': $scope.user_orgin_pass,
                'NewUPassword': $scope.user_pass
            };
            //console.log(param);
            $http.post(urls.api + "/user/password/modify", $.param(param)).success(function(res){
                //console.log(res);
                if(res.ErrorCode == 1){
                    $alert.showAlert(false, "修改成功！", function() {
                        $location.url('/');
                    });
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
    }]).
    controller('UserActListCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', 'AlertService',function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $alert){
        console.log('UserActListCtrl');
        if (!$user.isLogged()) {
            $location.url('/user/login');
        }
        $scope.init = function () {
            $scope.user_inact = [
                {"Title": "写后端", "Location": "宿舍", "StartTime": "2016-7-20", "EndTime": "2016-7-28", "Summary": "用django@python.shit写一大堆无聊冗长毫无意义的后端代码并把它们强行放到工程里冒充自己有很多代码量"},
                {"Title": "写前端逻辑", "Location": "宿舍", "StartTime": "2016-7-20", "EndTime": "2016-7-28", "Summary": "用angularJS写一大堆无聊冗长毫无意义的前段逻辑代码并把它们强行放到工程里冒充自己有很多代码量"},
                {"Title": "写前端样式", "Location": "宿舍", "StartTime": "2016-7-20", "EndTime": "2016-7-28", "Summary": "用HTML和less写一大堆无聊冗长毫无意义而且难看的前段样式代码并把它们强行放到工程里冒充自己有很多代码量"}
            ];
            $scope.user_organizedact = [
                {"Title": "写后端", "Location": "宿舍", "StartTime": "2016-7-20", "EndTime": "2016-7-28", "Summary": "用django@python.shit写一大堆无聊冗长毫无意义的后端代码并把它们强行放到工程里冒充自己有很多代码量"}
            ];
        };
        $scope.init();
        $scope.getActList = function() {
            //get in act 
        
            $http.get(urls.api + '/act/UAinfo/?UID=' + $user.userId).success(function(data) {
                console.log(data);
                if(data.ErrorCode == 1) {
                    console.log('succeed');
                    $scope.user_inact = data.InActivity;
                    $scope.user_organizedact = data.OrganizedActivity;
                    for(var i = 0; i < data.InActivity.length; i ++) {
                        $scope.user_inact[i].StartTime = getDate($scope.user_inact[i].StartTime);
                        $scope.user_inact[i].EndTime = getDate(scope.user_inact[i].EndTime);
                    }
                    for(var i = 0; i < data.OrganizedActivity.length; i ++) {
                        $scope.user_organizedact[i].StartTime = getDate($scope.user_organizedact[i].StartTime);
                        $scope.user_organizedact[i].EndTime = getDate($scope.user_organizedact[i].EndTime);
                    }
                }
                else {
                    console.log("get act list error");
                }
            });
        };
        $scope.getActInfo = function (index, value) {
            var id = -1;
            if(value == 0) {
                id = $scope.user_inact[index].AID;
            }
            else {
                id = $scope.user_organizedact[index].AID;
            }
            $location.url('/act/' + id + '/info');
            console.log(index);
        };
        $scope.getActList();
        $scope.noInact = false;
        $scope.noOrganizedact = false;
        if ($scope.user_inact.length == 0) {
            $scope.noInact = true;
        }
        if ($scope.user_organizedact.length == 0) {
            $scope.noOrganizedact = true;
        }
    }]).
    controller('ActivityCreateCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', 'AlertService',function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $alert){
        console.log('ActivityCreateCtrl');
        $scope.init = function() {
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
        };
        $scope.init();

        $scope.createAct = function () {
            var param = {
                'Admin': $user.userId,
                'Type': $scope.act_type,
                'MaxRegister': $scope.act_maxRegister,
                'EntryDDL': $scope.act_entryDDL.toISOString(),
                'StartTime': $scope.act_startDate.toISOString(),
                'EndTime': $scope.act_endDate.toISOString(),
                'Title': $scope.act_title,
                'Location': $scope.act_location,
                'Summary': $scope.act_summary,
                'Info': $scope.act_info
            };
            $http.post(urls.api + "/act/create", $.param(param)).success(function(res){
                console.log(res);
                var message;
                if(res.ErrorCode == 1){
                    message = "活动创建成功！\n 要去活动主页看看嘛？～";
                    $alert.showAlert(true, message, function(){
                        $location.url('/act/' + res.AID + '/info');
                    }, function(){
                        $location.url('/');
                    });
                }
                else {
                    message = "活动创建失败！请重试";
                    $alert.showAlert(false, message);
                    $scope.init();
                }
            });
            console.log($scope.act_startDate);
        }
    }]).
    controller('ActivityInfoCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', 'AlertService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $alert){
        console.log('ActivityInfoCtrl');
        $scope.init = function() {
            $scope.act_admin = "老师";
            $scope.act_title = "写大作业";
            $scope.act_location = "宿舍";
            $scope.act_startDate = "2016-7-20";
            $scope.act_endDate = "2016-7-29";
            $scope.act_entryDDL = "2016-7-28";
            $scope.types = act_types;
            $scope.act_type = $scope.types[3].name;
            $scope.act_info = "花10天时间写一个有很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多代码的大作业";
            $scope.isAdmin = false;
            $scope.act_maxRegister = 3;
            $scope.act_register = ["李俊杰", "卫国扬", "唐人杰", "某某某", "abc", "一个很长的名字作为测试", "日了狗了", "可以的很django"];
            $scope.act_unregister = ["你一点都不django", "django强无敌", "毕竟django", "python"];
        };
        $scope.init();
        $scope.get_act_info = function() {
            $http.get(urls.api + '/act/info/?AID=' + $routeParams.act_id).success(function(data) {
                //console.log(data);
                if(data.ErrorCode == 1) {
                    //update values
                    $scope.act_admin = data.Admin;
                    $scope.act_title = data.Title;
                    $scope.act_location = data.Location;
                    $scope.act_startDate = getDate(data.StartTime);
                    $scope.act_endDate = getDate(data.EndTime);
                    $scope.act_entryDDL = getDate(data.EntryDDL);
                    $scope.act_info = data.Info;
                    $scope.act_maxRegister = data.MaxRegister;
                    $scope.act_type = data.Type;
                    if(data.Admin == $user.userId) {
                        $scope.isAdmin = true;
                    }
                    else {
                        $user.guestAID = $routeParams.act_id;
                    }
                    console.log('get success');
                }
                else {
                    console.log("get act info error");
                }
            });
            $http.get(urls.api + '/act/ReInfo/?AID=' + $routeParams.act_id).success(function(data) {
                console.log(data);
                if(data.ErrorCode == 1) {
                    $scope.act_register = [];
                    $scope.act_unregister = [];
                    for(var i = 0; i < data.Register.length; i ++) {
                        $scope.act_register.push(data.Register[i].Name);
                    }
                    for(var i = 0; i < data.Unregister.length; i ++) {
                        $scope.act_unregister.push(data.Unregister[i].Name);
                    }
                    //console.log($scope.act_unregister);
                }
                else {
                    console.log('get register failed');
                }
            });
        };
        $scope.get_act_info();
        $scope.modifyInfo = function() {
            if(!$scope.isAdmin) {
                return;
            }
            $location.url('/act/' + $routeParams.act_id + '/manage');
        };
        $scope.verifyUser = function() {
            if(!$scope.isAdmin) {
                return;
            }
            //turn to verify page
            $location.url('/act/' + $routeParams.act_id + '/user');
        };
        $scope.deleteAct = function() {
            if(!$scope.isAdmin) {
                return;
            }
            var message = "你确定要删除这个活动吗？！";
            console.log(message);
            $alert.showAlert(true, message, function() {
                $http.get(urls.api + '/act/delete/?AID=' + $routeParams.act_id).success(function(res) {
                    if(res.ErrorCode == 1) {
                        $alert.showAlert(false, "删除活动成功！", function() {
                            $location.url('/');
                        });
                    }
                    else {
                        $alert.showAlert(false, "删除活动失败！请重试", function() {});
                    }
                });
            });
        };
        $scope.joinIn = function() {
             if($user.userId == null || $user.userId < 2) {
                $alert.showAlert(false, "您还没有登陆，请登陆后再加入心仪的活动！", function() {
                    $location.url('/');
                    return;
                });
                return;
            }
            //$user.userId = 19;
            var param = {
                'UID': $user.userId,
                'AID': parseInt($routeParams.act_id)
                //user id act id
            };
            //http post
            $http.post(urls.api + '/act/join', $.param(param)).success(function(res){
                console.log(res);
                console.log(param);
                var message;
                if(res.ErrorCode == 1){
                    message = "成功申请加入活动！请等待创建者审核，审核成功后会通过站内信和邮件通知，敬请查收～\n 要去活动主页看看嘛？～";
                    $alert.showAlert(true, message, function(){
                        $location.url('/act/' + $routeParams.act_id + '/info');
                    }, function(){
                        $location.url('/');
                    });
                }
                else if(res.ErrorCode == -1)  {
                    message = "您已经参加了这个活动！";
                    $alert.showAlert(false, message, function(){});
                    $scope.init();
                }
                else {
                    message = "加入活动失败！请重试";
                    $alert.showAlert(false, message, function(){});
                    $scope.init();
                }
            });
            //if 1 success message
            //if 0 error message
            //if -1 you have already join the act
        };
    }]).
    controller('ActivityManageCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', 'AlertService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $alert){
        console.log('ActivityManageCtrl');
        //data
        $scope.init = function() {
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
        };
        //function
        $scope.get_act_info = function() {
            $http.get(urls.api + '/act/info/?AID=' + $routeParams.act_id).success(function(data) {
                console.log(data);
                if(data.ErrorCode == 1) {
                    //update values
                    $scope.act_admin = data.Admin;
                    $scope.act_title = data.Title;
                    $scope.act_location = data.Location;
                    $scope.act_startDate = new Date(data.StartTime);
                    $scope.act_endDate = new Date(data.EndTime);
                    $scope.act_entryDDL = new Date(data.EntryDDL);
                    $scope.act_info = data.Info;
                    $scope.act_register = data.Register;
                    $scope.act_unregister = data.Unregister;
                    $scope.act_maxRegister = data.MaxRegister;
                    $scope.act_type = data.Type;
                    if(data.Admin == $user.userId) {
                        $scope.isAdmin = true;
                    }
                    else {
                        $location.url('/');
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
                'EntryDDL': $scope.act_entryDDL.toISOString(),
                'StartTime': $scope.act_startDate.toISOString(),
                'EndTime': $scope.act_endDate.toISOString(),
                'Title': $scope.act_title,
                'Location': $scope.act_location,
                'Summary': $scope.act_summary,
                'Info': $scope.act_info
            };
            $http.post(urls.api + '/act/modify', $.param(param)).success(function(res){
                var message;
                console.log(res);
                if(res.ErrorCode == 1){
                    message = "活动信息修改成功！\n 要去活动主页看看嘛？～";
                    $alert.showAlert(true, message, function(){
                        $location.url('/act/' + $routeParams.act_id + '/info');
                    }, function(){
                        $location.url('/');
                    });
                }
                else {
                    message = "活动信息修改失败！请重试";
                    $alert.showAlert(false, message);
                    $scope.init();
                }
            });
        };
        $scope.get_act_info();
    }]).
    controller('ActivityUserCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', 'AlertService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $alert){
        console.log('ActivityUserCtrl');
        //$scope.act_unregister = ["你一点都不django", "django强无敌", "毕竟django", "python"];
        $scope.act_register = [];
        $scope.act_unregister = [];
        $scope.act_register_id = [];
        $scope.act_unregister_id = [];

        $scope.getActUserList = function() {
            $http.get(urls.api + '/act/ReInfo/?AID=' + $routeParams.act_id).success(function(data) {
                console.log(data);
                if(data.ErrorCode == 1) {
                    $scope.act_register = [];
                    $scope.act_unregister = [];
                    for(var i = 0; i < data.Register.length; i ++) {
                        $scope.act_register.push(data.Register[i].Name);
                        $scope.act_register_id.push(data.Register[i].UID);
                    }
                    for(var i = 0; i < data.Unregister.length; i ++) {
                        $scope.act_unregister.push(data.Unregister[i].Name);
                        $scope.act_unregister_id.push(data.Unregister[i].UID);
                    }
                    //console.log($scope.act_unregister);
                }
                else {
                    console.log('get register failed');
                }
            });
        };

        $scope.getActUserList();

        $scope.checkMember = function(index, value) {
            //var chooseId = list data
            var param = {
                'UID': $scope.act_unregister_id[index],
                'AID': parseInt($routeParams.act_id)
            };
            console.log(param);
            if(value == 1) {
                //accept
                $http.post(urls.api + '/act/accept', $.param(param)).success(function(data) {
                    if (data.ErrorCode == 1) {
                        console.log("accept success");
                    }
                    else {
                        console.log("change user status error");
                    }
                });
            }
            else {
                //reject
                $http.post(urls.api + '/act/reject', $.param(param)).success(function(data) {
                    if (data.ErrorCode == 1) {
                        console.log("reject success");
                    }
                    else {
                        console.log("change user status error");
                    }
                });
            }

        };

        $scope.noRegister = false;
        $scope.noUnRegister = false;
        if ($scope.act_register.length == 0) {
            $scope.noRegister = true;
        }
        if ($scope.act_unregister.length == 0) {
            $scope.noUnRegister = true;
        }

        //$scope.act_register = ["Orz"];

    }]).
    controller('UserMsgCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', 'AlertService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $alert){
        console.log('UserMsgCtrl');
        $scope.user_sys_msg = [
            {"from": "系统", "date": "2016-7-20", "content": "你看到"},
            {"from": "系统", "date": "2016-7-20", "content": "这些消息"},
            {"from": "系统", "date": "2016-7-20", "content": "就说明"},
            {"from": "系统", "date": "2016-7-20", "content": "你的代码"},
            {"from": "系统", "date": "2016-7-20", "content": "还tm没写完"}
        ];
        $scope.user_user_msg = [{"from": "django", "date": "2016-7-20", "content": "你能看到就说明用户间通信还tm没写"}];
    }]);
