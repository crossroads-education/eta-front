import * as eta from "eta-lib";

import * as express from "express";
import * as mail from "eta-lib";
import * as querystring from "querystring";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        if (!eta.params.test(req.body, ["name", "email", "phone", "subject", "message"])) {
            callback({ errcode: eta.http.InvalidParameters });
            return;
        }
        eta.mail.sendMail({
            "from": req.body.email,
            "to": "mathmac@iupui.edu",
            "subject": `[Website Comments] ${req.body.name}: ${req.body.subject}`,
            "text": `From: ${req.body.name}
                    Email: ${req.body.email}
                    Phone: ${req.body.phone}
                    Subject: ${req.body.subject}
                    Message:
                    ${req.body.message}`.replace(/    /g, "")
        }, (err: Error, info: nodemailer.SentMessageInfo) => {
            if (err) {
                eta.logger.warn("Could not send mail from " + req.body.email + ": " + err.message);
                res.redirect("/contact?error=" + querystring.escape("failed-to-send-email"));
                return;
            }
            res.redirect("/contact?success=true");
        });
    }
}
