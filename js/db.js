
var dbApp = angular.module('indexedDB_messageapp', []);

dbApp.factory('dbService', function($window, $q) {
    var indexedDB = $window.indexedDB;
    var db=null;

    var open = function() {
        var deferred = $q.defer();
        var version = 8;
        var openRequest = indexedDB.open("dhis_messageapp_database", version);


        openRequest.onupgradeneeded = function(e) {
               console.log("Upgrading....");

            db = e.target.result;
            e.target.transaction.onerror = indexedDB.onerror;


              if(db.objectStoreNames.contains("messages")) { db.deleteObjectStore("messages");}

            var messageDB =  db.createObjectStore("messages");
                  messageDB.createIndex("id","id", {unique:true});
                  messageDB.createIndex("name","name", {unique:false});
                  messageDB.createIndex("created","created", {unique:false});
                  messageDB.createIndex("lastUpdated","lastUpdated", {unique:false});
                  messageDB.createIndex("subject", "subject", {unique:false});
                  messageDB.createIndex("lastMessage", "lastMessage", {unique:false});
                  messageDB.createIndex("read","read", {unique:false});
                  messageDB.createIndex("lastSenderSurname","lastSenderSurname", {unique:false});
                  messageDB.createIndex("lastSenderFirstname","lastSenderFirstname", {unique:false});
                  messageDB.createIndex("displayName","displayName", {unique:false});


             if(db.objectStoreNames.contains("pendingMessages")) {db.deleteObjectStore("pendingMessages"); }
                 var pendingMessageDB = db.createObjectStore("pendingMessages");
                 pendingMessageDB.createIndex("id","id", {unique:true});
                 pendingMessageDB.createIndex("name","name", {unique:false});
                 pendingMessageDB.createIndex("created","created", {unique:false});
                 pendingMessageDB.createIndex("lastUpdated","lastUpdated", {unique:false});
                 pendingMessageDB.createIndex("subject", "subject", {unique:false});
                 pendingMessageDB.createIndex("lastMessage", "lastMessage", {unique:false});
                 pendingMessageDB.createIndex("read","read", {unique:false});
                 pendingMessageDB.createIndex("lastSenderSurname","lastSenderSurname", {unique:false});
                 pendingMessageDB.createIndex("lastSenderFirstname","lastSenderFirstname", {unique:false});
                 pendingMessageDB.createIndex("displayName","displayName", {unique:false});


            if(db.objectStoreNames.contains("user")) { db.deleteObjectStore("user"); }
                var userDB = db.createObjectStore("user");
                userDB.createIndex("id", "id", {unique:true});
                userDB.createIndex("name", "name", {unique:false});
                userDB.createIndex("firstname", "firstname", {unique:false});
                userDB.createIndex("surname", "surname", {unique:false});

        };

        openRequest.onsuccess = function(e) {
            db = e.target.result;
            deferred.resolve();
        };

        openRequest.onerror = function(e) {
            deferred.reject();
        };

        return deferred.promise;
    };

    var addMessage = function(_Message) {

        var deferred = $q.defer();

        if(db === null) {
            deferred.reject("IndexDB is not opened yet!");
        }else {

            var transaction = db.transaction(["messages"], "readwrite");
            var store = transaction.objectStore("messages");

            //http://inf5750-30.uio.no/api/currentUser/inbox/messageConversations
            var message = {
                id: _Message.id,
                name: _Message.name,
                created: _Message.created,
                lastUpdated: _Message.lastUpdated,
                externalAccess:_Message.externalAccess,
                subject:_Message.subject,
                lastMessage:_Message.lastMessage,
                read: _Message.read,
                messageCount: _Message.messageCount,
                lastSenderSurname: _Message.lastSenderSurname,
                lastSenderFirstname: _Message.lastSenderFirstname,
                followup:_Message.followup,
                access: {
                    manage:_Message.access.manage,
                    externalize:_Message.access.externalize,
                    write:_Message.access.write,
                    read:_Message.access.read,
                    update:_Message.access.update,
                    delete:_Message.access.delete
                },
                displayName: _Message.displayName
            };
            if(_Message.id === null ) {
                deferred.reject("Input is null");
            }

            var request = store.put(message, _Message.id);

            /*
            if (!online) {
                db.transaction(["pendingMessages"], "readwrite").objectStore("pendingMessages").add(message, _Message.id);
            }*/

            request.onerror = function (e) {
              deferred.reject("Message could not be added to database.");
                console.log("Error adding message.");
            };

            request.onsuccess = function (e) {
               deferred.resolve();
            };

        }
        return deferred.promise;
    };

    var getMessage = function(_ID) {
        var deferred = $q.defer();

        if(db === null) {
            deferred.reject("IndexDB is not opened yet.");
        }else {

            var transaction = db.transaction(["messages"], "readonly");
            var store = transaction.objectStore("messages");

            var ob = store.get(_ID);

            ob.onsuccess = function (e) {
                var result = e.target.result;
                deferred.resolve(result.value);
            }

            ob.onerror = function (e) {
                deferred.reject("Could not find message: " + _ID +".");
            }
        }
        return deferred.promise;
    };

    var addAllMessages = function(inputList) {
        //http://inf5750-30.uio.no/api/currentUser/inbox/messageConversations
        inputList.map(function(item) {
            addMessage(item);
        });
    };

    var getAllMessages = function() {
        var deferred = $q.defer();

        if(db == null) {
            deferred.reject("IndexedDB not opened.");
        }else {
            var transaction = db.transaction(["messages"], "readonly");
            var store = transaction.objectStore("messages");
            var items = [];

            transaction.oncomplete = function () {
                deferred.resolve(items);
            };

            var cursorRequest = store.openCursor();

            cursorRequest.onerror = function (e) {
                console.log(e);
                deferred.reject("Could not retrive objects.");
            };

            cursorRequest.onsuccess = function (e) {
                var cursor = e.target.result;
                if(cursor === null || cursor === undefined) {
                    items.sort(sortByTimestamp);
                    deferred.resolve(items);
                }else {
                    items.push(cursor.value);
                    cursor.continue();
                }
            };
        }
        return deferred.promise;
    };

    var deleteMessageByObject = function(_Message) {
        var deferred = $q.defer();

        if(db === null) {
            deferred.reject("IndexDB is not opened yet!");
        }else {

            var transaction = db.transaction(["messages"], "readwrite");
            var store = transaction.objectStore("messages");

            //http://inf5750-30.uio.no/api/currentUser/inbox/messageConversations

            if(_Message.id === null ) {
                deferred.reject("Input is null");
            }

            var request = store.delete(_Message.id);

            /*
             if (!online) {
             db.transaction(["pendingMessages"], "readwrite").objectStore("pendingMessages").add(message, _Message.id);
             }*/

            request.onerror = function (e) {
                deferred.reject("Message could not be added to database.");
                console.log("Error deleting message.");
            };

            request.onsuccess = function (e) {
                deferred.resolve();
            };

        }
        return deferred.promise;
    };
    var deleteMessageByID = function(_Message) {
        var deferred = $q.defer();

        if(db === null) {
            deferred.reject("IndexDB is not opened yet!");
        }else {

            var transaction = db.transaction(["messages"], "readwrite");
            var store = transaction.objectStore("messages");

            //http://inf5750-30.uio.no/api/currentUser/inbox/messageConversations

            if(_Message.id === null ) {
                deferred.reject("Input is null");
            }

            var request = store.delete(_Message);

            /*
             if (!online) {
             db.transaction(["pendingMessages"], "readwrite").objectStore("pendingMessages").add(message, _Message.id);
             }*/

            request.onerror = function (e) {
                deferred.reject("Message could not be added to database.");
                console.log("Error deleting message.");
            };

            request.onsuccess = function (e) {
                deferred.resolve(e.res);
            };

        }
        return deferred.promise;
    };

    var clearDatabase = function() {
        var deferred = $q.defer();

        if(db == null) {
            deferred.reject("IndexedDB not opened.");
        }else {
            var transaction = db.transaction(["messages"], "readwrite");
            var store = transaction.objectStore("messages");
            var items = [];

            transaction.oncomplete = function () {
                deferred.resolve(items);
            };

            var cursorRequest = store.openCursor();

            cursorRequest.onerror = function (e) {
                console.log(e);
                deferred.reject("Could not retrive objects.");
            };

            cursorRequest.onsuccess = function (e) {
                var cursor = e.target.result;
             if(cursor) {
                 store.delete(cursor.value.id);
                 cursor.continue();
             }
            };
        }
        return deferred.promise;
    };

    return {
        open: open,
        addMessage: addMessage,
        addAllMessages: addAllMessages,
        getMessage: getMessage,
        getAllMessages: getAllMessages,
        deleteMessageByID: deleteMessageByID,
        deleteMessageByObject: deleteMessageByObject,
        clearDatabase: clearDatabase
    };
});

function sortByTimestamp(a,b) {
    if(a.lastUpdated < b.lastUpdated)
        return 1;
    if(a.lastUpdated > b.lastUpdated)
        return -1;
    return 0;
}

/*
 var addCurrentUser = function (_user) {
 var deferred = $q.defer();

 if(db === null) {
 deferred.reject("db not opened yet");
 }else {
 var transaction = db.transaction(["user"], "readwrite");
 var store = transaction.objectStore("messages");

 var user = {
 id: _user.id,
 name: _user.name,
 created: _user.created,
 surname: _user.surname,
 firstName:_user.firstName,
 email: _user.email,
 phoneNumber: _user.phoneNumber,
 jobTitle: _user.jobTitle,
 introduction: _user.introduction,
 gender: _user.gender,
 birthday: _user.birthday,
 employer: _user.employer,
 education: _user.education,
 interests: _user.interests,
 languages: _user.languages,
 lastCheckedInterpretations: _user.lastCheckedInterpretations,
 userCredentials: _user.userCredentials, //array
 groups: _user.groups, //Array
 organisationUnits: _user.organisationUnits //array
 };

 if(_user.id === null) {
 deferred.reject("user id us null");
 }
 var request = store.put(user, _user.id);

 request.onerror = function (e) {
 deferred.reject("Could not update or add current user");
 console.log("Error in adding current user");
 };

 request.onsuccess = function (e) {
 deferred.resolve();
 };

 }
 return deferred.promise;
 };

 var getCurrentUser = function () {

 };
 */