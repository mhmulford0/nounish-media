import "dotenv/config";
import express from "express";
import Irys from "@irys/sdk";

const { PRIVATE_KEY, RPC_URL } = process.env;

if (!PRIVATE_KEY || !RPC_URL) {
  throw new Error("PRIVATE_KEY and RPC_URL env var required");
}

async function getIrys() {
  const irys = new Irys({
    url: "https://devnet.irys.xyz",
    token: "ethereum",
    key: PRIVATE_KEY,
    config: { providerUrl: RPC_URL },
  });
  return irys;
}

export function createServer() {
  const app = express();
  app.use(express.static(new URL("./public", import.meta.url).pathname));

  app.get("/", (_, res) => {
    res.json({ message: "hello" });
  });

  app.post("/upload", () => {
    throw Error("TODO");
  });

  return app;
}
