import * as eta from "eta-lib";

import * as express from "express";
import * as fs from "fs";



interface Course {
    codeName: string;
    name: string;
    description: string;
}

interface CourseGroup {
    name: string;
    courses: Course[];
}

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        // temporary(?) redirect to math department's site
        // https:// redirects back to http:// unfortunately
        // res.redirect("http://math.iupui.edu/undergraduate/courses");
        let groupsFile: string = eta.server.modules["front"].baseDir + "lib/resources/groups.json";
        fs.readFile(groupsFile, (err: Error, buffer: Buffer) => {
            if (err) {
                eta.logger.warn("Couldn't read resources groups (" + groupsFile + ")");
                return callback({ errcode: eta.http.InternalError });
            }
            let groups: CourseGroup[] = JSON.parse(buffer.toString());
            callback({
                "groups": groups
            });
        });
        debugger;
        let sql: string = `
            SELECT
                CONCAT(C.subject, ' ', C.number) AS className,
                EJ.date,
                EJ.location,
                Num.numExamJams
            FROM
                (
                  SELECT
                    Course.id,
                    Course.subject,
                    Course.number
                  FROM
                    Course
                  WHERE
                    supported = 1 AND
                    tutor != 'NULL'
                ) AS C
                RIGHT JOIN
                    ExamJamInfo EJ
                ON
                    C.id = EJ.course
                RIGHT JOIN
                  (
                    SELECT
                      course,
                      Count(course) as numExamJams
                    FROM
                      ExamJamInfo
                    GROUP BY
                      course
                  ) AS Num
            ON
                Num.course = C.id`;
        eta.db.query(sql, [req.query.term, req.query.term, req.query.term], (err: eta.DBError, rows: any[]) => {
            if (err) {
                eta.logger.error(err);
                return callback({errcode: eta.http.InternalError});
            }
              for(let i: number = 0; i < rows.length; i++) {
                  let month = rows[i].date.getMonth() + 1;
                  let day = rows[i].date.getDate();
                  let monthDay = month + '/' + day
                  rows[i].date = monthDay;
              }
            return callback({
                rows: rows
            });
        });

    }
}
