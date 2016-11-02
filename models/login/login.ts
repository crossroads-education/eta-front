import * as eta from "eta-lib";

import * as express from "express";
import * as querystring from "querystring";

export class Model implements eta.Model {
    private params: eta.ModelParams;

    public setParams(params: eta.ModelParams): void {
        this.params = params;
    }

    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        if (req.query.error) {
            callback({
                "errmsg": "Access denied"
            });
            return;
        }
        if (req.session["userid"]) {
            eta.redirect.back(req, res);
            return;
        }
        let casUrl: string = <string>eta.setting.get("/login", "CAS Url").value;
        let casService: string = <string>eta.setting.get("/login", "CAS Service").value;
        if (!req.query.casticket) {
            let params: { [key: string]: string } = {
                "cassvc": casService,
                "casurl": this.params.fullUrl
            };
            let url: string = `https://${casUrl}login?cassvc=${params["cassvc"]}&casurl=${querystring.escape(params["casurl"])}`;
            res.redirect(url);
            return;
        }
        eta.http.request(casUrl + "validate", "GET", {
            "cassvc": casService,
            "casticket": req.query.casticket,
            "casurl": this.params.fullUrl,
        }, true, (code: number, response: string) => {
            if (response == null) {
                callback({ errcode: eta.http.InternalError });
                return;
            }
            if (response.startsWith("no")) {
                res.redirect(this.params.fullUrl + "?error=" + eta.http.Forbidden);
            } else if (response.startsWith("yes")) {
                let username: string = response.split("\r\n")[1];
                if (eta.config.dev.sudo) {
                    username = eta.config.dev.sudo;
                }
                req.session["username"] = username;
                eta.db.query("SELECT id FROM Person WHERE username = ?", [username], (err: eta.DBError, rows: any[]) => {
                    if (err) {
                        eta.logger.dbError(err);
                        callback({ errcode: eta.http.InternalError });
                        return;
                    }
                    if (rows.length == 0) {
                        callback({ errcode: eta.http.Forbidden });
                        return;
                    }
                    req.session["userid"] = rows[0].id;
                    let sql: string = `
                        SELECT
                            Position.*,
                            Center.department
                        FROM
                            EmployeePosition
                                LEFT JOIN Position ON
                                    EmployeePosition.position = Position.id
                                LEFT JOIN Center ON
                                    Position.center = Center.id
                        WHERE
                            EmployeePosition.id = ? AND
                            EmployeePosition.start <= CURDATE() AND
                            (
                                EmployeePosition.end > CURDATE() OR
                                ISNULL(EmployeePosition.end)
                            )`;
                    eta.db.query(sql, [req.session["userid"]], (err: eta.DBError, rows: any[]) => {
                        if (err) {
                            eta.logger.dbError(err);
                            callback({ errcode: eta.http.InternalError });
                            return;
                        }
                        req.session["department"] = rows.length > 0 ? rows[0].department : -1;
                        req.session["positions"] = rows;
                        sql = `SELECT
                                student.count AS student,
                                professor.count AS professor
                            FROM (
                                SELECT
                                    COUNT(*) as count
                                FROM
                                    StudentSection
                                WHERE
                                    student = ?
                            ) AS student, (
                                SELECT
                                    COUNT(*) as count
                                FROM
                                    Section
                                WHERE
                                    professor = ?
                            ) AS professor`;
                        eta.db.query(sql, [req.session["userid"], req.session["userid"]], (err: eta.DBError, rows: any[]) => {
                            if (err) {
                                eta.logger.dbError(err);
                                callback({ errcode: eta.http.InternalError });
                                return;
                            }
                            if (rows[0].professor != 0) {
                                req.session["isProfessor"] = true;
                            } else if (rows[0].student != 0) {
                                req.session["isStudent"] = true;
                            }
                            eta.redirect.back(req, res);
                        });
                    });
                });
            } else {
                eta.logger.warn("Something is wrong with the CAS server: received response '" + response + "'.");
                callback({ errcode: eta.http.InternalError });
            }
        }, false);
    }
}
