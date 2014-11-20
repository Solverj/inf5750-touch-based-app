'use strict';

angular.module('myApp.view4', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view4/:id', {
    templateUrl: 'view4/view4.html',
    controller: 'View4Ctrl'
  });

     // $locationProvider.html5Mode(true);
}])

.controller('View4Ctrl', [function($rootScope, $scope, $routeParams, $route) {
    $rootScope.$on('$routeChangeSuccess', function ()  {
        console.log($routeParams.id);
      });
}]);

//http://inf5750-30.uio.no/api/messageConversations/id