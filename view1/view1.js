'use strict';

var view1App = angular.module('myApp.view1', ['ngRoute', 'indexedDB_messageapp']);

view1App.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}]);

view1App.controller('View1Ctrl', function($scope, $window, dbService, $http) {
   // $scope.messageList = retrieveUserConversations.getMessages;
/*    $http.get(dhi + '/api/currentUser/inbox/messageConversations').success(function (response) {
        addAllMessages(response);
    });*/
    var vm = this;
    vm.todos = [];

    vm.refreshList = function () {
        dbService.getAllMessages().then(function (data) {
            vm.todos = data;
            $scope.messageList = vm.todos;
        }, function (err) {
            $window.alert(err);
        });
    };

    function init() {
        dbService.open().then(function () {
            //if this is success full we should "refresh" our database with the server.
            $http.get(dhi + '/api/currentUser/inbox/messageConversations').success(function (response) {

                dbService.addAllMessages(response);
            });
            //And then retrieve from the database. see above.
           vm.refreshList();
        });
    }
    init();
});



/*
function retrieveUserConversations($scope, $http) {

    $http.get(dhi + '/api/currentUser/inbox/messageConversations')
        .success(function (response) {
            addAllMessages(response);
            $scope.messageList = response;
    });

}
//http://sravi-kiran.blogspot.no/2014/01/CreatingATodoListUsingIndexedDbAndAngularJs.html
//http://stackoverflow.com/questions/15604196/promises-in-angularjs-and-where-to-use-them
//http://markdalgleish.com/2013/06/using-promises-in-angularjs-views/

function updateMessageList() {
    var scope = angular.element($("#inbox")).scope();
    console.log(getAllMessages());
    scope.$apply(function() {
        scope.messageList = getAllMessages();
    })

}*/