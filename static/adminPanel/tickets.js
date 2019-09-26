$('#sendTicketForm').submit(e => {
    e.preventDefault();

    const caption = $('#ticketCaptionInput').val(),
        description = $('#ticketDesc').val();

    if (!description) return swal('Упс!', 'Вы не заполнили описание проблемы!', 'info');
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
            sendEvent('createM', {caption, description, id: selectedUser.toString()});
            $('#sendTicketModal').modal('hide');
        }
    });
});