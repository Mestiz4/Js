import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils/utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import ProductManagerFS from "./dao/productManagerFS.js";
import mongoose from "mongoose";
import path from "path";
import productsFSRouter from "./routes/products.router.js";
import cartsFSRouter from "./routes/cart.router.js";
import cartsDBRouter from "./routes/cartsDB.router.js";
import productsDBRouter from "./routes/productsDB.router.js";
import { messagesModel } from "./dao/models/messages.model.js";

const app = express();
const port = 8080;
const pm = new ProductManagerFS(path.join(__dirname, "../files/products.json"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname,"../views"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/", viewsRouter);

app.use("/api/productsFS", productsFSRouter);

app.use("/api/cartsFS", cartsFSRouter)

app.use("/api/cartsDB", cartsDBRouter);

app.use("/api/productsDB", productsDBRouter);

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
    socket.emit("messagesListUpdated");
  })
});

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://mestiz4:coderhouse@cluster0.bmj5i9t.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce");
    console.log("Conexión a DB establecida");
  } catch (error) {
    console.log(`Error al conectarse con la DB. Error: ${error}`);
  }
}

connect();

serverSockets.on("error", (error) => console.error(error));