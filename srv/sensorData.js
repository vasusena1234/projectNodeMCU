"use strict";
const express = require("express");
const hana = require("@sap/hana-client");

const connOptions = {
  serverNode: "0b3bfb3a-ab5a-4537-a531-07e78a0f02d5.hana.trial-us10.hanacloud.ondemand.com:443",
  encrypt: "true",
  sslValidateCertificate: "false",
  uid: "DBADMIN",
  pwd: "Vasu@1234",
};

const app = express();

app.get("/sensorData", async (req, res) => {
  try {
    const data = await fetchData();
    res.type("application/json").status(200).send({sensor : data});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function fetchData() {
  return new Promise((resolve, reject) => {
    const dbConnection = hana.createConnection();
    dbConnection.connect(connOptions, function (err) {
      if (err) reject(err);
      else {
        dbConnection.exec('SELECT * FROM PLAIN.SENSORDATA ORDER BY ID DESC LIMIT 1', function (err, result) {
          if (err) reject(err);
          else {
            dbConnection.disconnect();
            resolve(result);
          }
        });
      }
    });
  });
}

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
