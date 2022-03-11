const express = require("express");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const router = express.Router();
const app = express();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

app.get("/api/test/all", controller.allAccess);
app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
);



// router.get("/user", (req, res) => {
//     User.find({}, (err, users) => {
//         if (err) {
//             res.send({ message: "Something went wrong." });
//             next();
//         }
//         req.json(users);

//     });


router.get('/', async (req, res) => {

    const users = await User.find({});

    const userMap = {};
    users.forEach((user) => {
        userMap[user._id] = user;
    });

    res.send(userMap);

});
// router.get('/:id', getUser, (req, res) => {
//     res.json(res.user)
// })


// signup route
router.post("/signup", async (req, res) => {
    const body = req.body;

    if (!(body.email && body.password)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }

    // creating a new mongoose doc from user data
    const user = new User(body);
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => res.status(201).send(doc));
});

// login route
router.post("/login", async (req, res) => {
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (user) {
        // check user password with hashed password stored in the database
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (validPassword) {
            res.status(200).json({ message: "Valid password" });
        } else {
            res.status(400).json({ error: "Invalid Password" });
        }
    } else {
        res.status(401).json({ error: "User does not exist" });
    }
});

module.exports = (router)
