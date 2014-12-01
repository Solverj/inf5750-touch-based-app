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




function retrieveUserConversations($scope, $http) {

    var test = $http.get(dhi + '/api/currentUser/inbox/messageConversations');

    test.success(function (response) {
        $scope.messageList = response;
        addAllMessages(response);
    });

    test.error(function (response) {
       $scope.messageList = getAllMessages();
    });

}