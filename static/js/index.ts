import "jquery-ui";

export module index {

    function updateCalendar(start: Date, end: Date) {
        $.post("/post/get-calendar", {
            "start": start.toISOString(),
            "end": end.toISOString()
        }, function(days: any) {
            $("#calendar").datepicker(<any>{
                "hideIfNoPrevNext": true,
                "minDate": start,
                "endDate": end,
                "dayNamesMin": ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
                "beforeShowDay": function(date: Date): any[] {
                    let dateString: string = $.datepicker.formatDate("yy-mm-dd", date);
                    if (days[dateString]) {
                        if (days[dateString].isExamJam) {
                            return [true, "examJam", "Exam Jam"];
                        } else { // closed
                            return [false, "", "MAC is closed"];
                        }
                    } else {
                        return [true, "", ""];
                    }
                }
            })
        }, "json").fail(function(err) {
            console.log("Couldn't fetch calendar data: " + err.status);
        });
    }

    $(document).ready(function() {
        let start: Date = new Date();
        start.setDate(1);
        let end: Date = new Date();
        end.setMonth(end.getMonth() + 4);
        end.setDate(1);
        updateCalendar(start, end);
    });
}
