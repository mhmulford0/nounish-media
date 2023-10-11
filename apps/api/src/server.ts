import cors from "cors";
import express from "express";
import { generateNonce } from "siwe";
import fs from "node:fs";

import { handleFileUpload } from "./core.js";
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
                fs.unlinkSync(req.file.path); // Ensure file is deleted if it exists
            }
        }
    });

    return app;
}
