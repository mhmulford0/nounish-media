import express, { type Request, type Response } from "express";
import { createReadStream } from "node:fs";
import cors from "cors";
import { generateNonce, SiweMessage } from "siwe";

import { arweave, uploadPropMedia } from "./core.js";

type Message = {
    domain: string;
    address: string;
    statement: string;
    uri: string;
    version: string;
    chainId: number;
    nonce: string;
    issuedAt: string;
};

export function createServer() {
    const app = express();

    app.use(express.json());
    app.use(cors());

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

    app.post(
        "/verify",
        async (req: Request<{}, {}, { message?: Message; signature?: string }>, res) => {
            console.log(req.body);
            if (!req.body?.message || !req.body?.signature) {
                return res.status(400).send();
            }

            const { message, signature } = req.body;

            console.log({ message }, { signature });
            const siweMessage = new SiweMessage(message);
            try {
                await siweMessage.verify({ signature });
                res.send(true);
            } catch {
                res.send(false);
            }
        }
    );

    return app;
}
