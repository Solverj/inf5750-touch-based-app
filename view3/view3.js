'use strict';

angular.module('myApp.view3', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl'
        });
    }])

    .controller('View3Ctrl', [function () {

    }]);

function getMe($scope, $http) {
    console.log('k');
    $http.get(dhi + '/api/me')
        .success(function (response) {
            $scope.email = response;
            console.log(response)
        });
}