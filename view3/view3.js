'use strict';

angular.module('myApp.view3', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl'
        });
    }])

    .controller('View3Ctrl', ['$scope', '$http', function ($scope, $http) {
        $scope.send = function () {
            if ($scope.subject && $scope.text && $scope.to) {
                var message = {};
                message.subject = $scope.subject;
                message.text = $scope.text;
                message.organisationUnits = [];
                message.users = [];
                message.userGroups = [];
                console.log('inside if test');

                //running through users to find the one we said "to"
                $http.get(dhi + '/api/users')
                .success(function (response) {
                        var rsp = response;
                        var i;
                        console.log('inside getting test');
                        for(i = 0; i < rsp.users.length; i++){
                            if('John Traore' === rsp.users[i].name){
                                console.log(rsp.users[i].id);
                                message.users.push( { "id" : rsp.users[i].id } );
                                break;
                            }
                        }
                        //paste stuff
                        var send = $http({
                            method: 'post',
                            url: dhi + '/api/messageConversations',
                            contentType: 'application/json',
                            data: JSON.stringify(message),
                            async: false
                        }).success(function () {
                            console.log('well fk yeah?');
                        }).error(function (data, status, headers, config) {
                            console.log(data, status, headers, config);
                        });





                    });


            }//if test
            $scope.text ='';
            $scope.subject='';
            $scope.to='';

        };
    }]);

function getMe($scope, $http) {
    $http.get(dhi + '/api/me')
        .success(function (response) {
            $scope.me = response;
        });
}