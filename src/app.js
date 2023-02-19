import express from "express";
import  __dirname  from "./utils.js";
import ProductManager from "./ProductManager.js";


const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pm = new ProductManager(`${__dirname}/files/products.json`);

app.get("/products", async (req, res) => {
  let limit = req.query.limit;
  let products = await pm.getProducts();
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ products: products.slice(0, limit) });
});


app.get("/products/:pid", async (req, res) => {
    let id = req.params.pid;
  let product = await pm.getProductById(id);
  res.setHeader("Content-Type", "application/json");
  if (product) {
    res.status(200).json(product)
  } else {
    res.status(400).json({ error: "el producto no existe" });
  }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});