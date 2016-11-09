import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        let sql: string = `
            SELECT
                OnlineRoom.letter,
                OnlineRoom.url,
                GROUP_CONCAT(CONCAT(Course.subject, ' ', Course.number) ORDER BY Course.subject, Course.number SEPARATOR '\\n') AS rawCourses
            FROM
                OnlineRoom
                    LEFT JOIN Course ON
                        OnlineRoom.letter = Course.room
                    LEFT JOIN HoursOfOperation ON
                        HoursOfOperation.center = 3 AND
                        HoursOfOperation.day = DAYOFWEEK(CURDATE()) - 1
            WHERE
                OnlineRoom.date = CURDATE() AND
                NOT (
                    HoursOfOperation.open = '00:00:00' AND
                    HoursOfOperation.close = '00:00:00'
                ) AND
                HoursOfOperation.open <= TIME(NOW()) AND
                HoursOfOperation.close > TIME(NOW())
            GROUP BY OnlineRoom.letter
            ORDER BY OnlineRoom.letter ASC`;
        eta.db.query(sql, [], (err: eta.DBError, rows: any[]) => {
            if (err) {
                eta.logger.dbError(err);
                callback({ errcode: eta.http.InternalError });
                return;
            }
            for (let i: number = 0; i < rows.length; i++) {
                if (rows[i].rawCourses) {
                    rows[i].courses = rows[i].rawCourses.split("\n");
                } else {
                    rows[i].courses = "";
                }
            }
            callback({
                "rooms": rows
            });
        });
    }
}
