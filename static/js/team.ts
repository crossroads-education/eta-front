import "jquery-ui";

export module team {
    let imageIndex: number = 0;
    function fixMissingImages(): void {
        $(".employee-block img").each(function() {
            if (this.naturalWidth == 0) {
                $(this).attr("src", "/img/missing-photo.svg");
            } else {
                $(this).on("error", function() {
                    $(this).attr("src", "/img/missing-photo.svg");
                });
            }
        });
    }

    function nextCarousel(): void {
        let imageElements: JQuery = $(".employee-block img");
        imageIndex = (imageIndex + 1) % imageElements.length;
        let imageElement: HTMLImageElement = <HTMLImageElement>imageElements.get(imageIndex);
        if (imageElement.naturalWidth == 0) {
            return nextCarousel();
        }
        $("#photo").css("background-image", "url('" + imageElement.src + "')");
    }

    $(document).ready(function() {
        fixMissingImages();
        $("#container-accordion").accordion({
            "header": ".level-header",
            "heightStyle": "content",
            "collapsible": true
        });
        nextCarousel();
        setInterval(nextCarousel, 6000);
    });
}
