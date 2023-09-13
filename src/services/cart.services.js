import cartModel from "../models/carts.model.js"

export default class CartsService {

    getCarts = async () => {
        try {
            let cartsListResult = await cartModel.find()
            return cartsListResult
        } catch (error) {
            return error
        }
    }

    createCart = async () => {
        try {
            const newCart = await cartModel.create({ products: [] });
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw error;
        }
    };



    // Corrección en addToCart para que utilice el cartId pasado como parámetro
    addToCart = async (cartId, productInfo) => {
        try {
            const updatedCart = await cartModel.findByIdAndUpdate(
                cartId,
                { products: productInfo }

            );
            return updatedCart;
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw error;
        }
    };

    getCartsById = async (cartId) => {
        try {
            let productByIdResult = await cartModel.findById(cartId).populate('products')

            return productByIdResult
        } catch (error) {
            return error
        }
    }


    updateCartProductById = async (cartId, productUpdatedId, quantity) => {
        try {
            let updateProductResult = await cartModel.updateOne({ "_id": cartId, "products.id": productUpdatedId }, { $set: { "products.$.quantity": quantity } })
            return updateProductResult
        } catch (error) {
            return error
        }
    }

    deleteProducts = async (cartId) => {
        try {
            let updateProductResult = await cartModel.updateOne({ _id: cartId }, { $set: { products: [] } })
            console.log(updateProductResult)
            return updateProductResult
        } catch (error) {
            return error
        }
    }
}