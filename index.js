const express = require('express');
const connectDB = require('./database/db');
const app = express();
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const cookieParser=require("cookie-parser");
const {errorHandler}=require("./middlewares/error")


dotenv.config();
app.use(express.json());
app.use(cookieParser()); 
app.use("/api/auth", authRoute);
app.use(errorHandler);


connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("App is listening");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

