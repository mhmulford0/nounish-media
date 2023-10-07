import "dotenv/config";
import express from "express";
import Irys from "@irys/sdk";
import multer from "multer";

const { PRIVATE_KEY, RPC_URL } = process.env;
if (!PRIVATE_KEY || !RPC_URL) {
  throw new Error("PRIVATE_KEY and RPC_URL env var required");
}
var storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (_req, file, callback) {
    callback(null, Date.now().toString() + file.originalname);
  },
});
var upload = multer({ storage: storage });

async function getIrys() {
  const irys = new Irys({
    url: "https://devnet.irys.xyz",
    token: "ethereum",
    key: PRIVATE_KEY,
    config: { providerUrl: RPC_URL },
  });
  return irys;
}

const FILE_SIZE_LIMIT = 5_000_000;

export function createServer() {
  const app = express();
  app.use(express.static(new URL("./public", import.meta.url).pathname));

  app.get("/", (_, res) => {
    res.json({ message: "hello" });
  });

  app.post("/upload", upload.single("prop-media"), (req, res) => {
    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
    ];

    if (!req.file || !validMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type." });
    }

    if (req.file.size > FILE_SIZE_LIMIT) {
      return res.status(400).json({ error: "File must be 5mb or less" });
    }

    console.log();

    res.json({ message: "file receieved" }).status(200);
  });

  return app;
}
