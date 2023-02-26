import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager(`${__dirname}/files/products.json`);

router.get("/", async (req, res) => {
  let products = await pm.getProducts(req.query.limit);
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ products });
});

router.get("/:pid", (req, res) => pm.getProductById(req, res));

router.post('/', (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  let { title, description, code, price, status, stock, category } = req.body;
  let aFieldIsEmpty = !(title && description && code && price && stock && category);
  if (aFieldIsEmpty) {
    return res.status(400).json({ error: "Product not added. Error: must complete all required fields" });
  }
  req.body.price = Number(price);
  req.body.stock = Number(stock);
  let invalidStatus = !(['false', 'true', '', undefined].includes(status));
  console.log(invalidStatus);
  if (isNaN(req.body.price) || isNaN(req.body.stock) || invalidStatus) {
    return res.status(400).json({ error: 'Product not added. Invalid value(s)' });
  }
  status === "false" ? (req.body.status = false) : (req.body.status = true);
  next()
})

router.post("/", (req, res) => pm.addProduct(req, res));

router.put("/:pid", (req, res) => pm.updateProduct(req, res));

router.delete("/:pid", (req, res) => pm.deleteProduct(req, res));

export default router;