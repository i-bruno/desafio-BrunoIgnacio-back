import { Router } from "express"
import ProductManager from "../controllers/productManager.js"
import { __dirname } from '../utils.js'
import productsModel from "../models/products.model.js"
import cookieParser from "cookie-parser"

const pmanager = new ProductManager(__dirname + '/models/products.json')

const router = Router()

router.get("/", async (req, res) => {
  const listaproductos = await pmanager.getProducts({})
  res.render("home", { listaproductos })
})

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts")
})

router.get("/products", async (req, res) => {
  let page = parseInt(req.query.page);
  if (!page) page = 1;

  let result = await productsModel.paginate({}, { page, limit: 5, lean: true })
  result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
  result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
  result.isValid = !(page <= 0 || page > result.totalPages);
  res.render('products', result)
})

router.use(cookieParser());



router.get('./setCookie', (req, res) => {
  res.cookie('galleta', 'Esta es una cookie de prueba', { maxAge: 10000 }).send("Cookie");
})

router.get("/session", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Esta página se visitó ${req.session.counter}`)
  } else {
    req.session.counter = 1;
    res.send("Bienvenide!")
  }
})

router.get("/logout", (req,res)=>{
  req.session.destroy(error =>{
    if (error){
      res.json({error: "Error de desconexión", msg: "Error al cerrar la sesión"})
    }
    res.send("Sesión cerrada correctamente!!")
  })
})



export default router

