import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: Array,
    stock: Number,
    code: String,
    category: String,
    available: Boolean
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model('Product', productSchema);

export { ProductModel };