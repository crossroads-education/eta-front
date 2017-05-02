import "jquery-sloth-konami";

export module sloth {
    function fixSlothCanvas() {
        let slothCanvas: HTMLCanvasElement = <HTMLCanvasElement>$("canvas")[0];
        slothCanvas.height = $("#body").height();
    }

    $(document).ready(function() {
        (<any>$("#body")).sloth({
            "imageUrl": "/itrac/images/signin/sloth.svg",
            "zIndex": 99999
        });
    });

    $(window).load(function() {
        fixSlothCanvas();
        $(".ui-accordion").on("accordionactivate", fixSlothCanvas);
    })
}
