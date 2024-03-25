const express = require('express');
const connectDB = require('./database/db');
const app = express();
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
app.use(express.json());
dotenv.config();
app.use("/api/auth", authRoute);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("App is listening");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

