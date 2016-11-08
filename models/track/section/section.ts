import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        if (!eta.params.test(req.query, ["id"])) {
            callback({ errcode: eta.http.InvalidParameters });
            return;
        }
        eta.section.getByID(req.query.id, (section: eta.Section) => {
            if (!section) {
                callback({ errcode: eta.http.NotFound });
                return;
            }
            // the prof isn't the one logged in
            if (section.professor != req.session["userid"]) {
                callback({ errcode: eta.http.Forbidden });
                return;
            }
            let isPastWeek: boolean = !!req.query.isPastWeek;
            let pastWeekSql: string = `AND DATE(Visit.timeIn) >= (CURDATE() - INTERVAL 7 DAY)`;
            let sql: string = `
                SELECT
                    Person.id,
                    Person.firstName,
                    Person.lastName,
                    VisitCount.count AS visitCount,
                    VisitCount.duration AS visitDuration
                FROM
                    StudentSection
                        LEFT JOIN Person ON
                            StudentSection.student = Person.id
                        LEFT JOIN (
                            SELECT
                                Visit.student AS student,
                                COUNT(DISTINCT Visit.student, Visit.timeIn) AS count,
                                ROUND(SUM(TIME_TO_SEC(TIMEDIFF(Visit.timeOut, Visit.timeIn))) / 3600, 2) AS duration
                            FROM
                                Visit
                            WHERE
                                Visit.section REGEXP ?
                                ${isPastWeek ? pastWeekSql : ""}
                            GROUP BY Visit.student
                        ) VisitCount ON
                            StudentSection.student = VisitCount.student
                WHERE
                    StudentSection.section = ? AND
                    StudentSection.status = 'E'`;
            eta.db.query(sql, [req.query.id, req.query.id], (err: eta.DBError, rows: any[]) => {
                if (err) {
                    eta.logger.dbError(err);
                    callback({ errcode: eta.http.InternalError });
                    return;
                }
                callback({
                    "section": section,
                    "students": rows,
                    "isPastWeek": isPastWeek
                });
            });
        });
    }
}
