import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req : express.Request, res : express.Response, callback : (env : {[key : string] : any}) => void) : void {
        let sql : string = `
            SELECT
                Position.name,
                GROUP_CONCAT(DISTINCT CONCAT(Course.subject, ' ', Course.number)) AS courses
            FROM
                Position
                    LEFT JOIN Course ON
                        Course.tutor = Position.name
            WHERE Position.open = 1
            GROUP BY Position.name
        `;
        eta.db.query(sql, [], (err : eta.DBError, rows : any[]) => {
            if (err) {
                eta.logger.dbError(err);
                callback({errcode: eta.http.InternalError});
                return;
            }
            callback({
                "agreementText": eta.setting.get("/apply", "agreementText").value,
                "isAvailable": rows.length != 0,
                "name": req.session["username"],
                "positions": rows
            });
        });
    }
}
