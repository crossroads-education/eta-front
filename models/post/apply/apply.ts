import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req : express.Request, res : express.Response, callback : (env : {[key : string] : any}) => void) : void {
        // check if a position was selected
        let positions : string[] = [];
        for (let param in req.body) {
            if (param.startsWith("Position:")) {
                positions.push(param.split(":")[1]);
            }
        }
        if (positions.length == 0) {
            callback({errcode: eta.http.InvalidParameters});
            return;
        }
        
    }
}
