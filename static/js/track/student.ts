/// <reference path="../typings/index"/>

import "datatables.net";

export module student {
    $(document).ready(function() {
        (<any>$(".container-student table")).DataTable({
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
