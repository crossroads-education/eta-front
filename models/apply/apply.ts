import * as eta from "eta-lib";

import * as express from "express";
import * as querystring from "querystring";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        let sql: string = `
            SELECT
                Position.name,
                GROUP_CONCAT(
                    DISTINCT CONCAT(
                        Course.subject, ' ', Course.number
                    )
                    ORDER BY
                        Course.subject ASC,
                        Course.number ASC
                ) AS courses
            FROM
                Position
                    LEFT JOIN Course ON
                        Course.tutor = Position.name
            WHERE Position.open = 1
            GROUP BY Position.name
            ORDER BY Position.name ASC`;
        eta.db.query(sql, [], (err: eta.DBError, rows: any[]) => {
            if (err) {
                eta.logger.dbError(err);
                callback({ errcode: eta.http.InternalError });
                return;
            }
            eta.person.getByID(req.session["userid"], (person: eta.Person) => {
                if (!person) {
                    // this person doesn't exist
                    eta.logger.warn("Person " + req.session["userid"] + " does not exist.");
                    callback({ errcode: eta.http.InternalError });
                    return;
                }
                callback({
                    "isAvailable": rows.length != 0,
                    "firstName": person.firstName,
                    "lastName": person.lastName,
                    "error": req.query.error,
                    "success": req.query.success,
                    "positions": rows
                });
            });
        });
    }
}
