import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        let currentTerm: number = eta.term.getCurrent().id;
        let sql: string = `
            SELECT
                HoursOfOperation.center = 2 AS isWalkIn,
                HoursOfOperation.day,
                HoursOfOperation.open,
                HoursOfOperation.close
            FROM
                HoursOfOperation
            WHERE
                HoursOfOperation.term = 9 AND
                HoursOfOperation.center IN (2, 3)`;
        eta.db.query(sql, currentTerm, (err: eta.DBError, rows: any[]) => {
            let days: {
                [day: string]: {
                    walkinHours: string;
                    onlineHours: string;
                }
            } = {};
            for (let i: number = 0; i < rows.length; i++) {
                let dayName: string = eta.time.getNameFromDayOfWeek(rows[i].day);
                if (!days[dayName]) {
                    days[dayName] = {
                        "walkinHours": "",
                        "onlineHours": ""
                    };
                }
                let hours: string;
                if (rows[i].open == "00:00:00" && rows[i].close == "00:00:00") {
                    hours = "Closed";
                } else {
                    hours = eta.time.getHoursTime(rows[i].open) + "-" + eta.time.getHoursTime(rows[i].close);
                }
                (<any>days[dayName])[rows[i].isWalkIn ? "walkinHours" : "onlineHours"] = hours;
            }
            callback({
                "hourDays": days
            });
        });
    }
}
