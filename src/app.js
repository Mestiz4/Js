import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { __dirname } from "./helpers/utils.js";

const app = express();
const port = 8080;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname +'/public'))

app.use("/api/products", productsRouter);

app.use("/api/cart", cartRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});