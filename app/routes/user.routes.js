const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authjwt");
const product = require("../models/product");
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/signup",
  [checktheDuplicateEmail],
  async (req, res) => {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      const newUser = await user.save();
      res.status(201).json(newUser);
      console.log(salt);
      console.log(hashedPassword);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);
router.post("/login", async (req, res) => {
  try {
    User.findOne({ email: req.body.email }, async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        console.log(user)
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      let token = jwt.sign({ _id: user._id, cart: user.cart }, process.env.ACCESSTOKEN, {
        expiresIn: 86400, // 24 hours
      });
      res.status(200).send({
        id: user._id,
        name: user.name,
        email: user.email,
        accessToken: token,
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.patch("/:id", [getUser, verifyToken], async (req, res) => {
  if (req.params.id != req.userId) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.phone_number != null) {
    res.user.phone_number = req.body.phone_number;
  }
  if (req.body.cart != null) {
    res.user.cart = req.body.cart;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", [getUser, verifyToken], async (req, res) => {
  try {
    if (req.params.id != req.userId) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    await res.user.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find User" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}
async function checktheDuplicateName(req, res, next) {
  let user;
  try {
    user = await User.findOne({ name: req.body.name });
    if (user) {
      return res.status(404).send({ message: "User already exist." });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}

async function checktheDuplicateEmail(req, res, next) {
  let email;
  try {
    email = await User.findOne({ email: req.body.email });
    if (email) {
      return res.status(404).send({ message: "Email already exist." });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}
module.exports = router;
