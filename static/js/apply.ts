import "sloth";

export module apply {
    $(document).ready(function() {
        $(".toggleButton").button();
        $(".toggleButton").on("change", function() {
            $("#" + this.getAttribute("data-name")).toggleClass("selected notSelected");
        });
    });
}
