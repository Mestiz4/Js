import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cm = new CartManager(`${__dirname}/files/cart.json`);

router.post("/", (req, res) => cm.addCart(req, res));

router.get("/:cid", (req, res) => cm.getCart(req, res));

router.post("/:cid/product/:pid", (req, res) => cm.addProduct(req, res));

export default router;