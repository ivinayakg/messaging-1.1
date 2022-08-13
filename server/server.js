require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const connect = require("./db");
const newMessageEmitter = require("./utils/messageWatcher");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api", require("./routes"));
app.get("/test", (req, res) => {
  return res.send("its working");
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () =>
  console.log(`Your app is running at port ${port}`)
);

const start = async () => {
  try {
    await connect(process.env.MONGO_);
    newMessageEmitter();
    console.log("\n\nServer is successfully connected\n");
  } catch (error) {
    console.log(error);
    server.close();
  }
};

start();
