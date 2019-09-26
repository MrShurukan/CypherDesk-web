const isUser = true;

$('#sendTicketForm').submit(e => {
    e.preventDefault();

    const caption = $('#ticketCaptionInput').val(),
        description = $('#ticketDesc').val();

    if (DEBUG) console.log(caption, description);

    if (!caption) return swal('Упс!', 'Вы не заполнили заголовок тикета!', 'info');
    // Set length in html
    if ($('#ticketCaptionInput').attr('data-length') < caption.length) return swal('Упс!', 'Ваш заголовок слишком длинный для отправки!', 'info');
    
    if (!description) return swal('Упс!', 'Вы не заполнили описание проблемы!', 'info');
    if ($('#ticketDesc').attr('data-length') < caption.length) return swal('Упс!', 'Ваш заголовок слишком длинный для отправки!', 'info');

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
            sendEvent('create', {caption, description});
            
            // Empty inputs
            $('#ticketCaptionInput').val('');
            $('#ticketDesc').val('');
        }
    });
});

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