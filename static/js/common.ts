/// <reference path="./typings/index.d.ts"/>

requirejs.config({
    "baseUrl": "/js/",
    "paths": {
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min",
        "material": "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.1.3/material.min"
    },
    "shim": {
        "jquery": {
            "exports": "$"
        }
    }
});
