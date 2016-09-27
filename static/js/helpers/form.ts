/**
This helper allows Ajax submission of forms (instead of redirections for user)
with no additional javascript required.

Format:
div.form-js(data-action="/post/wherever", data-method="POST", data-success="#success-selector", data-error="#error-selector")
    input.form-control(name="whatever", type="text")
    button.btn.btn-success.btn-submit
*/

import {HelperStatus} from "helpers/HelperStatus";

export module form {

    function onFormSubmit() {
        // can be a button or an input
        let $submitElement : JQuery = $(this);
        let $formElement : JQuery = $submitElement.closest(".form-js");
        let status : HelperStatus = new HelperStatus($formElement.data("success"), $formElement.data("error"));
        console.log(status);
        let params : {[key : string] : any} = {};
        let canSubmit : boolean = true;
        $formElement.find(".form-control").each(function(index : number, inputElement : HTMLElement) {
            let $inputElement : JQuery = $(inputElement);
            let name : string = $inputElement.attr("name");
            let value : any = $inputElement.val();
            if (inputElement.hasAttribute("required") && !value) {
                canSubmit = false;
            }
            params[name] = value;
        });
        if (!canSubmit) {
            status.error("Please enter a value for any empty fields.");
            return;
        }
        let ajax : any = $[$formElement.attr("method").toLowerCase()];
        ajax($formElement.data("action"), params, function() {
            status.success("Successfully submitted form.");
        }).fail(function(data : any) {
            status.error("Failed with error code " + data.status);
        });
    }

    $(document).ready(function() {
        $(".form-js .form-control").on("keydown", function(evt : JQueryKeyEventObject) {
            if (evt.which == 13) {
                // retain this context
                onFormSubmit.apply(this);
            }
        });
        $(".form-js .btn-submit").on("click", onFormSubmit);
    });
}
