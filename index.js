const env = require("dotenv").config();
const dbconn = require('./DB/db_connection');
const app = require('./app');

app.get("/", (req, res) => {
  res.send("welcome");
});