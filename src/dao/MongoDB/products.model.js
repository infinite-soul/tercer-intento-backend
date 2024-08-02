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
        required: true,
        min: 0
    },
    thumbnail: {
        type: [String],
        required: true
    },
    stock: { 
        type: Number,
        required: true,
        min: 0
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    category: {  
        type: String,
        index: true,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

productSchema.plugin(mongoosePaginate);

productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export const ProductModel = mongoose.model('Product', productSchema);