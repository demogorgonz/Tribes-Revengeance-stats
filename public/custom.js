function notify(what){
    console.log("notify", what);
    Notification.requestPermission().then(function(permission) {
        if(permission === "granted"){
            var notification = new Notification(what, {icon: "/favicon.ico"})
            setTimeout(notification.close.bind(notification), 5 * 1000);
        }
    });
}

window.testTribesNotification = function(){
    notify("Hello world!");
};

window.startTribesNotifications = function(){
    var msgArr = [];
    var lastMsg = Date.now();


    var ws = new ReconnectingWebSocket("ws://" + location.host + "/");

    ws.onmessage = function(msg){
        if(msg.data == "PING") return console.info("PING!");
        var data = JSON.parse(msg.data);

        if(data.type != "join") return;
        msgArr.push(data);

        if(lastMsg + 500 >= Date.now()) return;

        var what = msgArr.map(function(x){return x.player}).join(", ") + " joined " + msgArr[0].serverName;
        notify(what);

        lastMsg = Date.now();
        msgArr = [];
    };
};