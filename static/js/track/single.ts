export module single {
    function showNoVisits(): void {
        $(".container-single p").text("This student has no recorded visits for this course.");
        $(".container-single tbody").html("");
        $(".container-single").removeClass("empty");
    }

    $(document).ready(function() {
        let studentTable: DataTables.DataTable;
        $(".container-professor-section tbody tr,.container-athlete tbody tr").on("click", function() {
            let $this: JQuery = $(this);
            let studentID: string = $this.find("td[data-type='id']").text();
            let sectionID: string = $(".data[data-name='sectionID']").data("value");
            let params: any = {
                "student": studentID,
                "section": sectionID
            };
            $.post("/post/track/get-single", params, function(data) {
                $(".container-single h1").text(data.firstName + " " + data.lastName);
                if (data.visits.length === 0) {
                    showNoVisits();
                    return;
                }
                $(".container-single p").text("");
                $(".container-single").removeClass("empty");
                studentTable.fnClearTable();
                studentTable.fnAddData(data.visits);
                studentTable.fnDraw();
                $('html, body').animate({
                    scrollTop: $(".container-single").offset().top
                }, 800);
            }, "json").fail(function(err: any) {
                if (err.statusCode === 500) {
                    showNoVisits();
                }
            });
        });
        studentTable = (<any>$(".container-single table")).dataTable({
            "paging": true,
            "info": false,
            "ordering": true,
            "order": [[1, "desc"], [2, "desc"]],
            "dom": 'lfrtTp',
            "tableTools": {
                "sSwfPath": "js/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
            }
        });
    });
}
