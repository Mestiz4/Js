import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { __dirname } from "./helpers/utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const port = 8080;
const pm = new ProductManager(`${__dirname}/files/products.json`);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname +'/public'))

app.use("/", viewsRouter);

app.use("/api/products", productsRouter);

app.use("/api/cart", cartRouter);

const httpServer = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const serverSockets = new Server(httpServer);

serverSockets.on("connection", async (socket) => {
  console.log("New client connected");

  let products = await pm.getProducts();
  socket.emit("products", products);

  socket.on("deleteProduct", async (id) => {
    let response = await pm.deleteProductSocket(id);
    socket.emit("deleteProductRes", response);
  });

  socket.on("addProduct", async (product) => {
    let response = await pm.addProductSocket(product);
    socket.emit("addProductRes", response);
  });
});