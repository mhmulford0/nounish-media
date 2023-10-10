import cors from "cors";
import express, { type Request } from "express";
import { createReadStream } from "node:fs";
import { generateNonce, SiweMessage } from "siwe";

import { arweave, uploadPropMedia } from "./core.js";
import { checkNFTOwnership } from "./middleware.js";

type Message = {
    domain: string;
    address: `0x${string}`;
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

    app.post("/upload", async (req: Request<{}, {}, { address: `0x${string}` }>, res) => {
        uploadPropMedia(req, res, async (err) => {
            if (!req.file) {
                return res.status(400).json({ error: "No file detected" });
            }

            if (!req.body.address) {
                return res.status(400).json({ error: "Address is required" });
            }

            if (err) {
                return res.json(err);
            }

            const isHolder = checkNFTOwnership(req.body.address);

            if (!isHolder) {
                res.status(400).json({ error: "Must be a holder of an allowed collection" });
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
                return res.status(500).json({ error: "generic error" });
            }
        });
    });

    app.post(
        "/verify",
        async (req: Request<{}, {}, { message?: Message; signature?: string }>, res) => {
            if (!req.body?.message || !req.body?.signature) {
                return res.status(400).json({ error: "signed messaged and signature required" });
            }

            const { message, signature } = req.body;

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
