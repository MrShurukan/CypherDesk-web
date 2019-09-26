'use strict';

let userSelected = false;
const e = React.createElement;

let lastSelectedUser = null;
let selectedUserID = null;

let unsentTexts = {};
function selectUser(domElement) {
    userSelected = true;

    if (lastSelectedUser) {
        unsentTexts[selectedUserID] = document.querySelector('#msgInput').value;

        const lCL = lastSelectedUser.classList;
        lCL.remove('teal'); lCL.remove('lighten-4');
        lCL.add('selectable');
    }

    const dCL = domElement.classList;
    dCL.add('teal'); dCL.add('lighten-4');
    dCL.remove('selectable');

    lastSelectedUser = domElement;
    selectedUserID = domElement.attributes.userid.value;

    const $msgInput = document.querySelector('#msgInput');
    if ($msgInput)
        $msgInput.value = unsentTexts[selectedUserID] || "";
}

let messages = {};
class MessageList extends React.Component { 
    constructor(props) {
        super(props);
    }

    render() {
        let outerStyle = {position: 'absolute', height: 'calc(100% - 3.9rem - 54px)', width: '100%', overflowY: 'scroll', overflowX: 'hidden'};
        // // console.log(messages[selectedUserID])
        // let mSU = messages[selectedUserID];
        // if (mSU && mSU[mSU.length - 1].props && !mSU[mSU.length - 1].props.marked)
        //     mSU.push(e('div', {marked: true}, e('br'), e('br')));
        
        return  e('div', {style: outerStyle, id: 'messageScroll'}, 
                    messages[selectedUserID] || e('h4', {className: 'center'}, `Ваша переписка с ${selectedUserID} пуста.\nНачните её прямо сейчас!`)
                )
    }

    // static receiveMessage(chatID, messageID, msg) {

    //     this.addMessage(chatID, messageID, msg);
    // }

    static sendMessage(chatID, msg) {
        if (!msg.length) return;
        // this.addMessage(chatID, myUser.id, 0, msg);

        sendEvent('send', {to: usersToTransfer[chatID].toString(), text: msg});
    }

    static addMessage(chatID, fromID, messageID, msg, date = new Date()) {
        console.log("test123123", chatID, usersToTransfer[selectedUserID])

        let msgObj = null;
        if (fromID == myUser.id) {
            msgObj =    e('div', {className: 'row', key: messageID, style: {marginBottom: 0}, id: `msgID${messageID}`},
                            e('div', {className: 'col offset-s7 s5'},
                                // e('h3', {className: 'right', style: {paddingRight: '1.5rem'}}, msg)
                                e('div', {className: 'right', style: {paddingRight: '1.5rem'}}, 
                                    e('div', {className: 'card blue lighten-5', style: {marginBottom: 0}},
                                        e('div', {className: 'card-content'},
                                            e('span', {className: 'card-title activator grey-text text-darken-4'}, msg)
                                        ),
                                        e('div', {className: 'card-reveal'},
                                            e('span', {className: 'card-title grey-text text-darken-4'}, `${getTime(new Date(date))}`)
                                        )
                                    )
                                )
                            )
                        );
        }
        else {
            msgObj =    e('div', {className: 'row', key: messageID, style: {marginBottom: 0}, id: `msgID${messageID}`},
                            e('div', {className: 'col s5'},
                                //e('h3', null, msg)
                                e('div', {className: 'left', style: {paddingLeft: '1.5rem'}}, 
                                    e('div', {className: 'card', style: {marginBottom: 0}},
                                        e('div', {className: 'card-content'},
                                            e('span', {className: 'card-title activator grey-text text-darken-4'}, msg)
                                        ),
                                        e('div', {className: 'card-reveal'},
                                            e('span', {className: 'card-title grey-text text-darken-4'}, `${getTime(new Date(date))}`)
                                        )
                                    )
                                )
                            )
                        );
        }

        if (!messages[chatID])
            return messages[chatID] = msgObj
        
        if (!messages[chatID].length)
            messages[chatID] = [messages[chatID], msgObj];
        else
            messages[chatID].push(msgObj);

        if (chatID == selectedUserID) {
            console.log("Yes");
            setTimeout(() => { 
                document.querySelector(`#msgID${messageID}`).scrollIntoView({
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
}

class MessageControls extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        let outerStyle = {position: 'absolute', bottom: '0', height: '3.9rem', width: '100%', marginBottom: 0, 
                    backgroundColor: '#eeefef'};

        return  e('div', {className: "row", style: outerStyle},
                    e('div', {className: "input-field col s11"}, 
                        e('input', {placeholder: '', id: 'msgInput', type: 'text', onKeyDown: (e) => e.key == "Enter" && $('#sendBtn').click()}),
                        e('label', {htmlFor: 'msgInput'}, `Сообщение для ${selectedUserID}`)
                    ),
                    e('button', {className: "col s1 btn waves-effect waves-light", style:{height: '100%'}, id:'sendBtn',
                                onClick: () => { let o = document.querySelector('#msgInput'); MessageList.sendMessage(selectedUserID, o.value); o.value = "";}},
                        e('span', {className: 'truncate'}, "Send")
                    )
                )
    }
}

class ChatBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!userSelected) {
            return(
                e('div', {className: 'valign-wrapper center-align', style: {height: '100%', backgroundImage: ''}},
                    e('div', {style: {width: '100%'}},
                        e('p', {className: 'flow-text'}, 'Выберите пользователя для начала разговора'),
                        // <a class="waves-effect waves-light btn-large"><i class="material-icons right">cloud</i>button</a>
                        e('a', {className: 'waves-effect waves-light btn-large sidenav-trigger', "data-target": "slide-out"}, e('i', {className: 'material-icons right'}, 'cloud'), 'Открыть меню')
                    )
                )
            );
        }
        else {
            return(
                e('div', {style: {height: '100%'}},
                    e(MessageList),
                    e(MessageControls)
                )
            );
        }
    }
}

const domContainer = document.querySelector('#chatBody');
setInterval(() => ReactDOM.render(e(ChatBody), domContainer), 100);