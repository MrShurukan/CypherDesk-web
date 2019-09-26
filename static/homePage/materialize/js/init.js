(function ($) {
    $(function () {

        $('.sidenav').sidenav();
        $('.tooltipped').tooltip();

        $('.pushpin-demo-nav').each(function () {
            var $this = $(this);
            var $target = $('#' + $(this).attr('data-target'));
            $this.pushpin({
                top: $target.offset().top,
                bottom: $('html').offset().top + $('html').outerHeight()
            });

            $this.css("z-index", "9999!important");
        });

        
        $('.tabs').tabs({swipeable: false});
        $('.fixed-action-btn').each(function () {
            var $this = $(this);

            if ($this.hasClass('fixed-action-btn-mobile')) {
                $this.floatingActionButton({
                    toolbarEnabled: true
                });
            }
            else {
                $this.floatingActionButton({
                    direction: 'up',
                    hoverEnabled: false
                });
            }
        });

        $('input.countable, textarea.countable').characterCounter();

        // var elems = document.querySelectorAll('.fixed-action-btn');
        // var instances = M.FloatingActionButton.init(elems, {
        //     direction: 'up',
        //     hoverEnabled: false
        // });

        $('.dropdown-trigger').dropdown();
        $('.collapsible').collapsible();
        $('select').formSelect();

        $('.modal').modal();

    }); // end of document ready
})(jQuery); // end of jQuery name space

function exitModal() {
    swal({
        title: `Выйти из системы?`,
        text: "Данные необходимо будет ввести заново",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да, выйти!',
        cancelButtonText: 'Отмена',
    }).then(result => {
        if (result.value) {
            location = "/out";
        }
    }).catch(console.error);
}