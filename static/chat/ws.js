const url = `ws://${window.location.host}/chat/ws`;
const ws = new WebSocket(url);

function send(data) {
    console.log("Sending", data);
    ws.send(data)
}

const myEvents = {
    // Special multi-purpose event 
    "error": (err) => { console.error(err); },
    "get": (messages) => {
        for (message of messages) {
            myEvents['newMessage'](message);
        }
    },
    "newMessage": (message) => {
        let chatID = null;
        if (message.To == myUser.id)
            chatID = message.From;
        else
            chatID = message.To;

        MessageList.addMessage(usersToTransfer[chatID], message.From, message.ID, message.Text, message.Date);
    }
}

function getTime(date) {
    return `${b( date.getHours() )}:${b( date.getMinutes() )} ${b( date.getDate() )}.${b( date.getMonth() + 1 )}`;
}
// Beautify
function b(n) {
    return n < 10 ? "0" + n : n;
}

ws.onmessage = (event) => {
    if (DEBUG) console.log('Got raw event', event);
    let msg = null;

    msg = event.data;
    if (DEBUG) console.log('Received msg:', msg);
    if (DEBUG) console.log(event);
    msg = JSON.parse(msg);
    if (DEBUG) console.log(msg);

    if (msg.ok === false) {
        if (DEBUG) console.warn("Ошибка!", msg.data);
        swal('Упс!', `Что-то пошло не так: ${msg.data}`, 'error');
        return;
    }

    if (DEBUG) console.log(`Attempt to execute '${msg.event}' with data:`, JSON.parse(msg.data));

    if (!myEvents[msg.event])
        return console.error("No event " + msg.event);

    myEvents[msg.event](JSON.parse(msg.data));
}

ws.onopen = () => {
    console.log("Connected successfully!");

    /* Sending initial events */
    sendEvent('get', {});
}

ws.onclose = () => {
    console.log("Connection was closed")
}

function sendEvent(event, data) {
    let obj = { event, data: JSON.stringify(data) };
    let text = JSON.stringify(obj);
    
    send(text);
}

function _base64ToUint8Array(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }

    if (DEBUG) console.log('Finished converting; The Base64->array is', bytes);

    return bytes;
}