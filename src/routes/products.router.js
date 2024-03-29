import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import ProductManagerFS from "../dao/productManagerFS.js";
import path from "path";

const router = Router();
const pm = new ProductManagerFS(path.join(__dirname, "../files/products.json"));

router.get("/", async (req, res) => {
  let products = await pm.getProducts(req.query.limit);
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ products });
});

router.get("/:pid", (req, res) => pm.getProductById(req, res));

router.post('/', (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  let { name, description, code, price, status, stock, category } = req.body;
  let aFieldIsEmpty = !(name && description && code && price && stock && category);
  if (aFieldIsEmpty) {
    return res.status(400).json({ error: "Producto no añadido. Error: Debe completar todos los campos" });
  }
  req.body.price = Number(price);
  req.body.stock = Number(stock);
  let invalidStatus = !(['false', 'true', '', undefined].includes(status));
  console.log(invalidStatus);
  if (isNaN(req.body.price) || isNaN(req.body.stock) || invalidStatus) {
    return res.status(400).json({ error: 'Producto no añadido. Valor(es) invalido(s)' });
  }
  status === "false" ? (req.body.status = false) : (req.body.status = true);
  next()
})

router.post("/", (req, res) => pm.addProduct(req, res));

router.put("/:pid", (req, res) => pm.updateProduct(req, res));

router.delete("/:pid", (req, res) => pm.deleteProduct(req, res));

export default router;