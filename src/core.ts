import "dotenv/config";
import multer from "multer";
import Irys from "@irys/sdk";

// Local File Config
const FILE_SIZE_LIMIT = 5_000_000;

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

export const uploadPropMedia = upload.single("prop-media");

// Arweave/Bundlr
const { PRIVATE_KEY, RPC_URL } = process.env;
if (!PRIVATE_KEY || !RPC_URL) {
  throw new Error("PRIVATE_KEY and RPC_URL env var required");
}

export async function getIrys() {
  const irys = new Irys({
    url: "https://devnet.irys.xyz",
    token: "ethereum",
    key: PRIVATE_KEY,
    config: { providerUrl: RPC_URL },
  });
  return irys;
}
