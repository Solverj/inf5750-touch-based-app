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

function messageController($scope, $http,$route, dbService) {

    $scope.messagrURL = dhi + "/api/messageConversations/" + $scope.messageId;

    $http({
        method: 'get',
        url: $scope.messagrURL,
        contentType: 'application/json',
        async: false
    }).
        success(function (result) {
            $scope.subject = result.subject;
            $scope.people = result.userMessages;
            console.log($scope.people);
    }).
        error(function (result) {
            /*Offline - use database*/

            var id = $scope.messageId;
            dbService.getMessageConversation(id).then(function (msg) {
                console.log(id + msg);
                $scope.subject = msg.subject;
                $scope.people = msg.userMessages;
            });
    });

    $http({
        method: 'get',
        url: $scope.messagrURL+'/messages',
        contentType: 'application/json',
        async: false
        }).
        success(function (result) {
            $scope.replyText = "";
            $scope.inboxList = [];
            $scope.json = result;
            //$scope.messageUserList = [];
            $scope.messageThread = result.messages;
            $scope.subject = result.subject;
            $scope.people = result.userMessages;
            for (var i = 0; i < result.messages.length; i++) {
                $scope.inboxList.push({"id": result.messages[i]});
            }

        }).
        error(function () {
        /*Offline - use database*/
            var id = $scope.messageId;
            dbService.getMessageConversation(id).then(function (msg) {
                console.log(id + "," + msg);
                $scope.replyText = " You're offline. Replying is disabled.";
                $scope.inboxList = [];
                $scope.json = msg;
                $scope.messageUserList = [];
                $scope.messageThread = msg.messages;
                $scope.subject = msg.subject;
                $scope.people = msg.userMessages;

                for (var i = 0; i < msg.messages.length; i++) {
                    $scope.inboxList.push({"id": msg.messageData[i]});
                }
            });
        });

    $scope.mesageIdList=[];
    $scope.mesageIdList.push($scope.messageId);
    $http({
        method: 'post',
        url: dhi + "/api/messageConversations/read",
        contentType: 'application/json',
        data: JSON.stringify($scope.mesageIdList),
        async: false
    }).success(function(){

    }).error(function (data, status, headers, config) {
        console.log($scope.messageId);
            console.log(data, status, headers, config);
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