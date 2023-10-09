import { createServer } from "./server.js";

const PORT = Number(process.env.PORT) || 3000;

const app = createServer();

console.log("server running on ", PORT);
app.listen(PORT, "0.0.0.0");
