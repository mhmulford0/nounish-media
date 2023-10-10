import cors from "cors";
import express, { type Request, type Response } from "express";
import { createReadStream } from "node:fs";
import { generateNonce, SiweMessage } from "siwe";
import { erc721ABI } from "@wagmi/core";

import { arweave, client, uploadPropMedia } from "./core.js";

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

    app.post("/upload", async (req, res) => {
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

            // check ownership of a predefined NFT

            const gnarsContract = {
                address: "0x558BFFF0D583416f7C4e380625c7865821b8E95C",
                abi: erc721ABI,
            } as const;

            const builderDAOContract = {
                address: "0xdf9B7D26c8Fc806b1Ae6273684556761FF02d422",
                abi: erc721ABI,
            } as const;

            const lilNounsContract = {
                address: "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B",
                abi: erc721ABI,
            } as const;

            const nounsContract = {
                address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
                abi: erc721ABI,
            } as const;

            const results = await client.multicall({
                contracts: [
                    {
                        ...gnarsContract,
                        functionName: "balanceOf",
                        args: [message.address],
                    },
                    {
                        ...builderDAOContract,
                        functionName: "balanceOf",
                        args: [message.address],
                    },
                    {
                        ...lilNounsContract,
                        functionName: "balanceOf",
                        args: [message.address],
                    },
                    {
                        ...nounsContract,
                        functionName: "balanceOf",
                        args: [message.address],
                    },
                ],
            });

            const isHolder = results.some((nft) => Number(nft.result) > 0);

            console.log({ isHolder });

            if (!isHolder) {
                return res.json({ error: "must be a holder of an approved collection" });
            }

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
