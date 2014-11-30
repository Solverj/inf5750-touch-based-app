
// Sorter etter id for å finne tråder
// Vise dato i stedet for bilde
// Håndtere små skjermer ved å bruke substring/overflow hidden/mindre font eller noe på subject etc.

function retriveMessageList(){
    var messageList;

    $.ajax({url:dhi + "/api/currentUser/inbox/messageConversations",success:function(result){
        var len = result.length;
        for(var i = 0; i < len; i++){
            var id = result[i].id;
            $.ajax({url:dhi + "/api/messageConversations/" + id ,success:function(message){
                var length= message.messages.length;
                for(var o = 0; o < length; o++) {
                    console.log(message.messages[o]);
                    document.getElementById('messageView').innerHTML += '<br />' + message.messages[o].name + '<br/><hr/>';
                }
            }});
        }
    }});

    function retriveMessage(id){
        console.log(id)
        $.ajax({url:dhi + "/api/messageConversations/" + id ,success:function(message){
            var length= message.messages.length;
            for(var o = 0; o < length; o++) {
                console.log(message.messages[o]);
                document.getElementById('messageView').innerHTML += '<br />' + message.messages[o].name + '<br/><hr/>';
            }
        }});
    }
}
