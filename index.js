const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoute = require("./routes/userRoute");

//connect to DB
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(" err ", err);
    } else console.log("Connected to DB");
  }
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//import routes
app.use("/user", userRoute);

//listen to port
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("Error ", err);
  }
  console.log("Node.js is running at PORT", process.env.PORT);
});
