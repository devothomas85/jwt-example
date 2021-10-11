//required packages
const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

//middleware

function verifyToken(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader == undefined) {
    res.status(401).send({ error: "no token provided" });
  }
  let token = authHeader.split(" ").pop();

  jwt.verify(token, "secret", async (err, decoded) => {
    if (err) {
      res.status(500).send({ error: "authentication failed" });
    } else {
      //res.send(decoded);
      let jwttok = await User.findById(decoded.id).exec();
      // res.send(jwttok);
      if (jwttok.jwttoken === token) {
        next();
      } else {
        res.send({ message: "Please Login..." });
      }
    }
  });
}

//Routes

router.post("/register", async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "User details can not be empty",
    });
  }
  var password = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    role: req.body.role,
    password: password,
  });

  user
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
});

router.post("/login", async (req, res) => {
  let response = {};
  let user = await User.findOne({ email: req.body.email }).exec();
  if (user) {
    bcrypt.compare(req.body.password, user.password).then(async (status) => {
      if (status) {
        response.id = user._id;
        response.email = user.email;
        response.role = user.role;
        let token = jwt.sign(response, "secret");
        await User.findOneAndUpdate(
          user._id,
          { jwttoken: token },
          {
            new: true,
          }
        ).then((result) => {
          console.log(result);
        });
        res.status(200).send({ auth: true, token: token });
      } else {
        console.log("Login failed");
        res.json({ status: false });
      }
    });
  } else {
    console.log("Login failed");
    res.json({ status: false });
  }
});

router.get("/books", verifyToken, (req, res) => {
  res.json({ message: "books view" });
});

//exporting user router
module.exports = router;
