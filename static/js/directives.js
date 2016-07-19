'use strict';

/* Directives */


angular.module('act.directives', []).
    directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]).
    directive('userNav', ['urls', '$location', function(urls, $location){
        return {
            restrict: 'E',
            scope: {
                page: '=page'
            },
            controller: function($scope){
                $scope.pages_tab = {
                    'userinfo': {
                        'text': '个人信息管理',
                        'active': false,
                        'url': '/user/maintain_info'
                    },
                    'item': {
                        'text': '基地、计划、项目、导师管理',
                        'active': false,
                        'url': '/item/create'
                    },
                    'message': {
                        'text': '站内消息',
                        'active': false,
                        'url': '/user/message'
                    },
                    'ability': {
                        'text': '个人能力点',
                        'active': false,
                        'url': '/user/point'
                    }
                };
                $scope.pages_tab[$scope.page].active = true;
                $scope.url = function(url){
                    $location.url(url);
                };
            },
            templateUrl: urls.part + '/manager_nav.html'
        };
    }]).
    directive('errorMessage', ['urls', function(urls){
        return {
            restrict: 'E',
            scope: {
                error: '=error'
            },
            controller: function($scope){
//                console.log($scope.error);
            },
            templateUrl: urls.part + '/error_message.html'
        };
    }]).
    directive('aipsRegForm', ['urls', function(urls){
        return {
            restrict: 'E',
            scope: {
                formlist: '=?',
                formdata: '=?'
            },
            controller: function($scope){
                //console.log($scope.formlist);
            },
            templateUrl: urls.part + '/reg_form.html'
        };
    }]).
    directive('aipsFormUnit', ['urls', function(urls){
        return {
            restrict: 'E',
            scope: {
                unitinfo: '=?',
                formdata: '=?',
                width: '=?'
            },
            controller: function($scope){
                //console.log($scope.unitinfo);
                // Need to optimize
                $scope.init_checkbox = function(){
                    for(var index in $scope.unitinfo.extra_list){
                        var idx = $scope.formdata[$scope.unitinfo.label].indexOf($scope.unitinfo.extra_list[index].value);
                        if(idx > -1){
                            $scope.unitinfo.extra_list[index].checked = 'checked';
                        }
                    }
                };
                if($scope.unitinfo.type=='checkbox'){
                    $scope.formdata[$scope.unitinfo.label] = [];
                    $scope.init_checkbox();
                }
                $scope.toggleCheck = function(val){
                    var idx = $scope.formdata[$scope.unitinfo.label].indexOf(val);
                    if(idx > -1){
                        $scope.formdata[$scope.unitinfo.label].splice(idx, 1);
                    }else{
                        $scope.formdata[$scope.unitinfo.label].push(val);
                    }
                    console.log($scope.formdata);
                };
            },
            templateUrl: urls.part + '/form_unit.html'
        };
    }]).
    directive('unitEdit', ['urls', function(urls){
        return {
            restrict: 'E',
            scope: {
                unit_info: '=unitInfo'
            },
            controller: function($scope){
                $scope.unit_types = [{
                    'text': '文本填空',
                    'value': 'text'
                },{
                    'text': '单选',
                    'value': 'radio'
                },{
                    'text': '多选',
                    'value': 'checkbox'
                },{
                    'text': '长文本',
                    'value': 'textarea'
                }];
                $scope.type_map = {
                    'text': '文本填空',
                    'radio': '单选',
                    'checkbox': '多选',
                    'textarea': '长文本'
                };
                $scope.showadd = false;
                $scope.tmp_option = '';
                $scope.show_add = function(){
                    $scope.showadd = true;
                };
                $scope.cancel = function(){
                    $scope.showadd = false;
                };
                $scope.add_option = function(){
                    $scope.unit_info.extra_list.push({'text': $scope.tmp_option, 'value': $scope.tmp_option});
                    $scope.tmp_option = '';
                };
                $scope.del_option = function(index){
                    $scope.unit_info.extra_list.splice(index, 1);
                };
            },
            templateUrl: urls.part + '/unit_edit.html'
        };
    }]).
    directive('regFormEdit', ['urls', function(urls){
        return {
            restrict: 'E',
            scope: {
                form_list: '=sform'
            },
            controller: function($scope){
                var counter = 5;
                $scope.unit_types = [{
                    'text': '文本填空',
                    'value': 'text'
                },{
                    'text': '单选',
                    'value': 'radio'
                },{
                    'text': '多选',
                    'value': 'checkbox'
                },{
                    'text': '长文本',
                    'value': 'textarea'
                }];

                $scope.list_remove = function(index){
                    $scope.form_list.splice(index, 1);
                };

                var count_max_label = function(form_list){
                    var counter = 0;
                    for(var index in form_list){
                        if(form_list[index]['label'] == 'name' || form_list[index]['label'] == 'email' || form_list[index]['label'] == 'cellphone'){
                            continue;
                        }
                        var tmp_counter = parseInt(form_list[index]['label'].substring(5, form_list[index]['label'].length));
                        if(tmp_counter > counter){
                            counter = tmp_counter;
                        }
                    }
                    return counter;
                };
                $scope.add_form_unit = function(type){
                    var counter = count_max_label($scope.form_list) + 1;
                    if(type == 'text'){
                        $scope.form_list.push({type: 'text', label: 'label' + counter, required: false, display: 'display', explanation: '', 'extra_list': []});
                    }else if(type == 'radio'){
                        $scope.form_list.push({type: 'radio', label: 'label' + counter, required: false, display: 'display', explanation: '', 'extra_list': []});
                    }else if(type == 'checkbox'){
                        $scope.form_list.push({type: 'checkbox', label: 'label' + counter, required: false, display: 'display', explanation: '', 'extra_list': []});
                    }else if(type == 'textarea'){
                        $scope.form_list.push({type: 'textarea', label: 'label' + counter, required: false, display: 'display', explanation: '', 'extra_list': []});
                    }
                };
            },
            templateUrl: urls.part + '/form_edit.html'
        };
    }]);
