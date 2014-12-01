/**
 * Created by zOrky on 01.12.2014.
 */

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
    }
    request.onsuccess = function (e) {
        console.log("Success stored message for user.");
    }
}

function getMessages(e) {
    var transaction = db.transaction(["messages"], "readonly");
    var store = transaction.objectStore("messages");

    var ob = objectStore.get(id);

    ob.onsuccess = function (e) {

    }
}

function getAllMessages(e) {
    console.log("You are offline. Sadface");
}
function addAllMessages(inputList) {
    //http://inf5750-30.uio.no/api/currentUser/inbox/messageConversations
    console.log("Connected to server, sync everything! inputList: " + inputList);

    inputList.map(function(item) {
        addMessages(item);
    });


}