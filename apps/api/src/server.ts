import cors from "cors";
import express from "express";
import { generateNonce } from "siwe";

import fs from "node:fs";

import { db, handleFileUpload } from "./core.js";
import { uploadMiddleware, validateRequestBody } from "./middleware.js";

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

    app.post("/upload", uploadMiddleware, validateRequestBody, async (req, res) => {
        try {
            await handleFileUpload(req, res);
        } catch (error) {
            res.status(500).json({ error: error });
        } finally {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }
    });

    app.get("/uploads", async (req, res) => {
        if (!req.body.wallet && typeof req.body.wallet != "string") {
            return res.status(401).json({ error: "wallet is required" });
        }

        const data = await db.execute({
            sql: "SELECT id,uri FROM uploads WHERE wallet = :wallet",
            args: {
                wallet: req.body.wallet,
            },
        });

        console.log("here");

        data.rows.map((item) => console.log(item));

        return res.status(200).json({ data: data.rows });
    });

    return app;
}
