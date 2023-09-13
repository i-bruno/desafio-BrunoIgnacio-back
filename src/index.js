import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"

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
//Passport imports
import initializePassport from "../src/config/passport.config.js"
import passport from "passport"
//Routers
import viewRouter from "./router/view.router.js"
import usersViewRouter from "./router/users.views.router.js"
import sessionsRouter from "./router/session.router.js"
import githubLoginViewRouter from './router/github-login.views.router.js'

const app = express()

//JSON settings:
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

const DB = 'mongodb+srv://i-bruno:cuervo22@cluster0.o4fj8y7.mongodb.net/store?retryWrites=true&w=majority'

app.use(session({
  store: MongoStore.create({
    mongoUrl: DB,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 10
  }),
  secret:"elsecreto",
  resave:false,
  saveUninitialized:false
}))

//Middlewares Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//rutas
app.use("/", viewRouter)
app.use("/users", usersViewRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/github", githubLoginViewRouter);


const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor express en puerto ${PORT}`)
  })

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






app.use(cookieParser());



app.use(express.static(__dirname + "/public"))









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