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
                eta.login.login(username, req, (env: { [key: string]: any }) => {
                    if (env) {
                        callback(env);
                    }
                    else {
                        eta.redirect.back(req, res);
                    }
                });
            } else {
                eta.logger.warn("Something is wrong with the CAS server: received response '" + response + "'.");
                callback({ errcode: eta.http.InternalError });
            }
        }, false);
    }
}
