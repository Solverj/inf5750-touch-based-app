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

  $http.get(dhi + '/api/currentUser/inbox/messageConversations').success(function(response) {
        $scope.messageList = response;
      });

    $scope.showMessage = function(message){
        $location.path("#/view4/" + message.id);
    }

    $scope.header = 'Inbox';
}