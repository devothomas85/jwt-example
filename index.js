const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();

const userRoute = require("./routes/user.route");
const User = require("./models/user.model");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 999999999,
      rolling: true,
    },
  })
);
//db config
mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Mongodb connection successfull...");
});

//routes
app.use("/", userRoute);

// Server listening.
app.listen(5000, () => console.log("server running on http://localhost:5000"));
