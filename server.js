require("dotenv").config();

const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");

const productsRouter = require("./app/routes/product.routes");
const usersRouter = require("./app/routes/user.routes");
const cartRouter = require("./app/routes/cart.routes");
// ("./routes/products.routes");
// ("./routes/users.routes");
const app = express();
app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/cart", cartRouter);

app.listen(app.get("port"), () => console.log(" Server started "));
