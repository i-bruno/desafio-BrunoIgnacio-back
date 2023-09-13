import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'productos';
const productsSchema = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    price: Number,
    size: Number,
    stock: Number
})

productsSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;