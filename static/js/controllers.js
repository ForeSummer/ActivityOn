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
            // is null return error message
            var searchResult = -1;
            var keyWord = ["体育","调查","编程","学习","娱乐"];
            for(var i = 0; i < keyWord.length; i ++) {
                if($scope.search.match(keyWord[i])) {
                    searchResult = i;
                    break;
                }
            }
            $location.url('/user/' + searchResult + '/search');
            //get search result id
        };
        //logout
        $scope.logout = function(){
            if ($user.userId == null) {
                $location.url('/user/login');
                return;
            }
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
            $('#log_btn').attr('title', '登出');
            $('#logout-img').attr('class', 'fa fa-sign-out fa-2x');
            $("#nickname_tmp").css('display', 'none');
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
            $location.url('/user/login');
        }
        else {
            $scope.user_follow_num = 0;
            $scope.user_followed_num = 0;
            $scope.user_activity_num = 0;
            $scope.user_organize_num = 0;
            $scope.createActivity = function () {
                $location.url('/act/create');
            }
            $scope.user_suggest = ["学习", "体育", "娱乐"];
            $scope.search = function (content) {
                console.log(content);
            }
            $scope.getActList = function () {
                $location.url("/user/actlist");
            }
            $scope.timeLineStart = 0;
            $scope.timeLineEnd = 9;
            $scope.timeline = [];
            $scope.suggest = [
                {"aid": 0, "Title": "写后端", "Location": "宿舍", "StartTime": "2016-7-20", "EndTime": "2016-7-28", "Summary": "用django@python.shit写一大堆无聊冗长毫无意义的后端代码并把它们强行放到工程里冒充自己有很多代码量"},
                {"aid": 0, "Title": "写前端逻辑", "Location": "宿舍", "StartTime": "2016-7-20", "EndTime": "2016-7-28", "Summary": "用angularJS写一大堆无聊冗长毫无意义的前段逻辑代码并把它们强行放到工程里冒充自己有很多代码量"},
                {"aid": 0, "Title": "写前端样式", "Location": "宿舍", "StartTime": "2016-7-20", "EndTime": "2016-7-28", "Summary": "用HTML和less写一大堆无聊冗长毫无意义而且难看的前段样式代码并把它们强行放到工程里冒充自己有很多代码量"}
            ];
            $scope.suggest = [];
            $scope.getSuggest = function() {
                $http.get(urls.api + '/act/search/?Type= -1').success(function(data) {
                    if(data.ErrorCode == 1) {
                        for(var i = 0; i < data.ActList.length; i ++) {
                            var event = {};
                            event.aid = data.ActList[i].AID;
                            event.Title = data.ActList[i].Title;
                            event.Location = data.ActList[i].Location;
                            event.StartTime = getDate(data.ActList[i].StartTime);
                            event.EndTime = getDate(data.ActList[i].EndTime);
                            event.Summary = data.ActList[i].Summary;
                            $scope.suggest.push(event);
                        }
                    }
                    else{
                        console.log("get search error");
                    }
                });
            };
            $scope.getTimeLine = function() {
                var param = {
                    'UID': $user.userId,
                    'Start': $scope.timeLineStart,
                    'End': $scope.timeLineEnd
                };
                $http.post(urls.api + '/user/timeline', $.param(param)).success(function(data) {
                    console.log(data);
                    if(data.ErrorCode == 1) {
                        for(var i = 0; i < data.Timeline.length; i ++) {
                            var event = {};
                            if(data.Timeline[i].Type == 2) {
                                event.user = data.Timeline[i].Name;
                                event.followedUser = data.Timeline[i].AName;
                                event.uid = data.Timeline[i].UID;
                                event.aid = data.Timeline[i].AID;
                                event.ago = getTimeLeap(data.Timeline[i].Time,data.EndTime);
                                event.UAvatar = data.Timeline[i].Avatar;
                                event.AAvatar = data.Timeline[i].AAvatar;
                                event.type = data.Timeline[i].Type;
                                $scope.timeline.push(event);

                            }
                            else {
                                event.uid = data.Timeline[i].UID;
                                event.aid = data.Timeline[i].AID;
                                event.user = data.Timeline[i].Name;
                                event.type = data.Timeline[i].Type;
                                event.act = data.Timeline[i].Title;
                                event.ago = getTimeLeap(data.Timeline[i].Time,data.EndTime);
                                event.summary = data.Timeline[i].Summary;
                                event.UAvatar = data.Timeline[i].Avatar;
                                $scope.timeline.push(event);
                            }
                        }
                        $scope.timeLineStart += 10;
                        $scope.timeLineEnd += 10;
                    }
                    else {
                        console.log("get timeline error");
                    }
                    if ($scope.timeline.length == 0) {
                        $scope.hasFollow = false;
                    }
                });
            };
            $scope.getTimeLine();
            $scope.getSuggest();
            console.log($scope.timeline);
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
            };
            $scope.jumptoUser = function(id) {
                $location.url('/user/' + id + '/info');
            };
            $scope.jumptoAct = function(id) {
                $location.url('/act/' + id + '/info');
            };
            $scope.isSelf = function (id) {
                if (id == $user.userId) {
                    return true;
                }
                return false;
            }
            
            $scope.getConst = function() {
                $http.get(urls.api + '/user/const/?UID=' + $user.userId).success(function(data) {
                    if(data.ErrorCode == 1) {
                        console.log(data);
                        $scope.user_follow_num = data.Follow;
                        $scope.user_followed_num = data.Followed;
                        $scope.user_activity_num = data.InAct;
                        $scope.user_organize_num = data.OAct;
                        var tmp = parseInt($scope.user_follow_num);
                        $("#num1").val(tmp);
                        tmp = parseInt($scope.user_followed_num);
                        $("#num2").val(tmp);
                        tmp = parseInt($scope.user_activity_num);
                        $("#num3").val(tmp);
                        tmp = parseInt($scope.user_organize_num);
                        $("#num4").val(tmp);
                        anime();
                    }
                    else {
                        console.log("get const error");
                    }
                });
            };
            $scope.getConst();
        };
        $scope.jumpToStaticUser = function () {
            $location.url('/user/' + $user.userId + '/info');
        };
        $scope.jumpToStaticAct = function () {
            $location.url('/user/actlist');
        }
        //console.log("homepage");
        //get user info
        
        /*$scope.noSuggest = false;

            $scope.noSuggest = false;
            if ($scope.suggest.length == 0) {
                $scope.noSuggest = true;
            }
        }*/
        //console.log("homepage");
        //get user info
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
                        console.log(res.UID);
                        $location.url('/');
                    });
                    //$location.url('/');
                    console.log("login succeed");
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
            if ($scope.nickname.length>9 || $scope.nickname.length<3) {
                $scope.nickname = "";
                $scope.errormessage = "请输入长度为3~9字节的昵称！";
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
                'nickname': $scope.nickname,
                'Avatar': '/static/images/default_' + random + '.png'
            };
            //console.log(param);
            $http.post(urls.api + "/user/regist", $.param(param)).success(function(data){
                //console.log(data);
                //$csrf.show_error(data.error);
                if(data.ErrorCode == 1){
                    $user.create(1,data.UID);
                    var mail = {
                        "api_user": "activityon_test_SDlkX8",
                        "api_key": "1PTTvfwTzh627yVb",
                        "from": "activityon@126.com",
                        "to": $scope.privateemail,
                        "html": "恭喜您已注册成功，祝您使用Activityon愉快!",
                        "subject": "ActivityOn注册成功通知"
                    }
                    $http.post("https://sendcloud.sohu.com/webapi/mail.send.xml", $.param(mail)).success(function(data){
                    });
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
            $alert.showAlert(false, msg, function(){});
        }
        //$scope.confirmStatus = false;
    }]).
    controller('UserInfoCtrl', ['$scope', '$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'AlertService', function($scope, $window, $http, $csrf, urls, $filter, $routeParams, $user, $location, $alert){
        console.log('UserInfoCtrl');
        //defualt is false
        $scope.isMe = false;
        $scope.isFollowed = false;
        $scope.user_name = "NickName";
        $scope.user_publicEmail = "email@wtf.com";
        $scope.user_info = "";
        $scope.user_avatar = "/static/images/admin.png";
        $scope.user_inact = [
            {"Title": "写后端", "Location": "宿舍", "StartTime": "2016-7-20", "EndTime": "2016-7-28", "Summary": "用django@python.shit写一大堆无聊冗长毫无意义的后端代码并把它们强行放到工程里冒充自己有很多代码量"},
            {"Title": "写前端逻辑", "Location": "宿舍", "StartTime": "2016-7-20", "EndTime": "2016-7-28", "Summary": "用angularJS写一大堆无聊冗长毫无意义的前段逻辑代码并把它们强行放到工程里冒充自己有很多代码量"},
            {"Title": "写前端样式", "Location": "宿舍", "StartTime": "2016-7-20", "EndTime": "2016-7-28", "Summary": "用HTML和less写一大堆无聊冗长毫无意义而且难看的前段样式代码并把它们强行放到工程里冒充自己有很多代码量"}
        ];
        $scope.jumptoAct = function(id) {
            $location.url('/act/' + id + '/info');
        };
        $scope.user_follow = [];
        $scope.user_followed = [];
        $scope.user_follow_avatar = [];
        $scope.user_followed_avatar = [];
        $scope.user_follow_id = [];
        $scope.user_followed_id = [];
        $scope.user_publicEmailLink = "mailto:" + $scope.user_publicEmail;
        $scope.noInfo = false;
        $scope.nofollow = false;
        $scope.nofollowed = false;
        $scope.noInAct = false;
        //console.log($routeParams.user_id);
        $scope.get_user_info = function() {
            $http.get(urls.api + '/user/info/?UID=' + $routeParams.user_id).success(function(data) {
                //console.log(data);
                if(data.ErrorCode == 1) {
                    $scope.user_avatar = data.UAvatar;
                    $scope.user_name = data.UName;
                    $scope.user_publicEmail = data.UPublicEmail;
                    $scope.user_info = data.UInfo;
                    $scope.user_publicEmailLink = "mailto:" + data.UPublicEmail;
                }
                else {
                    console.log("get info error");
                }
                if ($scope.user_info.length == 0) {
                    $scope.noInfo = true;
                }
            });
            $http.get(urls.api + '/user/followInfo/?UID=' + $routeParams.user_id).success(function(data) {
                if(data.ErrorCode == 1) {
                    for(var i = 0; i < data.Follow.length; i ++) {
                        $scope.user_follow.push(data.Follow[i].Name);
                        $scope.user_follow_avatar.push(data.Follow[i].Avatar);
                        $scope.user_follow_id.push(data.Follow[i].UID);
                    }
                    for(var i = 0; i < data.Followed.length; i ++) {
                        $scope.user_followed.push(data.Followed[i].Name);
                        $scope.user_followed_avatar.push(data.Followed[i].Avatar);
                        $scope.user_followed_id.push(data.Followed[i].UID);
                    }
                }
                else {
                    console.log("get follow info error");
                }
                if ($scope.user_follow.length == 0) {
                    $scope.nofollow = true;
                }
                if ($scope.user_followed.length == 0) {
                    $scope.nofollowed = true;
                }
            });
            if($scope.isMe) {
                $http.get(urls.api + '/act/UAinfo/?UID=' + $user.userId).success(function(data) {
                    console.log(data);
                    if(data.ErrorCode == 1) {
                        console.log('succeed');
                        if(data.InActivity.length > 3) {
                            $scope.user_inact = data.InActivity.slice(0,2);
                        }
                        else{
                            $scope.user_inact = data.InActivity;
                        }
                        if(data.OrganizedActivity.length > 3) {
                            $scope.user_organizedact = data.OrganizedActivity.slice(0,2);
                        }
                        else {
                            $scope.user_organizedact = data.OrganizedActivity;
                        }
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
                    if ($scope.user_inact.length == 0) {
                        $scope.noInact = true;
                    }
                });
            }
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
            $http.post(urls.api+ '/user/isFollowed', $.param(param)).success(function(data) {
                if(data.ErrorCode) {
                    $scope.isFollowed = data.isFollowed;
                }
                else {
                    console.log("get follow status error");
                }
            });
            $scope.isShowFollow = !$scope.isMe && !$scope.isFollowed;
            $scope.isShowUnFollow = !$scope.isMe && $scope.isFollowed;
        };
        $scope.getFollowStatus();
        $scope.get_user_info();

        $scope.follow_user = function () {
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
        };
        $scope.unfollow_user = function () {
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

        if ($scope.user_inact.length == 0) {
            $scope.noInAct = true;
        }

        $scope.jumpToUser = function (id, type) {
            if (type == 0) {
                $location.url('/user/' + $scope.user_follow_id[id] + '/info');
            } else {
                $location.url('/user/' + $scope.user_followed_id[id] + '/info');
            }
        };
        $scope.getAvatar = function (id, type) {
            if (type == 0) {
                return $scope.user_follow_avatar[id];
            } else {
                return $scope.user_followed_avatar[id];
            }
        };
    }]).
    controller('UserModifyInfoCtrl', ['$scope', '$rootScope','$window', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$location', 'AlertService', 'FileUploader', function($scope, $rootScope,$window, $http, $csrf, urls, $filter, $routeParams, $user, $location, $alert, FileUploader){
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
                $scope.errormessage = "请输入长度为3~9的昵称！";
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
            uploader.uploadAll();
        }
        $scope.get_user_info();
        $scope.modifyPassword = function () {
            $location.url('/user/password');
        };
        var uploader = $scope.uploader = new FileUploader({
            url: urls.api + "/user/changeAvatar?UID="+$user.userId
        });
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
            $scope.showAlert(false, msg, function(){});
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
                        $scope.user_inact[i].EndTime = getDate($scope.user_inact[i].EndTime);
                    }
                    for(var i = 0; i < data.OrganizedActivity.length; i ++) {
                        $scope.user_organizedact[i].StartTime = getDate($scope.user_organizedact[i].StartTime);
                        $scope.user_organizedact[i].EndTime = getDate($scope.user_organizedact[i].EndTime);
                    }
                }
                else {
                    console.log("get act list error");
                }
                if ($scope.user_inact.length == 0) {
                    $scope.noInact = true;
                }
                if ($scope.user_organizedact.length == 0) {
                    $scope.noOrganizedact = true;
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
            $scope.showParticipate = true;
            $scope.showCancel = false;
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
                        $scope.showParticipate = false;
                        $scope.showCancel = false;
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
            var param = {
                'UID': $user.userId,
                'AID': parseInt($routeParams.act_id)
            };
            $http.post(urls.api + '/user/ispart', $.param(param)).success(function(data) {
                console.log(data);
                if(data.ErrorCode == 1) {
                    if(data.IsParticipated) {
                        $scope.showParticipate = false;
                        $scope.showCancel = true;
                    }
                    else {
                        $scope.showParticipate = true;
                        $scope.showCancel = false;
                    }
                }
                else {
                    console.log("get is participate error");
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
        };
        $scope.quit = function() {
            $alert.showAlert(true, "真的要取消报名吗？",function() {
                var param = {
                    'UID': $user.userId,
                    'AID': parseInt($routeParams.act_id)
                };
                $http.post(urls.api + '/user/unregist', $.param(param)).success(function(data) {
                    console.log(data);
                });
            }, function() {});
        };

        $('#qrcode').qrcode({width: 100,height: 100,text: urls.host + '/act/' + $routeParams.act_id + '/info'});
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
                if ($scope.act_register.length == 0) {
                    $scope.noRegister = true;
                }
                if ($scope.act_unregister.length == 0) {
                    $scope.noUnRegister = true;
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
    }]).
    controller('TestCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', 'AlertService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $alert){
        var testUser1 = ['ljj@a.b', '111111', 'a@a.a', '李俊杰', '1'];
        var testUser2 = ['trj@a.b', '111111', 'a@a.a', '唐人杰', '2'];
        var testUser3 = ['wgy@a.b', '111111', 'a@a.a', '卫国扬', '3'];
        var userId = [2,3,4];
        var actId = [1,2,3];
        $scope.registUser = function(user) {
            var param = {
                'privateemail': user[0],
                'password': user[1],
                'openemail': user[2],
                'nickname': user[3],
                'Avatar': '/static/images/default_' + user[4] + '.png'
            };
            $http.post(urls.api + "/user/regist", $.param(param)).success(function(data){
                console.log(data);
                //$csrf.show_error(data.error);
                if(data.ErrorCode == 1){
                    console.log("success");
                    userId[parseInt(user[4])] = data.UId;
                }
                else {
                    console.log("regist error");
                }
            });
        };
        $scope.follow_user = function (id1, id2) {
            var param = {
                'UID': id1,
                'FollowID': id2
            };

            $http.post(urls.api + '/user/follow', $.param(param)).success(function(data) {
                if(data.ErrorCode == 1) {
                    //$alert.showAlert(false, "关注用户成功！",function(){});
                    //$scope.isFollowed = true;
                    console.log("succeed");
                }
                else {
                    console.log("follow error");
                }
            });
        };
        //$scope.follow_user(userId[0], userId[2]);
        /*$scope.registUser(testUser1);
        setTimeout(function(){
            $scope.registUser(testUser2);
            setTimeout(function(){
                $scope.registUser(testUser3);
            },500);
        },500);*/
        
        
        /*$scope.follow_user(userId[0], userId[1]);
        setTimeout(function(){
            $scope.follow_user(userId[1], userId[0]);
            setTimeout(function(){
                $scope.follow_user(userId[0], userId[2]);
                setTimeout(function(){
                    $scope.follow_user(userId[1], userId[2]);
                    setTimeout(function(){
                        $scope.follow_user(userId[2], userId[1]);
                        setTimeout(function(){
                            $scope.follow_user(userId[2], userId[0]);
                            
                        },500);
                    },500);
                },500);
            },500);
        },500);*/
        
        
        
        
        
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
        var i = 0;
        $scope.createAct = function (user) {
            var param = {
                'Admin': user,
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
                    console.log('creat succeed');
                    actId[i] = res.AID;
                    i++;
                }
                else {
                    console.log('error');
                }
            });
        };
        /*$scope.createAct(userId[0]);
        setTimeout(function(){
            $scope.createAct(userId[1]);
            setTimeout(function(){
                $scope.createAct(userId[2]);
            },500);
        },500);*/
        
        
        //console.log(actId);
        $scope.join = function(user, act) {
            var param = {
                'UID': user,
                'AID': act
                //user id act id
            };
            //http post
            $http.post(urls.api + '/act/join', $.param(param)).success(function(res){
                console.log(res);
                console.log(param);
                var message;
                if(res.ErrorCode == 1){
                    console.log("success");
                }
                else if(res.ErrorCode == -1)  {
                    
                }
                else {
                    
                }
            });
        }

        /*$scope.join(userId[1], actId[0]);
        setTimeout(function(){
            $scope.join(userId[2], actId[0]);
            setTimeout(function(){
                $scope.join(userId[0], actId[1]);
                setTimeout(function(){
                    $scope.join(userId[2], actId[1]);
                    setTimeout(function(){
                        $scope.join(userId[0], actId[2]);
                        setTimeout(function(){
                            $scope.join(userId[1], actId[2]);
                        },500);
                    },500);
                },500);
            },500);  
        },500);*/
        
        
        var param = {
                'UID': 3,
                'AID': 2
            };
           
                $http.post(urls.api + '/user/unregist', $.param(param)).success(function(data) {
                    console.log(data);
                });
        
        /*$scope.follow_user(25,26);
        setTimeout(function(){
            $scope.follow_user(2,1);
        },1000);
        setTimeout(function(){
            //$scope.follow_user(26,27);
        },1000);
        setTimeout(function(){
            //$scope.follow_user(25,27);
        },1000);*/
        /*$scope.init = function() {
            $scope.follow_user(2,3);
        },1000);
        setTimeout(function(){
            $scope.follow_user(1,3);
        },1000);
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
                'Admin': 1,
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
                    console.log('creat succeed');
                }
                else {
                    //message = "活动创建失败！请重试";
                    //$alert.showAlert(false, message);
                    //$scope.init();
                    console.log('error');
                }
            });
            //console.log($scope.act_startDate);
        };*/
        //$scope.createAct();
        /*var end = "2016-07-26 23:27:55.356013";
        var start = "2016-07-26 23:08:22.145142";
        console.log(start);
        var str = getTimeLeap(start, end);
        console.log(str);*/
    }]).
    controller('UserMsgCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', 'AlertService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $alert){
        console.log('UserMsgCtrl');
        /*$scope.user_sys_msg = [
            {"from": "系统", "date": "2016-7-20", "type": 0, "id": 0, "title": ""},
            {"from": "系统", "date": "2016-7-20", "type": 1, "id": 0, "title": "活动(创建测试)"},
            {"from": "系统", "date": "2016-7-20", "type": 2, "id": 0, "title": "活动(报名测试)"},
            {"from": "系统", "date": "2016-7-20", "type": 3, "id": 0, "title": "活动(批准测试)"},
            {"from": "系统", "date": "2016-7-20", "type": 4, "id": 0, "title": "活动(拒绝测试)"},
            {"from": "系统", "date": "2016-7-20", "type": 5, "id": 0, "title": "用户(followed)测试"},
            {"from": "系统", "date": "2016-7-20", "type": 6, "id": 0, "title": "用户(follow)测试"}
        ];*/
        $scope.user_sys_msg = [];
        $scope.user_user_msg = [{"from": "系统", "date": "2016-7-20", "content": "此功能暂未开放"}];
        $scope.msgUrl = function (type, id) {
            if (type == 0) {
                return "/";
            } else if (type == 1 || type == 2 || type == 3 || type == 4) {
                return "/act/" + id + "/info";
            } else {
                return "/user/" + id + "/info";
            }
        }
        $scope.msgTitle = function (type, title) {
            if (type == 0) {
                return "注册成功";
            } else if (type == 1) {
                return "活动" + title + "创建成功";
            } else if (type == 2) {
                return "活动" + title + "报名成功";
            } else if (type == 3) {
                return "您已被活动" + title + "批准";
            } else if (type == 4) {
                return "您已被活动" + title + "拒绝";
            } else if (type == 5) {
                return "" + title + "follow了你";
            } else {
                return "您已follow" + title;
            }
        }
        $scope.msgContent = function (type, title) {
            if (type == 0) {
                return "恭喜您已注册成功，欢迎加入ActivityOn";
            } else if (type == 1) {
                return "您已成功创建活动" + title;
            } else if (type == 2) {
                return "您已成功报名活动" + title;
            } else if (type == 3) {
                return "您已被活动" + title + "批准，请按时参加该活动";
            } else if (type == 4) {
                return "您已被活动" + title + "拒绝";
            } else if (type == 5) {
                return "" + title + "刚刚follow了你";
            } else {
                return "您已成功follow了" + title + "，今后您将接收到来自他的动态";
            }
        }
        $scope.jump = function (type, id) {
            $location.url($scope.msgUrl(type, id));
        };
        $scope.messageStart = 0;
        $scope.messageEnd = 9;

        $scope.getMessage = function() {
            var param = {
                'UID': $user.userId,
                'Start': $scope.messageStart,
                'End': $scope.messageEnd
            };
            $http.post(urls.api + '/user/message', $.param(param)).success(function(data) {
                console.log(data);
                if(data.ErrorCode == 1) {
                    //access data
                    for(var i = 0; i < data.Timeline.length; i ++) {
                        var event = {};
                        event.from = "系统",
                        event.date = getTimeLeap(data.Timeline[i].Time, data.EndTime);
                        event.type = data.Timeline[i].Type;
                        if(event.type >= 1 && event.type <= 4) {
                            event.id = data.Timeline[i].AId;
                            event.title = data.Timeline[i].Title;
                        }
                        else if (event.type > 4) {
                            event.id = data.Timeline[i].FUID;
                            event.title = data.Timeline[i].Name;
                        }
                        else {
                            event.title = "";
                        }
                        $scope.user_sys_msg.push(event);
                    }
                    $scope.messageStart += 10;
                    $scope.messageEnd += 10;
                }
                else {
                    console.log('getMessage error');
                }
            });
        };
        $scope.getMessage();
    }]).
    controller('UserSearchCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', '$cookies', '$location', 'AlertService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user, $cookies, $location, $alert){
        console.log('UserSearchCtrl');
        $scope.result = [];
        $scope.suggest = [];
        $scope.getActInfo = function () {
            $http.get(urls.api + '/act/search/?Type=' + $routeParams.search_id).success(function(data) {
                if(data.ErrorCode == 1) {
                    if(data.TypeList.length != 0) {
                        for(var i = 0; i < data.TypeList.length; i ++) {
                            var event = {};
                            event.aid = data.TypeList[i].AID;
                            event.Title = data.TypeList[i].Title;
                            event.Location = data.TypeList[i].Location;
                            event.StartTime = getDate(data.TypeList[i].StartTime);
                            event.EndTime = getDate(data.TypeList[i].EndTime);
                            event.Summary = data.TypeList[i].Summary;
                            $scope.result.push(event);
                        }
                    }
                    for(var i = 0; i < data.ActList.length; i ++) {
                        var event = {};
                        event.aid = data.ActList[i].AID;
                        event.Title = data.ActList[i].Title;
                        event.Location = data.ActList[i].Location;
                        event.StartTime = getDate(data.ActList[i].StartTime);
                        event.EndTime = getDate(data.ActList[i].EndTime);
                        event.Summary = data.ActList[i].Summary;
                        $scope.suggest.push(event);
                    }
                }
                else{
                    console.log("get search error");
                }
                if ($scope.result.length != 0) {
                    $scope.noResult = false;
                }
                if ($scope.suggest.length != 0) {
                    $scope.noSuggest = false;
                }
            });
        };
        $scope.getActInfo();
        $scope.noResult = true;
        $scope.noSuggest = true;
        
        $scope.jumptoAct = function(id) {
            $location.url('/act/' + id + '/info');
        };
    }]);
