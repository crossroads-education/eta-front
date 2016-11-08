import "datatables.net";

export module student {
    $(document).ready(function() {
        (<any>$(".container-student table")).DataTable({
            "paging": true,
            "info": false,
            "ordering": true,
            "order": [[1, "asc"], [0, "asc"]],
            "dom": 'lfrtTp',
            "tableTools": {
                "sSwfPath": "js/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
            }
        });
    });
}
