const express = require("express");
const connectDB = require('./database/db');
const app = express();
const dotenv = require("dotenv");

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("App is listening");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
