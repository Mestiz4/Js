import fs from "fs";
import { v4 as newID } from "uuid";


class Product {
    constructor(id, name, description, price, status = true, category , img, code, stock) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.price = price;
      this.status = status;
      this.category = category;
      this.img = img;
      this.code = code;
      this.stock = stock;
    }
  }


  export default class ProductManager {
    constructor(path){
        this.path= path;
    }

    async getProducts(limit){
      let productExists = fs.existsSync(this.path)
        if(productExists){
            let lectura=await fs.promises.readFile(this.path,"utf-8");
            let products = JSON.parse(lectura)
            return products.slice(0,limit);
        }else{
            return[]
        }
    }

    async getProductById(req, res) {
      res.setHeader("Content-Type", "application/json");
      let products = await this.getProducts();
      let product = products.find((product) => product.id === req.params.pid);
      if (product) {
        res.status(200).json({ product });
      } else {
        res.status(400).json({ error: "El producto no existe" });
      }
      }

      async deleteProduct(req, res) {
        res.setHeader("Content-Type", "application/json");
        let id = await req.params.pid;
        let products = await this.getProducts();
        let productIndex = products.findIndex((product) => product.id === id);
        let productExists = productIndex !== -1;
        if (productExists) {
          products.splice(productIndex, 1);
          await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
          res.status(201).json({ message: `Producto eliminado` });
        } else {
          res.status(400).json({ error: "El producto no existe" });
        }
      }

      async updateProduct(req, res) {
        res.setHeader("Content-Type", "application/json");
        let id = req.params.pid;
        let { name, description, price, status, category , img, code, stock } = req.body;
        let products = await this.getProducts();
        let indexByID = products.findIndex((product) => product.id === id);
        let productExists = indexByID !== -1;
        if (productExists) {
          let indexByCode = products.findIndex((product) => product.code === code);
          let codeExists = indexByCode !== indexByID && indexByCode !== -1;
          if (codeExists) {
            res.status(400).json({ error: "Ese código ya existe" });
          } else {
            price = Number(price);
            stock = Number(stock);
            status === "false" && (products[indexByID].status = false);
            status === "true" && (products[indexByID].status = true);
            title && (products[indexByID].name = name);
            description && (products[indexByID].description = description);
            code && (products[indexByID].code = code);
            price && (products[indexByID].price = price);
            stock && (products[indexByID].stock = stock);
            category && (products[indexByID].category = category);
            thumbnails && (products[indexByID].img = img);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            res.status(201).json({ message: "Producto actualizado" });
          }
        } else {
          res.status(400).json({ error: "El producto no existe" });
        }
      }
    



      async addProduct(req, res) {
        res.setHeader("Content-Type", "application/json");
        let { name, description, code, price, status, stock, category, img } = req.body;
        let products = await this.getProducts();
        let productExists = products.findIndex((product) => product.code === code) !== -1;
        if (productExists ) {
          return res.status(400).json({ error: 'Producto no añadido. Error: el código ya existe.' });
        } else {
          price = Number(price);
          stock = Number(stock);
          status === "false" ? (status = false) : (status = true);
          let id = newID();
          let newProduct = new Product(id, name, description, price, status, category , img, code, stock);
          products.push(newProduct);
          await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
          res.status(201).json({ message: `Producto añadido` });
        }
      }
}

