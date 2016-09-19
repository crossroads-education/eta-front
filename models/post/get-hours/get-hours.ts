import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req : express.Request, res : express.Response, callback : (env : {[key : string] : any}) => void) : void {
        if (!req.query.start) {
            req.query.start = new Date().getMonth();
        }
        if (!req.query.end) {
            req.query.end = new Date().getMonth();
        }

        let sql : string = `
        SELECT
            UNIX_TIMESTAMP(date + interval 1 day - interval 1 second) as start,
            UNIX_TIMESTAMP(date + interval 1 second)AS end
        FROM
            DateClosed
        HAVING
            UNIX_TIMESTAMP(start) > ?  AND
            UNIX_TIMESTAMP(end) < ? 
             `;
        eta.db.query(sql, [req.query.start, req.query.end], (err : eta.DBError, rows : any[]) => {
            if (err) {
                eta.logger.dbError(err);
                callback({errcode: eta.http.InternalError});
                return;
            }
            for(let i : number = 0; i < rows.length; i++) {
                rows[i].id = i;
                rows[i].url = "#";
                rows[i].class = "event-danger";
                rows[i].description = "Closed";

            }
            eta.logger.json(rows);
            callback({
                "success" : 1,
                "result" : JSON.stringify(rows)
            })
        });
    }
}
