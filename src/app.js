const express = require("express");
require("dotenv").config();
const app = express();
const authRouter = require("./Routes/authRouter");
const dbConnect = require("./dbConnection");

// parsing all the application/json to json

app.use(express.json());

// authRoute

app.use("/", authRouter);

// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(err.status || 500).json({ msg: err.msg || "server side error" });
// });
// here we are activing server once db is connected
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
