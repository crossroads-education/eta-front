/// <reference path="./typings/index.d.ts"/>

requirejs.config({
    "baseUrl": "/js/",
    "paths": {
        "bootstrap": "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min",
        "es6-shim": "https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.1/es6-shim.min",
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min",
        "material": "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.1.3/material.min"
    },
    "shim": {
        "jquery": {
            "exports": "$"
        }
    }
});
