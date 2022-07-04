import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import serversRouter from "./routes/servers.js";
import statusRouter from "./routes/status.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "app/homelab-dash", "build")));

app.use("/api/servers", serversRouter);
app.use("/api/status", statusRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "app/homelab-dash/build", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
