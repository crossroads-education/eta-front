import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        if (!eta.params.test(req.body, ["student"])) {
            callback({ errcode: eta.http.InvalidParameters });
            return;
        }
        if (req.body.section) { // acting as professor
            eta.section.getByID(req.body.section, (section: eta.Section) => {
                if (!section) {
                    callback({ errcode: eta.http.InternalError });
                    return;
                }
                // the prof isn't the one logged in
                if (section.professor != req.session["userid"]) {
                    callback({ errcode: eta.http.Forbidden });
                    return;
                }
                this.fetchResults(req, res, callback);
            });
        } else { // acting as athlete director
            eta.athlete.isDirector(req.session["userid"], (isAthleteDirector: boolean) => {
                if (isAthleteDirector === null) {
                    callback({ errcode: eta.http.InternalError });
                    return;
                }
                if (!isAthleteDirector) {
                    res.redirect("/track/index");
                    return;
                }
                this.fetchResults(req, res, callback);
            });
        }
    }

    private fetchResults(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        eta.person.getByID(req.body.student, (person: eta.Person) => {
            if (!person) {
                callback({ errcode: eta.http.InternalError });
                return;
            }
            let sectionSql: string = "AND Section.id = ?";
            let params: string[] = [req.body.student, eta.term.getCurrent().id];
            if (req.body.section) {
                params.push(req.body.section);
            }
            let sql: string = `
                SELECT
                    GROUP_CONCAT(DISTINCT CONCAT(Course.subject, ' ', Course.number) ORDER BY Course.subject, Course.number SEPARATOR ', ') AS "0",
                    DATE_FORMAT(Visit.timeIn, '%c/%e/%Y') AS "1",
                    LOWER(TIME_FORMAT(Visit.timeIn, '%l:%i %p')) AS "2",
                    IFNULL(
                        LOWER(TIME_FORMAT(Visit.timeOut, '%l:%i %p')),
                        'N/A'
                    ) AS "3",
                    IFNULL(
                        ROUND(TIME_TO_SEC(TIMEDIFF(Visit.timeOut, Visit.timeIn)) / 3600, 2),
                        '0.00'
                    ) AS "4"
                FROM
                    Visit
                        RIGHT JOIN Section ON
                            Visit.section REGEXP Section.id
                        RIGHT JOIN Course ON
                            Section.course = Course.id
                WHERE
                    Visit.student = ? AND
                    Visit.term = ?
                    ${req.body.section ? sectionSql : ""}
                GROUP BY Visit.timeIn`;
            eta.db.query(sql, params, (err: eta.DBError, rows: any[]) => {
                if (err) {
                    eta.logger.dbError(err);
                    callback({ errcode: eta.http.InternalError });
                    return;
                }
                callback({
                    "raw": JSON.stringify({
                        "firstName": person.firstName,
                        "lastName": person.lastName,
                        "visits": rows
                    })
                });
            });
        });
    }
}
