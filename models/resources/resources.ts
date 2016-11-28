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
    }
}
