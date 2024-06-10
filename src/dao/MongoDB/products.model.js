import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    description: String,
    price: Number,
    thumbnail: Array,
    stock: Number,
    code: String,
    category: {  
        type: String,
        index: true
    },
    available: Boolean
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('Product', productSchema);