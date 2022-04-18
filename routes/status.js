import express from "express";
const router = express.Router();
import dotenv from "dotenv";

import { Low, JSONFile } from "lowdb";
import isPortReachable from "is-port-reachable";
dotenv.config();

const serversDb = new Low(new JSONFile(process.env.SERVER_DB));
serversDb.read();

//GET SERVER STATUS
router.get("/", checkServerStatus, (req, res) => {
  res.send(req.status);
  console.log("Server status sent to client");
});

async function checkServerStatus(req, res, next) {
  await serversDb.read().then(async () => {
    const servers = serversDb.data.servers;
    let status = [];
    await Promise.all(
      servers.map(async (server) => {
        status.push({
          id: server.id,
          status: await isPortReachable(server.pingPort, {
            host: server.pingAddress,
          }),
        });
      })
    );
    req.status = status;
  });
  next();
}

export default router;
