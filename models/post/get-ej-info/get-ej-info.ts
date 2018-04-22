import * as eta from "eta-lib";

import * as express from "express";
import * as fs from "fs";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        let sql: string = `
            SELECT
                CONCAT(C.subject, ' ', C.number) AS className,
                EJ.date,
                EJ.location
            FROM
                Course C,
                ExamJamInfo EJ
            WHERE
                C.id == EJ.course`;
        eta.db.query(sql, [req.query.term, req.query.term, req.query.term], (err: eta.DBError, rows: any[]) => {
            if (err) {
                eta.logger.error(err);
                return callback({errcode: eta.http.InternalError});
            }
            return callback({
                rows: rows
            });
        });
    }
}
