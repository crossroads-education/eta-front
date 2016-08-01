/// <reference path="./typings/index.d.ts"/>

requirejs.config({
    "baseUrl": "/js/",
    "paths": {
        "adapter": "http://webrtc.github.io/adapter/adapter-latest",
        "bootstrap": "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min",
        "bootstrap-slider": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.1.1/bootstrap-slider.min",
        "chartjs": "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min",
        // had to rename so datatables-bootstrap works
        "datatables.net": "https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.12/js/jquery.dataTables.min",
        "datatables-bootstrap": "https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.12/js/dataTables.bootstrap.min",
        "es6-shim": "https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.1/es6-shim.min",
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min",
        "jquery-bez": "https://cdn.jsdelivr.net/jquery.bez/1.0.11/jquery.bez.min",
        "jquery-inputmask": "https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/3.3.1/jquery.inputmask.bundle.min",
        "jquery-noisy": "https://cdnjs.cloudflare.com/ajax/libs/noisy/1.2/jquery.noisy.min",
        "jquery-ui": "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min",
        "kute": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute.min",
        "kute.js": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute.min",
        "kute-jquery": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute-jquery.min",
        "kute-svg": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute-svg.min",
        "moment": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min",
        "select2": "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min",
        "socket.io-client": "/socket.io/socket.io.js"
    },
    "shim": {
        "jquery": {
            "exports": "$"
        }
    }
});
