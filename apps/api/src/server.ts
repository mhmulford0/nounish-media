import express from "express";
import { createReadStream } from "node:fs";
import { generateNonce, SiweMessage } from "siwe";

import { arweave, uploadPropMedia } from "./core.js";

export function createServer() {
    const app = express();

    app.get("/", (_, res) => {
        return res.json({ message: "running" });
    });

    app.get("/nonce", (_, res) => {
        res.send(generateNonce());
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

            try {
                const uploader = arweave.uploader.chunkedUploader;
                const dataStream = createReadStream(`${req.file.destination}${req.file.filename}`);
                const response = await uploader.uploadData(dataStream);
                console.log(
                    `Read Stream uploaded ==> https://gateway.irys.xyz/${response.data.id}`
                );

                return res.json({
                    message: "file uploaded",
                    fileURI: `https://gateway.irys.xyz/${response.data.id}`,
                });
            } catch (e) {
                console.log(e);
                return res.json({ error: "generic error" });
            }
        });
    });

    return app;
}
