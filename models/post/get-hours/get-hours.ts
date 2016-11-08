import * as eta from "eta-lib";
import * as express from "express";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        let curDate: Date = new Date();
        let sql: string = `
        SELECT
            UNIX_TIMESTAMP(date + interval 1 day - interval 1 second) * 1000 AS start,
            UNIX_TIMESTAMP(date + interval 1 second) * 1000 AS end
        FROM
            DateClosed
        WHERE
            UNIX_TIMESTAMP(date) >= ? / 1000 AND
            UNIX_TIMESTAMP(date) < ? / 1000`;
        eta.db.query(sql, [req.query.from, req.query.to], (err: eta.DBError, closedRows: any[]) => {
            if (err) {
                eta.logger.dbError(err);
                callback({ errcode: eta.http.InternalError });
                return;
            }
            let n: number = 0;
            for (let i: number = 0; i < closedRows.length; i++) {
                closedRows[i].id = n;
                closedRows[i].url = "";
                closedRows[i].class = "event-danger";
                closedRows[i].title = "Closed";
            }
            sql = `
            SELECT
                UNIX_TIMESTAMP(start) * 1000 AS start,
                UNIX_TIMESTAMP(end) * 1000 AS end
            FROM
                DateExamJam
            WHERE
                UNIX_TIMESTAMP(start) >= ? / 1000 AND
                UNIX_TIMESTAMP(end) < ? / 1000`;
            eta.db.query(sql, [req.query.from, req.query.to], (err: eta.DBError, examJamRows: any[]) => {
                if (err) {
                    eta.logger.dbError(err);
                    callback({ errcode: eta.http.InternalError });
                    return;
                }
                for (let i: number = 0; i < examJamRows.length; i++) {
                    examJamRows[i].id = n;
                    examJamRows[i].url = "";
                    examJamRows[i].class = "event-info";
                    examJamRows[i].title = "Exam Jam @ " + eta.time.getMinuteTime(new Date(examJamRows[i].start));
                    closedRows.push(examJamRows[i]);
                }
                callback({
                    raw: JSON.stringify({
                        "success": 1,
                        "result": closedRows
                    })
                });
            });
        });
    }
}
