import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import viewRouter from "./router/view.router.js"
import cartRouter from "./router/carts.router.js"
// import ProductManager from "./controllers/productManager.js"
import mongoose from "mongoose"
import usersRouter from "./router/users.router.js"
import productRouter from "./router/products.router.js"
import productsModel from "./models/products.model.js"
import cookieParser from 'cookie-parser'
import session from 'express-session'
// import FileStore from "session-file-store"
import MongoStore from "connect-mongo"
import sessionsRouter from "./router/session.router.js"
import usersViewRouter from "./router/users.views.router.js"

const DB = 'mongodb+srv://i-bruno:cuervo22@cluster0.o4fj8y7.mongodb.net/store?retryWrites=true&w=majority'
const connectMongoDB = async () =>{
  try{
    await mongoose.connect(DB);
    console.log('Conexión exitosa a MongoDB utilizando Mongoose');

    let products = await productsModel.paginate({}, {limit: 10, page: 1});

    // console.log(products);

  } catch (error) {
    console.error("No se pudo conectar a la BD con Mongoose:" + error);
    process.exit();
  }
}

connectMongoDB();

// const fileStorage = FileStore(session);

const app = express()
const PORT = 8080;

app.use(cookieParser());
app.use(session({
  // store:new fileStorage({path:'./sessions', ttl:100, retries:0}),
  store: MongoStore.create({
    mongoUrl: DB,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 10
  }),
  secret:"elsecreto",
  resave:false,
  saveUninitialized:false
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

//handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//rutas
app.use("/", viewRouter)
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
// app.use("/api", productRouter)
// app.use("/api", cartRouter)

// app.use("/api/users", usersRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);



const httpServer = app.listen(PORT, () => {
console.log(`Servidor express en puerto ${PORT}`)
})

// const pmanager = new ProductManager(__dirname + "/models/products.json")
// const socketServer = new Server(httpServer)

// socketServer.on("connection", async (socket) => {
//   console.log("cliente conectado con id:", socket.id)
//   const products = await pmanager.getProducts({});
//   socket.emit('productos', products);

//   socket.on('addProduct', async data => {
//     await pmanager.addProduct(data);
//     const updatedProducts = await pmanager.getProducts({}); // Obtener la lista actualizada de productos
//     socket.emit('productosupdated', updatedProducts);
//   });

//   socket.on("deleteProduct", async (id) => {
//     console.log("ID del producto a eliminar:", id);
//     const deleteProduct = await pmanager.deleteProduct(id);
//     const updatedProducts = await pmanager.getProducts({});
//     socketServer.emit("productosupdated", updatedProducts);
//   });
// })