const mongoose = require('mongoose');


const saleSchema = mongoose.Schema(
    {
        products: [
            { 
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                name: String,
                price: Number,
                quantity: Number,
            },
        ],
        total: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
