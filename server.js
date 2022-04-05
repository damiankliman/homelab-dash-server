import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serversRouter from "./routes/servers.js";
import statusRouter from "./routes/status.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/servers", serversRouter);
app.use("/status", statusRouter);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
