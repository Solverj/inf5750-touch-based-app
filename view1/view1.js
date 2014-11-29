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

function retriveUserConversations($scope, $http) {
<<<<<<< HEAD
  $http.get(dhi + '/api/currentUser/inbox/messageConversations')
      .success(function(response) {
        $scope.messageList = response;
=======
  $http.get(dhi + '/api/currentUser/inbox/messageConversations').success(function(response) {
        $scope.messageList = response;

>>>>>>> origin/master
      });
}