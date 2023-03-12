import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { __dirname } from "./helpers/utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import ProductManager from "./managers/ProductManager.js";
import mongoose from "mongoose";
import path from "path";
import cartsDBRouter from "./routes/cartsDB.router.js";
import { messagesModel } from "./dbmodels/models/messages.model.js";

const app = express();
const port = 8080;
const pm = new ProductManager(path.join(__dirname, "../files/products.json"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname,"../views"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/", viewsRouter);

app.use("/api/products", productsRouter);

app.use("/api/cart", cartRouter);

app.use("/api/cartsDB", cartsDBRouter);

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

  socket.on("newMessage", async ({ user, message }) => {
    await messagesModel.create({ user: user, message: message });
    io.emit("messagesListUpdated");
  })
});

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://admin01:Rafa1234@cluster0.pfcfkjg.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce");
    console.log("DB connection success");
  } catch (error) {
    console.log(`DB connection fail. Error: ${error}`);
  }
}

connect();

serverSockets.on("error", (error) => console.error(error));