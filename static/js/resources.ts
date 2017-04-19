export module resources {
    $(document).ready(function() {
        $(".container-groups").accordion({
            "heightStyle": "content",
            "collapsible": true,
            "active": false,
            "icons": {
                header: "iconClosed",
                activeHeader: "iconOpen"
            }
        });
        $(".container-courses").tabs();
    });
}
