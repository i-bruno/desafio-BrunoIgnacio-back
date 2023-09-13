import { Router } from "express";
import productsModel from "../models/products.model.js";

const router = Router();

//Crear
router.post('/', async (req, res) => {
    try {
        let { title, category, description, price, size, stock } = req.body
        let product = await productsModel.create({ title, category, description, price, size, stock });
        res.status(201).send({ result: 'success', payload: product })
    } catch (error) {
        console.error("No se pudo crear producto con mongoose" + error);
        res.status(500).send({ error: "No se pudo crear producto con mongoose", message: error })
    }
})

//Lectura
router.get('/', async (req, res) => {
    try {
        let products = await productsModel.find();
        console.log(products);
        res.send({ result: 'success', payload: products })
    } catch (error) {
        console.error("No se pudo obtener products con mongoose" + error);
        res.status(500).send({ error: "No se pudo obtener products con mongoose", message: error })
    }
})

//Put/Actualización
router.put('/:id', async (req, res) => {
    try {
        let productUpdated = req.body
        let product = await productsModel.updateOne({ _id: req.params.id }, productUpdated);
        res.status(202).send(product);
    } catch (error) {
        console.error("No se pudo obtener el usuario con mongoose" + error);
        res.status(500).send({ error: "No se pudo obtener el usuario con mongoose", message: error })
    }
})

//Borrar producto
router.delete('/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let result = await productsModel.deleteOne({ _id: id });
        res.status(202).send({ status: "success", payload: result });
    } catch (error) {
        console.error("No se pudo obtener el usuario con mongoose" + error);
        res.status(500).send({ error: "No se pudo obtener el usuario con mongoose", message: error })
    }
})


export default router;