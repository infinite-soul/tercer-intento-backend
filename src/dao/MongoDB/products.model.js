import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    price: { 
        type: Number,
        required: true
    },
    thumbnail: {
        type: [String],
        required: true
    },
    stock: { 
        type: Number,
        required: true
    },
    code: String,
    category: {  
        type: String,
        index: true
    },
    available: Boolean
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('Product', productSchema);