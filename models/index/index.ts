import * as eta from "eta-lib";
import * as express from "express";


export class Model implements eta.Model {


    public render(req : express.Request, res : express.Response, callback : (env : {[key : string] : any}) => void) : void {

        if (!req.query.term) {
            req.query.term = eta.term.getCurrent().id;
        }
        let sql : string = `
        SELECT
            floor.day as day,
            CONCAT(CURDATE(), ' ', floor.open) as floorOpen,
            CONCAT(CURDATE(), ' ', floor.close) as floorClose,
            CONCAT(CURDATE(), ' ', online.open) as onlineOpen,
            CONCAT(CURDATE(), ' ', online.close) as onlineClose
        FROM
            (
            SELECT
                day,
                open,
                close
            FROM
                HoursOfOperation
            WHERE
                term = ? AND
                center = 2) AS floor JOIN
            (
            SELECT
                day,
                open,
                close
            FROM
                HoursOfOperation
            WHERE
                term = ? AND
                center = 3) AS online
        ON floor.day = online.day`;
        eta.db.query(sql, [req.query.term, req.query.term], (err : eta.DBError, rows : any[]) => {
            if (err) {
                eta.logger.dbError(err);
                callback({errcode: eta.http.InternalError});
                return;
            }
            let fieldNames : string[] = ["floorOpen", "floorClose", "onlineOpen", "onlineClose"];
            for (let i : number = 0; i < rows.length; i++) {
                rows[i].day = eta.time.shortDaysOfWeek[i];
                for (let j : number = 0; j < fieldNames.length; j++) {
                    rows[i][fieldNames[j]] = eta.time.getShortTime(new Date(rows[i][fieldNames[j]]));
                }
            }
            callback({
                rows: rows
            });
        })
    }
}
