import express from "express";
const router = express.Router();
import dotenv from "dotenv";

import { Low, JSONFile } from "lowdb";
import { nanoid } from "nanoid";
dotenv.config();

//INITIALIZE DATABASE
const serversDb = new Low(new JSONFile(process.env.SERVER_DB));
serversDb.read();

//SEND CURRENT SERVERLIST
router.get("/", (req, res) => {
  serversDb
    .read()
    .then(() => {
      res.json(serversDb.data.servers);
      console.log("servers list sent");
    })
    .catch((err) => {
      console.log(`ERROR: ${err}`);
      res.send(err.message);
    });
});

// ADD NEW SERVER TO SERVERLIST
router.post("/new", (req, res) => {
  const server = req.body;
  if (!server.title) {
    res.send({ error: "server must have a title" });
  } else {
    serversDb.data.servers.push({ ...server, id: nanoid() });
    serversDb
      .write()
      .then(() => {
        res.json(serversDb.data.servers);
        console.log("new server written to database");
      })
      .catch((err) => {
        res.send(err.message);
        console.log(`ERROR: ${err}`);
      });
  }
});

// DELETE SERVER FROM SERVERLIST
router.delete("/delete", (req, res) => {
  const toDelete = req.body.id;
  const servers = serversDb.data.servers;
  if (!toDelete) {
    res.send({ error: "server id missing" });
  } else {
    serversDb.data.servers = servers.filter((server) => server.id !== toDelete);
    serversDb
      .write()
      .then(() => {
        res.json(serversDb.data.servers);
        console.log("Deleted server and sent new list to client");
      })
      .catch((err) => {
        res.send(err.message);
        console.log(`ERROR: ${err}`);
      });
  }
});

//EDIT SERVER IN LIST
router.put("/edit", (req, res) => {
  const toEdit = req.body;
  const servers = serversDb.data.servers;
  if (!toEdit.id || !toEdit.title) {
    res.send({ error: "server id or title missing" });
  } else {
    const serverIndex = servers.findIndex(
      (oldServer) => oldServer.id === toEdit.id
    );
    serversDb.data.servers[serverIndex] = toEdit;
    serversDb
      .write()
      .then(() => {
        res.json(serversDb.data.servers);
        console.log(`Made edit to server list with id: ${toEdit.id}`);
      })
      .catch((err) => {
        res.send(err.message);
        console.log(`ERROR: ${err}`);
      });
  }
});

export default router;
