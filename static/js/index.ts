import "underscore";
import "bootstrap-calendar";
export module index {

    let calendarMonthDate: Date = new Date();
    calendarMonthDate.setDate(1); // avoid february skipping later in month
    let monthNames: string[] = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"];
    let calendar: any;

    function updateCalendarMonth(shift: number) {
        calendarMonthDate.setMonth(calendarMonthDate.getMonth() + shift);
        $("#span-month").text(monthNames[calendarMonthDate.getMonth()]);
    }

    function onCalendarNavigate() {
        let navDirection: string = $(this).data("calendar-nav");
        calendar.navigate(navDirection);
        updateCalendarMonth((navDirection == "next") ? 1 : -1);
        truncateDays();
    }

    function truncateDays() {
        $(".cal-row-head .cal-cell1").each(function() { //truncates calendar elements down to 3 chars
            $(this).text($(this).text().substring(0, 3));
        });
    }

    function getOnVideoOpen(source: string): () => void {
        return function() {
            if ($("#iframe-video").attr("src") != source) {
                $("#iframe-video").attr("src", source);
            }
        }
    }

    $(document).ready(function() {
        $("link[href='/css/global.old.css']").remove();
        calendar = (<any>$("#calendar")).calendar({
            tmpl_path: "templates/calendar/",
            events_source: "/post/get-hours",
            display_week_number: false,
            weekbox: false,
            views: {
                "month": {
                    slide_events: 0,
                    enable: 1
                },
                "year": {
                    enable: 0
                },
                "week": {
                    enable: 0
                },
                "day": {
                    enable: 0
                }
            }
        });
        updateCalendarMonth(0);
        $(".cal-row-head .cal-cell1").each(function() { //truncates calendar elements down to 3 chars
            $(this).text($(this).text().substring(0, 3));
        });
        $("#btn-stat").click(getOnVideoOpen("https://www.youtube.com/embed/HQykE8yDKIk"));
        $("#btn-showreel").click(getOnVideoOpen("https://www.youtube.com/embed/x-LCi2Pg4Z4"));
        $("#modal-video").on("hidden.bs.modal", function() {
            $("#iframe-video").attr("src", "");
        });
        $(".navbar-collapse").on("show.bs.collapse", function() {
            $("#navbar-container").addClass("navbar-background");
            $("#navbar-button span").addClass("hidden");
            $("#navbar-button i").removeClass("hidden");
            $("#navbar-mobile-logo").addClass("white");
        });
        $(".navbar-collapse").on("hidden.bs.collapse", function() {
            $("#navbar-container").removeClass("navbar-background");
            $("#navbar-button span").removeClass("hidden");
            $("#navbar-button i").addClass("hidden");
            $("#navbar-mobile-logo").removeClass("white");
        });
        $("button[data-calendar-nav]").on("click", onCalendarNavigate);
    });
}
