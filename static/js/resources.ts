export module resources {
    $(document).ready(function() {
        $(".container-groups").accordion({
            "heightStyle": "content",
            "collapsible": true,
            "active": false
        });
        $(".container-courses").tabs();
    });
}
