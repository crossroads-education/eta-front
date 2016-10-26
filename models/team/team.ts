import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        let sql: string = `
            SELECT
                Person.username,
                Person.firstName,
                Person.lastName,
                Position.name AS position,
                Employee.biography
            FROM
                Person
                    LEFT JOIN Employee ON
                        Person.id = Employee.id
                    LEFT JOIN EmployeePosition ON
                        Person.id = EmployeePosition.id
                    LEFT JOIN Position ON
                        EmployeePosition.position = Position.id
                    LEFT JOIN Center ON
                        Position.center = Center.id
            WHERE
                Employee.current = 1 AND
                (
                    EmployeePosition.end >= CURDATE() OR
                    EmployeePosition.end IS NULL
                ) AND
                Center.department = 1 AND
                Position.visible = 1
            ORDER BY
                Position.name,
                Person.lastName,
                Person.firstName`;
        eta.db.query(sql, [], (err: eta.DBError, rows: any[]) => {
            if (err) {
                eta.logger.dbError(err);
                callback({ errcode: eta.http.InternalError });
                return;
            }
            let rawLevels: { [key: string]: any[] } = {};
            for (let i: number = 0; i < rows.length; i++) {
                if (!rawLevels[rows[i].position]) {
                    rawLevels[rows[i].position] = [];
                }
                rawLevels[rows[i].position].push({
                    "biography": rows[i].biography,
                    "username": rows[i].username,
                    "firstName": rows[i].firstName,
                    "lastName": rows[i].lastName
                });
            }
            let levels: {
                name: string;
                employees: any[]
            }[] = [];
            for (let level in rawLevels) {
                rawLevels[level].sort((a: any, b: any): number => {
                    if (a.lastName == b.lastName) {
                        return a.firstName.localeCompare(b.firstName);
                    }
                    return a.lastName.localeCompare(b.lastName);
                });
                levels.push({
                    "name": level,
                    "employees": rawLevels[level]
                });
            }
            levels.sort((a: any, b: any): number => {
                return a.name.localeCompare(b.name);
            });
            callback({
                "levels": levels
            });
        });
    }
}
