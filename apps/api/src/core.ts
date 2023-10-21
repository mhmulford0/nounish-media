import "dotenv/config";
import multer from "multer";
import Irys from "@irys/sdk";
import { nanoid } from "nanoid";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import type { Request, Response } from "express";
import { SiweMessage } from "siwe";
import { checkNFTOwnership } from "./middleware.js";
import { createClient } from "@libsql/client";

const { PRIVATE_KEY, RPC_URL, MAIN_RPC_URL, DB_TOKEN, DB_URL } = process.env;

if (!PRIVATE_KEY || !RPC_URL || !MAIN_RPC_URL || !DB_TOKEN || !DB_URL) {
    throw new Error("PRIVATE_KEY and RPC_URL and DB_TOKEN and DB_URL env var required");
}

// Local File Config
const FILE_SIZE_LIMIT = 5_000_000;

// Local File Storage

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (_req, file, callback) {
        callback(null, Date.now().toString() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter(_req, file, cb) {
        const validMimeTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];

        if (!validMimeTypes.includes(file.mimetype)) {
            cb(
                new Error("Invalid file type. Only jpg, png, gif, and mp4 image files are allowed.")
            );
        }

        cb(null, true);
    },
});

export const uploadPropMedia = upload.single("prop-media");

// Arweave/Bundlr

async function getIrys() {
    const irys = new Irys({
        url: "https://devnet.irys.xyz",
        token: "ethereum",
        key: PRIVATE_KEY,
        config: { providerUrl: RPC_URL },
    });
    return irys;
}

export const arweave = await getIrys();

export const client = createPublicClient({
    chain: mainnet,
    transport: http(MAIN_RPC_URL),
});

export const db = createClient({
    url: DB_URL,
    authToken: DB_TOKEN,
});

function formatDate() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${month}/${day}/${year}`;
}

export async function handleFileUpload(req: Request, res: Response) {
    try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(JSON.parse(message));
        const verified = await siweMessage.verify({ signature });

        if (!req.file) {
            return res.status(400).json({ error: "no file detected" });
        }

        console.log(req.file.mimetype);

        const isHolder = await checkNFTOwnership(verified.data.address as `0x${string}`);

        if (!isHolder) {
            return res.status(401).json({ error: "Must be a holder of an allowed collection" });
        }

        const response = await arweave.uploadFile(
            `${req.file.destination}${req.file.filename}`,
            {}
        );

        await db.execute({
            sql: "INSERT INTO uploads VALUES (:id, :uri, :wallet, :date, :mime_type)",
            args: {
                id: nanoid(),
                uri: response.id,
                wallet: verified.data.address,
                date: formatDate(),
                mime_type: req.file.mimetype,
            },
        });
        return res.json({
            message: "file uploaded",
            fileURI: `https://gateway.irys.xyz/${response.id}`,
        });
    } catch (e: unknown) {
        console.log(e);
        return res.status(500).json({ error: "server error" });
    }
}
