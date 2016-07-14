/// <reference path="./typings/index.d.ts"/>

requirejs.config({
    "baseUrl": "/js/",
    "paths": {
        "bootstrap": "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min",
        "chartjs": "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min",
        "es6-shim": "https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.1/es6-shim.min",
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min",
        "jquery-bez": "https://cdn.jsdelivr.net/jquery.bez/1.0.11/jquery.bez.min",
        "jquery-noisy": "https://cdnjs.cloudflare.com/ajax/libs/noisy/1.2/jquery.noisy.min",
        "jquery-ui": "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min",
        "kute": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute.min",
        "kute-jquery": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute-jquery.min",
        "kute-svg": "https://cdn.jsdelivr.net/kute.js/1.5.0/kute-svg.min",
        "moment": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min"
    },
    "shim": {
        "jquery": {
            "exports": "$"
        }
    }
});
