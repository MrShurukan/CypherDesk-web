const url = `ws://${window.location.host}/tickets/ws`;
const ws = new WebSocket(url);

function send(data) {
    console.log("Sending", data);
    ws.send(data)
}

/*let tickets = [{
	ticket: {
		ID: 1,
		Caption: "Сломался чайник в отделе 'Лох'",
		Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		Sender: "Иллейный Илля",
		Status: "opened"
    },
	forwardFrom: 1,
	forwardTo: 2,
    Action: "create",
	Time: "Когда-то"
},
{
	ticket: {
		ID: 2,
		Caption: "Сдать документы до пятого числа",
		Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		Sender: "Одмен Одменович",
		Status: "opened"
    },
	forwardFrom: 1,
	forwardTo: 2,
    Action: "create",
	Time: "Когда-то"
}];*/

let incomingCount = 0, sentCount = 0;

function makeForwardable() {
    $('a.forwardTicket').click(function (e) {
        e.stopPropagation();

        forwardTicket($(this).attr('ticketID'));
    });
}

function closeTicket(ticketID) {
    swal({
        title: 'Закрыть тикет?',
        text: 'Данное действие будет невозможно отменить',
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да, закрыть',
        cancelButtonText: 'Отмена'
    }).then(e => {
        if (e.value) {
            if (DEBUG) console.log(`Closing ${ticketID}`);

            sendEvent('close', {id: ticketID});
        }
    }).catch(console.error);
}

function makeClosable() {
    $('a.closeTicket').click(function (e) {
        closeTicket($(this).attr('ticketID'));
    });
}

function flash(elementID) {
    $('#tap-target').attr('data-target', elementID).tapTarget();
}

const myEvents = {
    // Special multi-purpose event 
    "error": (err) => { console.error(err); },
    "get": (tickets) => {
        console.log("Got tickets!", tickets);
        let sentLi = '';
        let incomingLi = '';

        let getSentCnt = 0, getIncomingCnt = 0;
        for (let i = tickets.length-1; i >= 0; i--) {
            const extTicket = tickets[i];

            extTicket.ticket.Description = extTicket.ticket.Description.replace(/(?:\r\n|\r|\n)/g, '<br>');
            // if (myUserData.ID == extTicket.ticket.Sender) extTicket.ticket.Sender = `${myUserData.Name} ${myUserData.Surname}`;
            if (userNames[extTicket.ticket.Sender]) extTicket.ticket.Sender = userNames[extTicket.ticket.Sender];
            else
                if (isUser)
                    extTicket.ticket.Sender = '<span class="green-text">Модератор</span>';
                else
                    extTicket.ticket.Sender = '<span class="green-text">Администратор</span>';

            let isSentLi = (extTicket.forwardFrom == myUserData.ID || extTicket.ticket.Sender == myUserData.ID);

            let ticket = prepareTicket({extTicket, isSentLi});


            if (isSentLi) {
                sentLi += ticket;
                getSentCnt++;
            }
            else {
                getIncomingCnt++;
                incomingLi += ticket;
            }
        }
        // if (incomingLi.length == 0) {
        //     incomingLi = `<h2 class="text-center">У вас нет тикетов!</h2>`
        //     incomingNeedsToBeEmpty = true;
        // }
        // if (sentLi.length == 0) {
        //     sentLi = `<h2 class="text-center">У вас нет тикетов!</h2>`
        //     sentNeedsToBeEmpty = true;
        // }

        $('.incomingTicketsUl').html(incomingLi);
        $('.sentTicketsUl').html(sentLi);
        makeForwardable();
        makeClosable();

        // Set counters
        /*$('#sentHeader').html(`<h5>У вас <b>${sentCount}</b> отправленных тикетов</h5>`);
        $('#incomingHeader').html(`<h5>У вас <b>${incomingCount}</b> полученных тикетов</h5>`);*/
        $('#sentCounter').html(getSentCnt);
        $('#receivedCounter').html(getIncomingCnt);

        $('#ticketAmountB').html(tickets.length);
    },
    "create": (extTicket) => {
        swal('Успешно!', 'Тикет был отправлен!', 'success');
        const isSentLi = true;

        if (DEBUG) console.log("Ticket was successfully created!", extTicket);

        // if (sentNeedsToBeEmpty) {
        //     $('.sentTicketsUl').html('');
        //     sentNeedsToBeEmpty = false;
        // }

        extTicket.ticket.Description = extTicket.ticket.Description.replace(/(?:\r\n|\r|\n)/g, '<br>');
        if (userNames[extTicket.ticket.Sender]) extTicket.ticket.Sender = userNames[extTicket.ticket.Sender];
        else 
            if (isUser)
                extTicket.ticket.Sender = '<span class="green-text">Модератор</span>';
            else
                extTicket.ticket.Sender = '<span class="green-text">Администратор</span>';

        let li = prepareTicket({ isSentLi, extTicket});
        li += $('.sentTicketsUl').html();

        $('.sentTicketsUl').html(li);
        makeForwardable();
        makeClosable();
        // Set counter
        $('#sentCounter').html(++sentCount).addClass('new');
    },
    "incoming": (extTicket) => {
        if (DEBUG) console.log("Got new ticket!", extTicket);

        M.toast({displayLength: 10000, html: `<span>Поступил новый тикет!</span><a class="btn-flat toast-action smoothScroll" href="#ticketsBlock" onclick="$('#receivedTicketsSpan').click()">Посмотреть</a>`});
        makeSmoothScrollable();

        const isSentLi = false;

        // if (incomingNeedsToBeEmpty) {
        //     $('.incomingTicketsUl').html('');
        //     incomingNeedsToBeEmpty = false;
        // }

        extTicket.ticket.Description = extTicket.ticket.Description.replace(/(?:\r\n|\r|\n)/g, '<br>');
        if (userNames[extTicket.ticket.Sender]) extTicket.ticket.Sender = userNames[extTicket.ticket.Sender];
        else
            if (isUser)
                extTicket.ticket.Sender = '<span class="green-text">Модератор</span>';
            else
                extTicket.ticket.Sender = '<span class="green-text">Администратор</span>';

        let li = prepareTicket({extTicket, isSentLi});
        li += $('.incomingTicketsUl').html();

        $('.incomingTicketsUl').html(li);
        makeForwardable();
        makeClosable();

        // Set counter
        $('#receivedCounter').html(++incomingCount).addClass('new');
    },
    "forward": (data) => {
        if (DEBUG) console.log("Forwarded!", data);

        swal('Успешно!', 'Тикет был перенаправлен!', 'success');
    },
    "close": (ticket) => {
        if (DEBUG) console.log("Closed!", ticket);

        M.toast({displayLength: 2000, html: `<span>Тикет «<b class="yellow-text">${ticket.Caption}</b>» был закрыт</span>`});
        $(`.ticketStatus${ticket.ID}`).html('Статус: <b>closed</b>');
    },
    "closedTicket": (ticket) => {
        if (DEBUG) console.log("Somebody closed:", ticket);

        M.toast({displayLength: 10000, html: `<span>Тикет «<b class="yellow-text">${ticket.Caption}</b>» был закрыт. </span><a class="btn-flat toast-action smoothScroll" href="#ticketsBlock" onclick="$('#sentTicketsSpan').click()">Посмотреть</a>`});
        makeSmoothScrollable();
        $(`.ticketStatus${ticket.ID}`).html('Статус: <b>closed</b>');
    },
    "publicKey": (keys) => {
        // serverPublicKey = new NodeRSA();
        // let encryptedValue = encryptionKey.encrypt( "RSA" );
        // console.log("ENCRYPTED TEST MESSAGE: ", encryptedValue)
        // serverPublicKey = serverPublicKey.importKey(encryptionKey.decrypt(serverCipherText), 'pkcs1-public');
        let cl = encryptionKey.decrypt( keys.client );''
            let clArr = _base64ToUint8Array(cl);
        let sv = encryptionKey.decrypt( keys.server );
            let svArr = _base64ToUint8Array(sv);
        if (DEBUG) console.log("Client key is:", cl, clArr);
        if (DEBUG) console.log("Server key is:", sv, svArr);
        // if (DEBUG) console.log("Test debase64: ", encryptionKey.decrypt( keys.client ));

        serverKeys = {
            client: clArr,
            server: svArr
        };
        sendEvent('get', {});


        $('#preloaderHeader').text('Успешно!');
        $('#preloaderStatus').text('Обновляем информацию...');
        // $('#preloaderProgress').css('width', '50%');
        setTimeout(() => {
            // $('#preloaderProgress').css('width', '100%');
            $('#preloaderDiv').fadeOut(500)
        }, 1000);
    }
}
// myEvents['get'](tickets);

// if (DEBUG) console.log(aesjs);

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
    if (serverKeys) { // If we already got server key we are switched to AES decrypt mode
        msg = aes.decryptMessage(event.data, serverKeys.server);
        // if (DEBUG) console.log('msg.length', msg.length, msg.length % AES_BLOCKSIZE, msg.length - (msg.length % AES_BLOCKSIZE));
        // Get rid of padding characters on the end
        msg = msg.substring(0, msg.lastIndexOf('}') + 1);
    }
    else    // Else we just retrieve info (first time only)
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
    sendEvent("publicKey", {key: publicKey});
}

ws.onclose = () => {
    console.log("Connection was closed")
}

function sendEvent(event, data) {
    let obj = { event, data: JSON.stringify(data) };
    let text = JSON.stringify(obj);

    if (DEBUG && serverKeys)
        console.log('About to encrypt:', text);

    if (serverKeys) {
        text = aes.encryptMessage(text, serverKeys.client);
        // text = String.fromCharCode(..._base64ToUint8Array(text)).substr(8);
        // text = btoa(text);
    }
    
    send(text);
}

let aes = (function() {
    const iv = new Array(21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36);
    
    return {
        encryptMessage: function(messageToEncrypt, secretkey) {
            let aesCBC = new aesjs.ModeOfOperation.cbc(secretkey, iv);
            let encBytes = aesCBC.encrypt(aesjs.padding.pkcs7.pad( new Array(...messageToEncrypt).map(x => x.charCodeAt(0))) );
            return btoa( String.fromCharCode(...iv) + String.fromCharCode(...encBytes) );
        },
        decryptMessage: function(encryptedMessage, secretkey) {
            encryptedMessage = _base64ToUint8Array(encryptedMessage).slice(16, encryptedMessage.length - 1);
            let aesCBC = new aesjs.ModeOfOperation.cbc(secretkey, iv);
            let decBytes = aesCBC.decrypt(encryptedMessage)
            return aesjs.utils.utf8.fromBytes(decBytes)
        }
    }
})();

/*function aesEncrypt(key, text) {
    // Step 1: Convert to byte array
    text = key.encrypt(text);
    // Step 2: Convert to string
    text = String.fromCharCode(...a);

    return text;
}

function aesDecrypt(key, byteArray) {
    let decrBytes = key.decrypt(byteArray);

    return aesjs.utils.utf8.fromBytes(decrBytes);
}*/

function prepareTicket(info) {
    let { extTicket, isSentLi } = info;

    let ticket = `
        <li>
            <div class="collapsible-header">
                <i class="material-icons">folder</i>
                <span>${extTicket.ticket.Sender}: «<b>${extTicket.ticket.Caption}</b>»</span>
                
                ${!isUser && !isSentLi ? '<a class="waves-effect waves-light btn-small forwardTicket hide-on-small-and-down" style="position: absolute; right: 15px;" ticketID="' + extTicket.ticket.ID + '">' +
                    '<i class="material-icons left" style="margin: 0;">forward</i>' +
                    '<span>переслать</span>' +
                '</a>' : ''}
            </div>
            <div class="collapsible-body">
                <span>${extTicket.ticket.Description}</span>
                <br><br><br>
                <span class="right">Информация:</span><br><br>
                <div>
                    <span class="right">Время: ${getTime( new Date(extTicket.time) )}</span><br>
                    <span class="right">Отправитель: ${extTicket.ticket.Sender}</span><br>
                    <span class="right ticketStatus${extTicket.ticket.ID}">Статус: ${extTicket.ticket.Status}</span><br>
                </div>
               ${!isUser && !isSentLi ? '<a class="right waves-effect waves-light btn-small hide-on-med-and-up forwardTicket" ticketID="' + extTicket.ticket.ID + '" style="margin-top: 1rem; margin-bottom: 1rem">' +
                    '<span>переслать</span>' +
                '</a><br><br><br>' : ''}
               ${!isSentLi ? '<a class="right waves-effect waves-light btn-small red lighten-1 closeTicket" style="margin-top: 1rem;" ticketID="' + extTicket.ticket.ID + '">' +
                    '<span>закрыть тикет</span>' +
                '</a>' : ''}
               <br>
               <br>
            </div>
        </li>
    `;

    return ticket;
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