'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('act.services', []).
    value('version', '0.1').
    service('CsrfService', ['$cookies' ,function($cookies){
        return {
            'val': function() {
                return $cookies.csrftoken;
            },
            'set_csrf': function(data) {
                data['csrfmiddlewaretoken'] = $cookies.csrftoken;
            },
            'set_csrf_array': function(data){
                data.push({'csrfmiddlewaretoken': $cookies.csrftoken});
            },
            'format_error': function(error) {
                if(error.code == 1){
                    error.type = 'success';
                }else{
                    error.type = 'danger';
                }
                error.show = true;
                //console.log(error.message);
                return error;
            }
        };
    }]).
    service('AlertService', ['$mdDialog', function($mdDialog) {
        this.showAlert = function(isAbleToCancel, msg, yesFunc, noFunc, ev) {
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
                ).then(function() {
                    yesFunc();
                });
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
        return this;
    }]).
    service('UserService', function () {
        this.id = null;
        this.userId = null;
        this.guestAID = null;
        console.log("init");
        this.create = function (sessionId, userId) {
            console.log("Session create");
            this.id = sessionId;
            this.userId = userId;
        };
        this.destory = function () {
            console.log("Session destory");
            this.id = null;
            this.userId = null;
            this.guestAID = null;
        };
        this.isLogged = function() {
            if (this.userId >= 1) {
                return true;
            }
            return false;
        }
        return this;
   
    });
