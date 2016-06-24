import * as eta from "eta-lib";
import * as express from "express";
import * as querystring from "querystring";

export class Model implements eta.Model {
    private params : eta.ModelParams;

    public setParams(params : eta.ModelParams) : void {
        this.params = params;
    }

    public render(req : express.Request, res : express.Response, callback : (env : {[key : string] : any}) => void) : void {
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
        let casUrl : string = <string>eta.setting.get("/login", "CAS Url").value;
        let casService : string = <string>eta.setting.get("/login", "CAS Service").value;
        if (!req.query.casticket) {
            let params : {[key : string] : string} = {
                "cassvc": casService,
                "casurl": this.params.fullUrl
            };
            let url : string = `https://${casUrl}login?cassvc=${params["cassvc"]}&casurl=${querystring.escape(params["casurl"])}`;
            eta.logger.trace("Redirecting to " + url + " for login.");
            res.redirect(url);
            return;
        }
        eta.http.request(casUrl + "validate", "GET", {
            "cassvc": casService,
            "casticket": req.query.casticket,
            "casurl": this.params.fullUrl,
        }, true, (code : number, response : string) => {
            if (response == null) {
                eta.logger.warn("Error logging user in: CAS returned null.");
                callback({errcode: eta.http.InternalError});
                return;
            }
            eta.logger.trace("Received response '" + response + "' from CAS.");
            if (response.startsWith("no")) {
                res.redirect(this.params.fullUrl + "?error=" + eta.http.Forbidden);
                eta.logger.trace("User was denied access in /login.");
            } else if (response.startsWith("yes")) {
                let username : string = response.split("\r\n")[1];
                req.session["username"] = username;
                eta.db.query("SELECT id FROM Person WHERE username = ?", [username], (err : eta.DBError, rows : any[]) => {
                    if (err) {
                        eta.logger.dbError(err);
                        callback({errcode: eta.http.InternalError});
                        return;
                    }
                    if (rows.length == 0) {
                        eta.logger.trace("User " + username + " was not found in Person");
                        callback({errcode: eta.http.Forbidden});
                        return;
                    }
                    eta.logger.json(rows);
                    eta.logger.trace("User " + username + " logged in successfully.");
                    req.session["userid"] = rows[0].id;
                    eta.logger.json(req.session);
                    eta.redirect.back(req, res);
                });
            } else {
                eta.logger.warn("Something is wrong with the CAS server: received response '" + response + "'.");
            }
        }, false);
    }
}
