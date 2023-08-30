import { Router } from "express"
import ProductManager from "../controllers/productManager.js"
import { __dirname } from '../utils.js'
import { productsModel } from "../models/products.model.js"

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

export default router

