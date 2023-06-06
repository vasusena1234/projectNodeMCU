"use strict";
const hana = require("@sap/hana-client");

const connOptions = {
  serverNode: "0b3bfb3a-ab5a-4537-a531-07e78a0f02d5.hana.trial-us10.hanacloud.ondemand.com:443",
  encrypt: "true",
  sslValidateCertificate: "false",
  uid: "DBADMIN",
  pwd: "Vasu@1234",
};

async function fetchData() {
  let data;
  const dbConnection = hana.createConnection();

  await new Promise((resolve, reject) => {
    dbConnection.connect(connOptions, function (err) {
      if (err) reject(err);
      else resolve();
    });
  });

  await new Promise((resolve, reject) => {
    dbConnection.exec('SELECT * FROM PLAIN.SALESDATA', function (err, result) {
      if (err) reject(err);
      else {
        data = result;
        console.log(result);
        resolve();
      }
    });
  });

  dbConnection.disconnect();
  return data;
}

(async () => {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();