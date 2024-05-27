import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: Array,
    stock: Number,
    code: String
});

export const ProductModel = mongoose.model('Product', productSchema);