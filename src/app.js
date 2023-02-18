const express = require("express");
const productManager = require("./ProductManager");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let pm = productManager.ProductManager("../files/products.json");

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
    res.send({error: 'el producto no existe'});
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
