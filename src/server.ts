import express from "express";

import { arweave, uploadPropMedia } from "./core.js";

export function createServer() {
    const app = express();
    app.use(express.static(new URL("./public", import.meta.url).pathname));

    app.get("/", (_, res) => {
        res.json({ message: "running" });
    });

    app.post("/upload", (req, res) => {
        // TODO: check prop admin

        uploadPropMedia(req, res, async (err) => {
            if (!req.file) {
                return res.json({ error: "No file detected" });
            }

            if (err) {
                return res.json(err);
            }

            console.log(`${req.file.destination}${req.file.filename}`);
            console.log(arweave.utils.toAtomic(1) * 0.2);

            return res.json({ message: "ship it" });

            // try {
            //     const resp = await arweave.uploadFile(
            //         `${req.file.destination}${req.file.filename}`
            //     );

            //     res.json({ message: `File uploaded ==> https://gateway.irys.xyz/${resp.id}` });
            // } catch (e: unknown) {
            //     console.log(e);
            //     res.json({ error: "something failed" });
            // }
        });
    });

    return app;
}
