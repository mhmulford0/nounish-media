import express from "express";

import { uploadPropMedia } from "./core.js";

export function createServer() {
    const app = express();
    app.use(express.static(new URL("./public", import.meta.url).pathname));

    app.get("/", (_, res) => {
        res.json({ message: "running" });
    });

    app.post("/upload", (req, res) => {
        // TODO: check prop admin

        uploadPropMedia(req, res, (err) => {
            if (!req.file) {
                return res.json({ error: "No file detected" });
            }

            if (err) {
                return res.json(err);
            }

            console.log(`${req.file.destination}${req.file.filename}`);

            res.json({ message: "file uploaded" });
        });
    });

    return app;
}
