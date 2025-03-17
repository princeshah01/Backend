const express = require("express");
require("dotenv").config();
const app = express();
const authRouter = require("./Routes/authRouter");
const dbConnect = require("./dbConnection");
const path = require("path");
const profileRouter = require("./Routes/ProfileRouter");
const infoRouter = require("./Routes/infoRouter");

// parsing all the application/json to json

app.use(express.json());

// authRoute

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", infoRouter)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

(async function () {
  try {
    await dbConnect();
    console.log("dbConnected");
    app.listen(3000, () => {
      console.log("Server is ready to use");
    });
  } catch (err) {
    console.log(err);
  }
})();
