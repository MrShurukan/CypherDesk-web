function fillAccountUser() {
    const name = $('#nameInput').val(),
        surname = $('#surnameInput').val(),
        partonymic = $('#partonymicInput').val(),
        recourse = $('#recourseInput').val(),
        login = $('#loginInput').val(),
        pass = $('#passwordInput').val(),
        repass = $('#repasswordInput').val();

    if (!pass || !repass || pass != repass) 
        return createAlert('alert-danger', 'Ошибка!', 'Пароли не совпадают!');

    createAlert('alert-info', 'Загрузка...', 'Пожалуйста подождите');

    sendPOST('/fillUserAccount', {name, surname, partonymic, recourse, login, pass}, true)
        .then(resp => {
            if (!resp.ok)
                return createAlert('alert-danger', 'Ошибка!', resp.err);

            createAlert('alert-success', "Успех!", "Все прошло успешно");

            location = "/account";
        })
        .catch(console.error);
}

function createAlert(type, title, text = "") {
    $('#alertWrapper').html(`
        <div class="alert alert-dismissible fade show ${type} mb-0" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Закрыть">
                <span aria-hidden="true">×</span>
            </button>
            <strong>${title}</strong> ${text}
        </div>
    `);

    const offset = $('#alertWrapper').offset();

    $('html, body').animate({
        scrollTop: offset.top,
        scrollLeft: offset.left
    });
}

$(document).ready(() => {
    $('#setDataForm').submit(e => {
        e.preventDefault();

        fillAccountUser();
    })
});