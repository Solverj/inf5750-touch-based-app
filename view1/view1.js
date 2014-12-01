'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {

}]);

function retriveUserConversations($scope, $http, $location) {

    $scope.showMessage  = function(id){
        $location.url('/view4/' + id);
    };

    $http.get(dhi + '/api/currentUser/inbox/messageConversations').success(function(response) {
        $scope.messageList = response;
      });

    $http.get(dhi + '/api/me')
        .success(function (response) {
            $scope.me = response.name;
        });
}

function actionController($scope, $http, $route){

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
            });
        }
    };
}