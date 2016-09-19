/// <reference path="./typings/index.d.ts"/>

requirejs.config({
    "baseUrl": "/js/",
    "paths": {
        "adapter": "http://webrtc.github.io/adapter/adapter-latest",
        "bootstrap": "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min",
        "bootstrap-calendar": "https://cdn.jsdelivr.net/bootstrap.calendar/0.2.4/js/calendar.min",
        "bootstrap-slider": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.1.1/bootstrap-slider.min",
        "bootstrap-switch": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.2/js/bootstrap-switch.min",
        "chartjs": "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min",
        // had to rename so datatables-bootstrap works
        "datatables.net": "https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.12/js/jquery.dataTables.min",
        "datatables.net-bs": "https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.12/js/dataTables.bootstrap.min",
        "datatables.net-buttons": "https://cdn.datatables.net/buttons/1.2.2/js/dataTables.buttons.min",
        "datatables.net-buttons-bs": "https://cdn.datatables.net/buttons/1.2.2/js/buttons.bootstrap.min",
        "datatables.net-buttons-html5": "https://cdn.datatables.net/buttons/1.2.2/js/buttons.html5.min",
        "datatables.net-buttons-print": "https://cdn.datatables.net/buttons/1.2.2/js/buttons.print.min",
        "es6-shim": "https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.1/es6-shim.min",
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min",
        "jquery-bez": "https://cdn.jsdelivr.net/jquery.bez/1.0.11/jquery.bez.min",
        "jquery-inputmask": "https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/3.3.1/jquery.inputmask.bundle.min",
        "jquery-noisy": "https://cdnjs.cloudflare.com/ajax/libs/noisy/1.2/jquery.noisy.min",
        "jquery-ui": "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min",
        "jquery-ui-touch-punch": "https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min",
        "kute": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute.min",
        "kute.js": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute.min",
        "kute-jquery": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute-jquery.min",
        "kute-svg": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute-svg.min",
        "moment": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min",
        "select2": "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min",
        "socket.io-client": "/socket.io/socket.io.js",
        "underscore": "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min"
    },
    "shim": {
        "jquery": {
            "exports": "$"
        }
    }
});
