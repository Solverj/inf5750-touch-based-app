'use strict';

var view1App = angular.module('myApp.view1', ['ngRoute', 'indexedDB_messageapp']);

view1App.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}]);

view1App.controller('View1Ctrl', function($scope, $window, dbService, $http) {
   // $scope.messageList = retrieveUserConversations.getMessages;
/*    $http.get(dhi + '/api/currentUser/inbox/messageConversations').success(function (response) {
        addAllMessages(response);
    });*/
    var vm = this;
    vm.todos = [];
    vm.user;

    vm.refreshList = function () {
        dbService.getAllMessages().then(function (data) {
            vm.todos = data;
            $scope.messageList = vm.todos;

            $http.get(dhi + '/api/me')
                .success(function (response) {
                    $scope.me = response.name;
                });

        }, function (err) {
            console.log("Error in getting database data.");
        });
    };

    function init() {
        dbService.open().then(function () {
            //if this is success full we should "refresh" our database with the server.
            $http.get(dhi + '/api/currentUser/inbox/messageConversations').success(function (response) {
                dbService.clearDatabase(response);
                dbService.addAllMessages(response);
            });

            //And then retrieve from the database. see above.
           vm.refreshList();
        });
    }
    init();
});

function actionController($scope, $http, $route, dbService){

    $scope.markAsRead = function(id){
        if(id) {
            var mesageIdList = [];
            mesageIdList.push(id);
            $http({
                method: 'post',
                url: dhi + "/api/messageConversations/read",
                contentType: 'application/json',
                data: JSON.stringify(mesageIdList),
                async: false
            }).success(function () {
                $route.reload();
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);

                /* we are offline. Use database. */
                var a = dbService.getMessage(id);
                a.read = true;
                dbService.addMessage(a);
                $route.reload();
            });
        }
    };

    $scope.markAsUnread = function(id){
        if(id) {
            var mesageIdList = [];
            mesageIdList.push(id);
            $http({
                method: 'post',
                url: dhi + "/api/messageConversations/unread",
                contentType: 'application/json',
                data: JSON.stringify(mesageIdList),
                async: false
            }).success(function () {
                $route.reload();

            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);

                /*Using database instead of online.*/
                var a = dbService.getMessage(id);
                a.read = false;
                dbService.addMessage(a);
                $route.reload();
            });
        }
    };

    $scope.deleteMessage = function(id){
        if(id){
            var mesageIdList=[];
            mesageIdList.push(id);
            $http({
                method: 'delete',
                url: dhi + "/api/messageConversations/" + id,
                contentType: 'application/json',
                async: false
            }).success(function(){
                $route.reload();


            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
                /* offline, use database*/
                dbService.deleteMessageByID(id);
                $route.reload();
            });
        }
    };
}