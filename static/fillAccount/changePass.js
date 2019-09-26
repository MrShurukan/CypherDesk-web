$(document).ready(() => {

    $('#updatePasswordForm').submit(e => {
        e.preventDefault();

        const pass = $('#passwordInput').val(),
            repass = $('#repasswordInput').val();

        if (pass != repass)
            return createAlert('alert-danger', 'Упс!', 'Пароли не совпадают!');

        // login was saved in HTML after render
        sendPOST('/remindPass/change', {login, pass})
            .then(resp => {
                if (!resp.ok) 
                    return createAlert('alert-danger', "Упс!", "Произошла ошибка: " + resp.err);

                createAlert('alert-success', "Отлично!", "Данные изменены!");
                location = "/";
            })
            .catch(err => {
                createAlert('alert-danger', "Упс!", "Произошла ошибка: " + err);
                console.error(err);
            })
    });
});

function createAlert(type, title, text, where = "#alertWrapper") {
    $(where).html(`
        <div class="alert alert-dismissible fade show ${type} mb-0" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Закрыть">
                <span aria-hidden="true">×</span>
            </button>
            <strong>${title}</strong> ${text}
        </div>
    `);

    const offset = $(where).offset();

    $('html, body').animate({
        scrollTop: offset.top,
        scrollLeft: offset.left
    });
}