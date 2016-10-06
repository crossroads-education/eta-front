/// <reference path="./typings/index.d.ts"/>

import "underscore";
import "bootstrap-calendar";

export module index {
    $(document).ready(function() {
        let calendar = (<any>$("#calendar")).calendar(
            {
                tmpl_path : "templates/calendar/",
                events_source : "/post/get-hours",
                display_week_number : false,
                weekbox : false,
                views : {
                    "month" : {
                        slide_events : 0,
                        enable: 1
                    },
                    "year" : {
                        enable : 0
                    },
                    "week" : {
                        enable : 0
                    },
                    "day" : {
                        enable : 0
                    }
                }
            }
        )
        $(".cal-row-head .cal-cell1").each(function() { //truncates calendar elements down to 3 chars
            $(this).text($(this).text().substring(0, 3));
        });
        $("#btn-stat").click(renderVideo("https://www.youtube.com/embed/HQykE8yDKIk"));
        $("#btn-showreel").click(renderVideo("https://www.youtube.com/embed/x-LCi2Pg4Z4"));
        $("#modal-video").on('hidden.bs.modal', function (e) {
            $("#iframe-video").attr("src", "");
        });
    })

    function renderVideo(source : string) : () => void {
        return function() {
            if ($("#iframe-video").attr("src") != source) {
                $("#iframe-video").attr("src", source);
            }
        }
    }

}
