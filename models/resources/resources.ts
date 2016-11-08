import * as eta from "eta-lib";

import * as express from "express";

export class Model implements eta.Model {
    public render(req: express.Request, res: express.Response, callback: (env: { [key: string]: any }) => void): void {
        // temporary(?) redirect to math department's site
        // https:// redirects back to http:// unfortunately
        res.redirect("http://math.iupui.edu/undergraduate/courses");
    }
}
