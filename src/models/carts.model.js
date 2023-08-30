import mongoose from "mongoose";

const cartCollection = 'carritos';
const cartSchema = new mongoose.Schema({
    
})

export const cartModel = mongoose.model(cartCollection, cartSchema);