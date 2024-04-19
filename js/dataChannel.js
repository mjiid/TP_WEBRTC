var ws;
var startButton = document.getElementById("startButton");
var sendButton = document.getElementById("sendButton");
var closeButton = document.getElementById("closeButton");
var dataChannelSend = document.getElementById("dataChannelSend");
var dataChannelReceive = document.getElementById("dataChannelReceive");

startButton.disabled = false;
sendButton.disabled = true;
closeButton.disabled = true;
dataChannelSend.disabled = true;

startButton.onclick = createWebSocketConnection;
sendButton.onclick = sendData;
closeButton.onclick = closeWebSocketConnection;

function log(text) {
    console.log("At time: " + (performance.now() / 1000).toFixed(3) + " --> " + text);
}

function createWebSocketConnection() {
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = function() {
        log('WebSocket connection opened');
        startButton.disabled = true;
        sendButton.disabled = false;
        closeButton.disabled = false;
        dataChannelSend.disabled = false;
        dataChannelSend.focus();
    };

    ws.onmessage = function(event) {
        if (event.data instanceof Blob) {
            var reader = new FileReader();
            reader.onload = function() {
                dataChannelReceive.value = reader.result;
            };
            reader.readAsText(event.data);
        } else {
            dataChannelReceive.value = event.data;
        }
    };

    ws.onclose = function() {
        log('WebSocket connection closed');
        startButton.disabled = false;
        sendButton.disabled = true;
        closeButton.disabled = true;
        dataChannelSend.disabled = true;
    };

    ws.onerror = function(error) {
        console.error('WebSocket error: ', error);
    };
}

function sendData() {
    var data = dataChannelSend.value;
    ws.send(data);
    log('Sent data: ' + data);
}

function closeWebSocketConnection() {
    log('Closing WebSocket connection');
    ws.close();
    log('WebSocket connection closed');
}
