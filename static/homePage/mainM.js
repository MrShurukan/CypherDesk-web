const isUser = false;

$('#sendTicketForm').submit(e => {
    e.preventDefault();

    const caption = $('#ticketCaptionInput').val(),
        description = $('#ticketDesc').val(),
        selectedUser = $('#userSelect').val();
    
    // console.log(selectedUser);

    if (!caption) return swal('Упс!', 'Вы не заполнили заголовок тикета!', 'info');
    // Set length in html
    if ($('#ticketCaptionInput').attr('data-length') < caption.length) return swal('Упс!', 'Ваш заголовок слишком длинный для отправки!', 'info');
    
    if (!description) return swal('Упс!', 'Вы не заполнили описание проблемы!', 'info');
    if ($('#ticketDesc').attr('data-length') < caption.length) return swal('Упс!', 'Ваш заголовок слишком длинный для отправки!', 'info');
    
    if (!selectedUser) return swal('Упс!', 'Вы не выбрали пользователя, которому отправляется тикет!', 'info');

    // TODO: Сообщение, куда, что и зачем
    swal({
        title: 'Отправить тикет?',
        text: "Это действие нельзя будет отменить",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да, отправить',
        cancelButtonText: 'Отмена'
    }).then(obj => {
        if (obj.value) {
            sendEvent('createM', {caption, description, id: selectedUser});
            
            // Empty inputs
            $('#ticketCaptionInput').val('');
            $('#ticketDesc').val('');
        }
    });
});

let selectedUser = null;
let lastSelectedHtml = null;
function selectSendUser(id, htmlElement) {
    selectedUser = id;

    if (lastSelectedHtml) lastSelectedHtml.classList.remove('selected');

    htmlElement.classList.add('selected');
    lastSelectedHtml = htmlElement;
}

function forwardTicket(ticketID) {
    if (DEBUG) console.log(`Forwarding ${ticketID}`);

    let html = `
        <div class="input-field" style="margin-bottom: 20px">
            <select id="userSelectFieldFT" class="browser-default" required>
                <option value="-1" disabled selected>Выберите пользователя</option>
    `;

    for (user of usersWithID)
        html += `<option value="${user.id}">${user.name}</option>\n`;

    html += `</select></div>`;

    $('#forwardTicketSelectDiv').html(html);
    $('#userSelectFieldFT').formSelect();

    $('#forwardTicketModalBtn').click();
    $('#forwardTicketForm').submit(e => {
       e.preventDefault();

        let toID = $('#userSelectFieldFT').val();
        if (!toID) return swal('Упс!', 'Вы не выбрали пользователя!', 'info');

        sendEvent('forward', {ticketID: ticketID.toString(), to: toID});
    });

    // const instance = M.FormSelect.getInstance($('#userSelectSwal')[0]);
    // instance.options.
}

// $('#documentUploadForm').submit(function(e) {
//     e.preventDefault();

//     autoSendPOST('/account/uploadFile', this)
//         .then(answer => console.log("New doc answer:", answer))
//         .catch(console.error);
// });

function makeSmoothScrollable() {
    document.querySelectorAll('a.smoothScroll').forEach(anchor => {
        anchor.removeEventListener('click', clickListener);
        anchor.addEventListener('click', clickListener);

        function clickListener(e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}

makeSmoothScrollable();