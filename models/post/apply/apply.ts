import * as eta from "eta-lib";

import * as express from "express";
import * as querystring from "querystring";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        // check if a position was selected
        let positions: string[] = [];
        for (let param in req.body) {
            if (param.startsWith("Position:")) {
                positions.push(param.split(":")[1]);
            }
        }
        if (positions.length == 0) {
            res.redirect("/apply?error=" + querystring.escape("Please select positions before submitting your application."));
            return;
        }
        let sql: string = `
            INSERT IGNORE INTO Applicant
            (id, notes, workStudy, phone, altEmail)
            VALUES (?, '', 0, '', '')`;
        eta.db.query(sql, [req.session["userid"]], (err: eta.DBError, rows: any[]) => {
            if (err) {
                eta.logger.dbError(err);
                res.redirect("/apply?error=" + querystring.escape("We were unable to process your application due to an internal error."));
                return;
            }
            let valueSql: string = "(?, ?, 1),".repeat(positions.length);
            let sql: string = `
                INSERT INTO ApplicantPosition
                (id, position, count)
                VALUES ${valueSql.substring(0, valueSql.length - 1)}
                ON DUPLICATE KEY UPDATE
                    lastApplied = CURRENT_TIMESTAMP(),
                    count = count + 1`;
            let params: string[] = [];
            for (let i: number = 0; i < positions.length; i++) {
                params.push(req.session["userid"]);
                params.push(positions[i]);
            }
            eta.db.query(sql, params, (err: eta.DBError, rows: any[]) => {
                if (err) {
                    eta.logger.dbError(err);
                    res.redirect("/apply?error=" + querystring.escape("We were unable to process your application due to an internal error."));
                    return;
                }
                res.redirect("/apply?success=true");
            });
        });
    }
}
