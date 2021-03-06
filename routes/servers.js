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
    res.status(400).send({ message: "Server must have a name" });
  } else {
    serversDb.data.servers.push({ ...server, id: nanoid() });
    serversDb
      .write()
      .then(() => {
        res.json(serversDb.data.servers);
      })
      .catch((err) => {
        res.send(err.message);
      });
  }
});

// DELETE SERVER FROM SERVERLIST
router.delete("/delete", (req, res) => {
  const toDelete = req.body.id;
  const servers = serversDb.data.servers;
  if (!toDelete) {
    res.status(400).send({ message: "Server id missing" });
  } else {
    serversDb.data.servers = servers.filter((server) => server.id !== toDelete);
    serversDb
      .write()
      .then(() => {
        res.json(serversDb.data.servers);
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
  if (!toEdit.id) {
    res.status(400).send({ message: "Server ID missing" });
  } else if (!toEdit.title) {
    res.status(400).send({ message: "Server must have a name" });
  } else {
    const serverIndex = servers.findIndex((oldServer) => oldServer.id === toEdit.id);
    serversDb.data.servers[serverIndex] = toEdit;
    serversDb
      .write()
      .then(() => {
        res.json(serversDb.data.servers);
      })
      .catch((err) => {
        res.send(err.message);
        console.log(`ERROR: ${err}`);
      });
  }
});

export default router;
