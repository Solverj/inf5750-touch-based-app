/**
 * Created by zOrky on 01.12.2014.
 */

var dbApp = angular.module('indexedDB_messageapp', []);

dbApp.factory('dbService', function($window, $q) {
    var indexedDB = $window.indexedDB;
    var db=null;

    var open = function() {
        var deferred = $q.defer();
        var version = 5;
        var openRequest = indexedDB.open("dhis_messageapp_database", version);


        openRequest.onupgradeneeded = function(e) {
               console.log("Upgrading....");

            db = e.target.result;
            e.target.transaction.onerror = indexedDB.onerror;


              if(!db.objectStoreNames.contains("messages")) {
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
                }

             if(!db.objectStoreNames.contains("pendingMessages")) {
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
               }
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
                updated: _Message.lastUpdated,
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
                    deferred.resolve(items);
                }else {
                    items.push(cursor.value);
                    cursor.continue();
                }
            };
        }
        return deferred.promise;
    };

    var deleteMessage = function(_Message) {
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

    var clearDatabase = function() {
        indexedDB.deleteDatabase("dhis_messageapp_database");
        this.open();
    };

    return {
        open: open,
        addMessage: addMessage,
        addAllMessages: addAllMessages,
        getMessage: getMessage,
        getAllMessages: getAllMessages,
        deleteMessage: deleteMessage,
        clearDatabase: clearDatabase
    };
});


/*
var db;

$(document).ready(function() {
    if("indexedDB" in window) {
        idbSupported = true;
    } else {
        return;
    }
    if(idbSupported) {
        var openRequest = indexedDB.open("dhis_messageapp_database",2);

        openRequest.onupgradeneeded = function(e) {
            console.log("Upgrading....");

            var thisDB = e.target.result;

            if(!thisDB.objectStoreNames.contains("messages")) {
                var os =  thisDB.createObjectStore("messages");
                os.createIndex("id","id", {unique:true});
                os.createIndex("name","name", {unique:false});
                os.createIndex("created","created", {unique:false});
                os.createIndex("lastUpdated","lastUpdated", {unique:false});
                os.createIndex("read","read", {unique:false});
                os.createIndex("messageCount","messageCount", {unique:false});
                os.createIndex("lastSenderSurname","lastSenderSurname", {unique:false});
                os.createIndex("lastSenderFirstname","lastSenderFirstname", {unique:false});
                os.createIndex("displayName","displayName", {unique:false});
                console.log("Added messages objectStore");

            }
            if(!thisDB.objectStoreNames.contains("pendingMessages")) {
                var os = thisDB.createObjectStore("pendingMessages");
                os.createIndex("id","id", {unique:true});
                os.createIndex("name","name", {unique:false});
                os.createIndex("created","created", {unique:false});
                os.createIndex("lastUpdated","lastUpdated", {unique:false});
                os.createIndex("read","read", {unique:false});
                os.createIndex("messageCount","messageCount", {unique:false});
                os.createIndex("lastSenderSurname","lastSenderSurname", {unique:false});
                os.createIndex("lastSenderFirstname","lastSenderFirstname", {unique:false});
                os.createIndex("displayName","displayName", {unique:false});
                console.log("Added pendingMessages objectStore");
            }
        }

        openRequest.onsuccess = function(e) {
            console.log("Success!");
            db = e.target.result;
            //Add evenEventListener?
        }

        openRequest.onerror = function(e) {
            console.log("Error");
        }
    }

}, false);

function addMessages(_Message) {

    var transaction = db.transaction(["messages"], "readwrite");
    var store = transaction.objectStore("messages");

    //http://inf5750-30.uio.no/api/currentUser/inbox/messageConversations
    console.log("Trying to add something. message is: "+_Message.id);
    var message = {
        id: _Message.id,
        name: _Message.name,
        created: _Message.created,
        updated: _Message.lastUpdated,
        read: _Message.read,
        messageCount: _Message.messageCount,
        lastSenderSurname: _Message.lastSenderSurname,
        lastSenderFirstname: _Message.lastSenderFirstname,
        displayName: _Message.displayName
    };

    var request = store.add(message, _Message.id);
    if (!online) {
        db.transaction(["pendingMessages"], "readwrite").objectStore("pendingMessages").add(message, _Message.id);
    }

    request.onerror = function (e) {
        console.log("Error", e.target.error.name);
        if(e.target.error.name === "ConstraintError") {

            var update = store.put(message, _Message.id);
            update.onerror = function(e) {
                console.log("Error", e.target.error.name);
            }

            update.onsuccess = function (e) {
                console.log("Updated message instead of adding!");
            }
        }
    } //end request.onerror

    request.onsuccess = function (e) {
        console.log("Success stored message for user.");
    }



}

function getMessages(_ID) {
    var transaction = db.transaction(["messages"], "readonly");
    var store = transaction.objectStore("messages");

    var ob = objectStore.get(_ID);

    ob.onsuccess = function (e) {
        console.log("Found message, returning.");
        var result = e.target.result;
        return result;
    }
    ob.onerror = function (e ) {
        console.log("Error" + e.target.error.name);
    }
}

function getAllMessages() {
    var deferred = $q.defer();

    if(db == null) {
        deferred.reject("IndexedDB not opened.");
    }else {
        var transaction = db.transaction(["messages"], "readonly");
        var store = transaction.objectStore("messages");
        var items = [];

        transaction.oncomplete = function () {
            return items;
        };

        var cursorRequest = store.openCursor();

        cursorRequest.onerror = function (e) {
            console.log(e);
        };

        cursorRequest.onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            }
        };
    }
    return deferred.promise;
};
function addAllMessages(inputList) {
    //http://inf5750-30.uio.no/api/currentUser/inbox/messageConversations

    inputList.map(function(item) {
        addMessages(item);
    });


}*/


//http://sravi-kiran.blogspot.no/2014/01/CreatingATodoListUsingIndexedDbAndAngularJs.html,
//http://markdalgleish.com/2013/06/using-promises-in-angularjs-views/
//http://stackoverflow.com/questions/22966858/angularjs-access-service-from-different-module
//http://css.dzone.com/articles/getting-all-stored-items
//http://code.tutsplus.com/tutorials/working-with-indexeddb--net-34673
//http://code.tutsplus.com/tutorials/working-with-indexeddb-part-2--net-35355

//https://www.google.no/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=angular+module+as+service+example&spell=1