import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

cartSchema.methods.calculateTotal = function() {
    return this.products.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
};

export const CartModel = mongoose.model('Cart', cartSchema);