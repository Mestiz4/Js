import { cartsModel } from "./models/carts.model.js";

export default class CartManagerDB {
  

  async getCarts() {
    let carts = await cartsModel.find();
    return carts;
  }

  async addCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    await cartsModel.create({ alias: req.query.alias });
    return res.status(201).json({ message: "Carrito creado exitosamente" });
  }

  async getCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let cart = await cartsModel.findById(req.params.cid);
    if (cart) {
      return res.status(200).json({ cart });
    } else {
      return res.status(400).json({ error: "Carrito no encontrado." });
    }
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let cart = await cartsModel.findById(req.params.cid);
    if (cart) {
      let productIndex = cart.products.findIndex((item) => item.productId === req.params.pid);
      if (productIndex !== -1) {
        await cartsModel.updateOne({ _id: req.params.cid, "products.productId": req.params.pid }, { $inc: { "products.$.quantity": 1 } });
      } else {
        await cartsModel.updateOne({ _id: req.params.cid }, { $push: { products: { productId: req.params.pid } } });
      }
      return res.status(201).json({ message: "Producto añadido exitosamente" });
    } else {
      return res.status(400).json({ error: "Carrito no encontrado." });
    }
  }
}