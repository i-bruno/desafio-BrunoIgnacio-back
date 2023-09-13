import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartCollection = 'carritos';
const cartSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: []
    }
});

cartSchema.plugin(mongoosePaginate)

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;