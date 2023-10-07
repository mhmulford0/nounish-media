import express from "express";
import { createReadStream } from "node:fs";

import { arweave, uploadPropMedia } from "./core.js";

export function createServer() {
    const app = express();
    app.use(express.static(new URL("./public", import.meta.url).pathname));

    app.get("/", (_, res) => {
        res.sendFile(new URL("./public", import.meta.url).pathname);
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

            const uploader = arweave.uploader.chunkedUploader; // recreate for each transaction
            const dataStream = createReadStream(`${req.file.destination}${req.file.filename}`);
            const response = await uploader.uploadData(dataStream);
            console.log(`Read Stream uploaded ==> https://gateway.irys.xyz/${response.data.id}`);

            return res.json({
                message: "file uploaded",
                fileURI: `https://gateway.irys.xyz/${response.data.id}`,
            });

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
