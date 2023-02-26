import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager(`${__dirname}/files/products.json`);

router.get("/", async (req, res) => {
  let products = await pm.getProducts(req.query.limit);
  res.render("index", { products, style: "index.css" });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", { style: "realTimeProducts.css" });
});

export default router;