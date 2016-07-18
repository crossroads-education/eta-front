export module apply {
    $(document).ready(function() {
        console.log('hi');
        $(".toggleButton").button();
        $(".toggleButton").on("change", function() {
            $("#" + this.getAttribute("data-name")).toggleClass("selected notSelected");
        });
    });
}
