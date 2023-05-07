import express from "express";
import bodyParser from "body-parser";
import goQuery from "./db.js";
import LRUCache from "lru-cache";
import { insertLog } from "./db.js";

const app = express();

// use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// cache
const cache = new LRUCache({
  max: 100,
  // 2 minutes
  maxAge: 1000 * 60 * 2,
});

app.get("/test", async (req, res) => {
  try {
    if (cache.has(req.url)) {
      console.log("cache hit");
      res.send(cache.get(req.url));
    } else {
      const result = await goQuery("SELECT * FROM register_gate");
      cache.set(req.url, result);
      console.log("cache miss");
      res.send(result);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/tes", async (req, res) => {
  try {
    if (cache.has(req.url)) {
      console.log("cache hit");
      res.send(cache.get(req.url));
    } else {
      const result = await goQuery("SELECT * FROM kartu_akses");
      cache.set(req.url, result);
      console.log("cache miss");
      res.send(result);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/masuk", async (req, res) => {
  try {
    console.log(req.body);
    const { idkartu, idgate } = req.body;
    const resultKartu = await goQuery(
      `SELECT * FROM kartu_akses WHERE id_kartu_akses = '${idkartu}' AND is_aktif = 1`
    );
    const resultGate = await goQuery(
      `SELECT * FROM register_gate WHERE id_register_gate = '${idgate}'`
    );
    let isValid = "0";
    if (resultKartu.length > 0 && resultGate.length > 0) {
      isValid = "1";
    }
    await insertLog("log_masuk", idkartu, idgate, isValid === "1");
    res.send(isValid);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});


app.post("/keluar", async (req, res) => {
  try {
    console.log(req.body);
    const { idkartu, idgate } = req.body;
    const resultKartu = await goQuery(
      `SELECT * FROM kartu_akses WHERE id_kartu_akses = '${idkartu}' AND is_aktif = 1`
    );
    const resultGate = await goQuery(
      `SELECT * FROM register_gate WHERE id_register_gate = '${idgate}'`
    );
    let isValid = "0";
    if (resultKartu.length > 0 && resultGate.length > 0) {
      isValid = "1";
    }
    await insertLog("log_keluar", idkartu, idgate, isValid === "1");
    res.send(isValid);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});


app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
