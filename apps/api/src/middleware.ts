import { erc721ABI } from "@wagmi/core";
import { client, uploadPropMedia } from "./core.js";
import type { NextFunction, Request, Response } from "express";

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
    uploadPropMedia(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

export const validateRequestBody = async (
    req: Request<{}, {}, { message?: string; signature?: string }>,
    res: Response,
    next: NextFunction
) => {
    const { message, signature } = req.body;
    if (!message || !signature) {
        return res.status(400).json({ error: "signed messaged and signature required" });
    }
    next();
};

export async function checkNFTOwnership(address: `0x${string}`) {
    if (!address) {
        throw new Error("address is required");
    }

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

    try {
        const results = await client.multicall({
            contracts: [
                { ...gnarsContract, functionName: "balanceOf", args: [address] },
                { ...builderDAOContract, functionName: "balanceOf", args: [address] },
                { ...lilNounsContract, functionName: "balanceOf", args: [address] },
                { ...nounsContract, functionName: "balanceOf", args: [address] },
            ],
        });

        const isHolder = results.some((nft) => Number(nft.result) > 0);
        if (!isHolder) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        throw new Error("Generic Sever Errror");
    }
}
