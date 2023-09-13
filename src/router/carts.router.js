import { Router } from "express"
import CartsService from "../services/cart.services.js"
import CartManager from "../controllers/cartManager.js"
import { __dirname } from "../utils.js"

const cartService = new CartsService();
const router = Router()

router.get("/cart", async (req, res) => {
  const query = req.query;

  try {
    const carts = await cartService.getCarts(
    )

    res.send({ status: 'success', payload: carts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error, message: "No se pudo obtener los items." });
  }
});

//   const carrito = await manager.getCarts()
//   res.json({ carrito })
// })


//Carrito según ID
router.get("/cart/:cid", async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await cartService.getCartsById(cartId);
    if (!cart) {
      return res.status(404).send({ error: 'Carrito no encontrado' });
    }
    res.status(200).send(cart);
  } catch (error) {
    console.error('Error al obtener el carrito por ID:', error);
    res.status(500).send({ error: 'Error al obtener el carrito por ID' });
  }
});
//   const carritofound = await manager.getCartbyId(req.params)
//   res.json({ status: "success", carritofound })
// })


// router.post("/cart", async (req, res) => {
//   const newcart = await manager.addCart();
//   res.json({ status: "success", newcart });
// });

router.post("/cart/:cid/products/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    await manager.addProductToCart(cid, pid);
    res.json({ status: "success", message: "Product added to cart successfully." });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ status: "error", message: "Failed to add product to cart." });
  }
});


//DELETE
//Debe eliminar el producto seleccionado
router.delete('/cart/:cid/products/:pid', async (req, res) => {
  try {

  } catch (error) {

  }
})

//Debe eliminar todos los productos del carrito
router.delete('/cart/:cid', async (req, res) => {
  try {

  } catch (error) {

  }
})

//PUT
//Debe actualizar el carrito
router.put('/cart/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { product } = req.body;
    const cart = await cartService.getCartsById(cartId);
    let lastProduct = product.slice(-1)[0]
    let filter = cart.products.find(e => e.name === lastProduct.name)

    if (filter) {
      let deletedArr = cart.products.filter(e => e.name !== filter.name)
      filter.quantity += 1
      deletedArr.push(filter)
      const updatedCart = await cartService.addToCart(cartId, deletedArr);
      res.status(200).send({ result: 'success', payload: updatedCart });
    } else if (!filter && cart.products.length === 0) {
      const updatedCart = await cartService.addToCart(cartId, product);
      res.status(200).send({ result: 'success', payload: updatedCart });
    } else if (!filter && cart.products.length > 0) {
      let newUpdateArr = [...cart.products, product[product.length - 1]]
      const updatedCart = await cartService.addToCart(cartId, newUpdateArr);
      res.status(200).send({ result: 'success', payload: updatedCart });
    }

  } catch (error) {
    console.error("No se pudo agregar el producto al carrito con mongoose: " + error);
    res.status(500).send({ error: "No se pudo agregar producto al carrito con mongoose", message: error });
  }
});

//   try {

//   } catch (error) {

//   }
// })

//Debe actualizar solo la cantidad del producto
router.put('/cart/:cid/products/:pid', async (req, res) => {
  try {

  } catch (error) {

  }
})

export default router