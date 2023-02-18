import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pm = new ProductManager("../files/products.json");

app.get("/products", async (req, res) => {
  let limit = req.query.limit;
  let products = await pm.getProducts();
  res.send({ products: products.slice(0, limit) });
});


app.get("/products/:pid", async (req, res) => {
  let id = parseInt(req.params.pid);
  let product = await pm.getProductById(id);
  if (product) {
    res.send(product);
  } else {
    res.send({ error: "el producto no existe" });
  }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});