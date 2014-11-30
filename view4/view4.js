'use strict';


angular.module('myApp.view4', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view4/:id', {
            templateUrl: 'view4/view4.html',
            controller: 'View4Ctrl'
        });

        // $locationProvider.html5Mode(true);
    }])
    .controller('View4Ctrl', ['$scope', '$routeParams', function($scope, $routeParams) {
        $scope.messageId = ($routeParams.id);

    }]);

function messageController($scope, $http) {

    $scope.messagrURL = dhi + "/api/messageConversations/" + $scope.messageId;
    $scope.replyText = "";

    $http.get(dhi + '/api/me/').success(function(result){
       $scope.me = result;
    });

    $http.get($scope.messagrURL).success(function(result) {
        $scope.messageObject = result;
        $scope.inboxList = [];
        // $scope.messageUserList = [];
        $scope.messageThread = result.messages;
        $scope.subject = result.subject;
        $scope.people = result.userMessages;
        for(var i = 0; i < result.userMessages.length; i++){
            $scope.inboxList.push({"name": $scope.people[i].user.name,text:$scope.messageThread[i].name });
        }
        /* for (var i = 0; i < result.userMessages.length; i++) {
         $scope.messageUserList.push({"id": result.userMessages[i].user.id});
         lastSender":{"id":"xE7jOejl9FI","name":"John Traore"
         }*/
    });

    $scope.reply = function(){
        console.log("C");
        $scope.messageObject.lastUpdated = $scope.messageObject.lastUpdated;
        $scope.messageObject.lastSender = {'id': $scope.me.id, 'name': $scope.me.name};
        $scope.messageObject.messages.push({"name":$scope.replyText});
        $scope.messageObject.userMessages.push({"user":{"id": $scope.me.id, "name": $scope.me.name}});
        console.log(JSON.stringify($scope.messageObject));
        var send = $http({
            method: 'post',
            url: dhi + '/api/messageConversations/' + $scope.messageId,
            contentType: 'application/json',
            data: JSON.stringify($scope.messageObject),
            async: false
        }).success(function () {
            console.log('ok');
        }).error(function (data, status, headers, config) {
            console.log(data, status, headers, config);
        });
        $scope.list = [];
    };
}

//http://inf5750-30.uio.no/api/messageConversations/id