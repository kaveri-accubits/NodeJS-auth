const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("./utils/logger");
const userRoute = require("./routes/userRoute");

//connect to DB
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      logger.error(err, "Database connection error");
    } else logger.info("Connected to DB");
  }
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("combined"));

//import routes
app.use("/user", userRoute);

//listen to port
app.listen(process.env.PORT, (err) => {
  if (err) {
    logger.error(err);
  }
  logger.info(`Server is running on port ${process.env.PORT}`);
});
