import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        eta.student.get(req.session["userid"], (student: eta.Student) => {
            if (!student) {
                callback({ errcode: eta.http.InternalError });
                return;
            }
            if (student.sections.length == 0
                || !eta.section.hasCurrentSections(student.sections, eta.term.getCurrent().id)) {
                res.redirect("/track/index");
                return;
            }
            let sql: string = `
                SELECT
                    LOWER(TIME_FORMAT(Visit.timeIn, '%l:%i %p')) AS timeIn,
                    LOWER(TIME_FORMAT(Visit.timeOut, '%l:%i %p')) AS timeOut,
                    ROUND(TIME_TO_SEC(TIMEDIFF(Visit.timeOut, Visit.timeIn)) / 3600, 2) AS totalHours,
                    DATE_FORMAT(Visit.timeIn, '%c/%e/%Y') AS date,
                    GROUP_CONCAT(DISTINCT CONCAT(Course.subject, ' ', Course.number) ORDER BY Course.subject, Course.number SEPARATOR ', ') AS courses
                FROM
                    Visit
                        RIGHT JOIN Section ON
                            Visit.section REGEXP Section.id
                        RIGHT JOIN Course ON
                            Section.course = Course.id
                WHERE
                    Visit.term = ? AND
                    Visit.student = ?
                GROUP BY Visit.student, Visit.timeIn
                ORDER BY Visit.timeIn`;
            eta.db.query(sql, [eta.term.getCurrent().id, req.session["userid"]], (err: eta.DBError, rows: any[]) => {
                if (err) {
                    eta.logger.dbError(err);
                    callback({ errcode: eta.http.InternalError });
                    return;
                }
                let totalHours: number = 0;
                for (let i: number = 0; i < rows.length; i++) {
                    totalHours += rows[i].totalHours;
                }
                eta.person.getByID(req.session["userid"], (person: eta.Person) => {
                    if (!person) {
                        callback({ errcode: eta.http.InternalError });
                        return;
                    }
                    callback({
                        "visits": rows,
                        "name": person.firstName + " " + person.lastName,
                        "totalHours": totalHours.toFixed(2)
                    });
                });
            });
        });
    }
}
