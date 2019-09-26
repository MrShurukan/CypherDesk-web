function login() {
    const login = $('#loginInput').val(),
        pass = $('#passwordInput').val();
    if (DEBUG) console.log(login, pass);

    createAlert('alert-info', 'Пожалуйста, подождите...')

    sendPOST('/authorize', {login, pass}, true)
        .then(resp => {
            if (!resp.ok)
                return createAlert('alert-danger', 'Ошибка!', resp.err);

            createAlert('alert-success', 'Успех!', 'Все прошло успешно!');
            location = "/account";
        })
        .catch(console.error);

    return false;
}

function createAlert(type, title, text, where = "#alertWrapperMain") {
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

let FPSendingAllowed = true;

$(document).ready(() => {
    $('#loginForm').submit(e => {
        e.preventDefault();

        login();
    });

    $('#forgotPasswordForm').submit(e => {
        e.preventDefault();
        if (!FPSendingAllowed) return;

        const credentials = $('#FPCredInput').val();

        $('#FPSubmit').addClass('disabled');
        FPSendingAllowed = false;

        createAlert('alert-info', 'Загрузка...', 'Пожалуйста подождите...', '#alertWrapperFP');

        sendPOST('/remindPass', {credentials})
            .then(resp => {
                allowForm();

                if (!resp.ok) 
                    return createAlert('alert-danger', "Упс!", "Произошла ошибка: " + resp.err, '#alertWrapperFP');

                createAlert('alert-success', "Отлично!", "Запрос был отправлен!", '#alertWrapperFP');
            })
            .catch(err => {
                allowForm();
                createAlert('alert-danger', "Упс!", "Произошла ошибка: " + err, '#alertWrapperFP');
                console.error(err);
            });

        function allowForm() {
            FPSendingAllowed = true;
            $('#FPSubmit').removeClass('disabled');
        }
    });

});