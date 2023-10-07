import "dotenv/config";
import express from "express";
import Irys from "@irys/sdk";
import multer from "multer";

const FILE_SIZE_LIMIT = 5_000_000;
const { PRIVATE_KEY, RPC_URL } = process.env;
if (!PRIVATE_KEY || !RPC_URL) {
  throw new Error("PRIVATE_KEY and RPC_URL env var required");
}

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
    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
    ];

    if (!validMimeTypes.includes(file.mimetype)) {
      cb(
        new Error(
          "Invalid file type. Only jpg, png, gif, and mp4 image files are allowed."
        )
      );
    }

    cb(null, true);
  },
});

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

  const uploadMedia = upload.single("prop-media");

  app.get("/", (_, res) => {
    res.json({ message: "running" });
  });

  app.post("/upload", (req, res) => {
    // TODO: check prop admin

    uploadMedia(req, res, (err) => {
      if (err) {
        return res.json(err);
      }

      res.json({ message: "file uploaded" });
    });
  });

  return app;
}
