import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        if (!eta.params.test(req.body, ["start", "end"])) {
            callback({ errcode: eta.http.InvalidParameters });
            return;
        }
        let sql: string = `
            SELECT
                1 AS isExamJam,
                DATE(start) AS day
            FROM
                DateExamJam
            WHERE
                DATE(start) > DATE(?) AND
                DATE(start) < DATE(?)`;
        eta.db.query(sql, [req.body.start, req.body.end], (err: eta.DBError, examJamDays: any[]) => {
            if (err) {
                eta.logger.dbError(err);
                callback({ errcode: eta.http.InternalError });
                return;
            }
            sql = `
                SELECT
                    1 AS isClosed,
                    date AS day
                FROM
                    DateClosed
                WHERE
                    date > DATE(?) AND
                    date < DATE(?)`;
            eta.db.query(sql, [req.body.start, req.body.end], (err: eta.DBError, rawDays: any[]) => {
                if (err) {
                    eta.logger.dbError(err);
                    callback({ errcode: eta.http.InternalError });
                    return;
                }
                let days: {
                    [date: string]: {
                        isExamJam: boolean;
                        isClosed: boolean;
                    }
                } = {};
                for (let i: number = 0; i < examJamDays.length; i++) {
                    rawDays.push(examJamDays[i]);
                }
                for (let i: number = 0; i < rawDays.length; i++) {
                    let day: string = eta.time.getStandardDate(rawDays[i].day);
                    if (!days[day]) {
                        days[day] = {
                            "isExamJam": false,
                            "isClosed": false
                        };
                    }
                    if (rawDays[i].isExamJam) {
                        days[day].isExamJam = true;
                    }
                    if (rawDays[i].isClosed) {
                        days[day].isClosed = true;
                    }
                }
                callback({
                    "raw": JSON.stringify(days)
                });
            });
        });
    }
}
