'use strict'

var testData = [
    {name: "Sølve Johnsen, age:30,proffesion:bum"},
    {name: "Super Man, age:666, proffesion:bum"}
];

var db;

if (!window.indexedDB) {
    window.alert("Your browser doesn't support indexedDB");
}
var request = indexedDB.open("json_db", 3);

request.onupgradeneeded = function(event){
    db = event.target.result;
    var objectStore = db.createObjectStore("name",{keyPath: "myKey"});
    var nameIndex = objectStore.createIndex("name","age","proffesion",{unique:false});

    for(var i in testData){
        objectStore.add(testData[i]);
    }
};



