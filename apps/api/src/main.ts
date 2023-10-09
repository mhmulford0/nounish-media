import { createServer } from "./server.js";

const app = createServer();

console.log("server running on 3k");
app.listen(Number(process.env.PORT) || 3000, "0.0.0.0");
