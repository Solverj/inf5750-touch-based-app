'use strict';


angular.module('myApp.view4', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view4/:id', {
            templateUrl: 'view4/view4.html',
            controller: 'View4Ctrl'
        });

        // $locationProvider.html5Mode(true);
    }])
    .controller('View4Ctrl', ['$http', '$scope', '$routeParams', function ($http, $scope, $routeParams) {
        $scope.messageId = ($routeParams.id);
        $http.get(dhi + '/api/me')
            .success(function (response) {
                $scope.me = response;
            });

    }]);

function messageController($scope, $http,$route) {

    $scope.messagrURL = dhi + "/api/messageConversations/" + $scope.messageId;
    $http.get($scope.messagrURL).success(function (result) {
        $scope.replyText = "";
        $scope.inboxList = [];
        $scope.json = result;
        // $scope.messageUserList = [];
        $scope.messageThread = result.messages;
        $scope.subject = result.subject;
        $scope.people = result.userMessages;
        for (var i = 0; i < result.messages.length; i++) {
            console.log(result.messages[i]);
            $scope.inboxList.push({"id": result.messages[i]});
        }

    });

    $scope.reply = function () {
        if($scope.text) {
            var urlTo = dhi + '/api/messageConversations/' + $scope.messageId;
            $http({
                method: 'post',
                url: urlTo,
                contentType: 'application/json',
                data: JSON.stringify($scope.text),
                async: false
            }).success(function () {
                console.log('well fk yeah?');
                $route.reload();
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
            });
            $scope.text = '';

        }

    }
}


//http://inf5750-30.uio.no/api/messageConversations/id