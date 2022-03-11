require('dotenv').config()
const express = require("express");
const cors = require("cors");
const app = express();
// const db = require("./app/models");
const mongoose = require("mongoose")
// const productsRouter = require("./app/routes/product.routes");

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));


//     .then(() => {
//     console.log("Successfully connect to MongoDB.");
//     initial();
// })
//     .catch(err => {
//         console.error("Connection error", err);
//         process.exit();
//     });

// function initial() {
//     Role.estimatedDocumentCount((err, count) => {
//         if (!err && count === 0) {
//             new Role({
//                 name: "user"
//             }).save(err => {
//                 if (err) {
//                     console.log("error", err);
//                 }
//                 console.log("added 'user' to roles collection");
//             });

//             new Role({
//                 name: "admin"
//             }).save(err => {
//                 if (err) {
//                     console.log("error", err);
//                 }
//                 console.log("added 'admin' to roles collection");
//             });
//         }
//     });
// }
// set port, listen for requests


app.get("/", (req, res) => {
    res.json({ message: "Welcome to Leigh-Anne Bower's Backend." });
});


// app routes
const userRoutes = require('./app/routes/auth.routes');
const authRoutes = require('./app/routes/user.routes');
const router = require('./app/routes/user.routes');

app.use(cors())
app.use(express.json())
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
// app.use("/products", productsRouter);

// set port, listen for requests
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
module.exports = router