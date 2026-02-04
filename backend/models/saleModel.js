const mongoose = require('mongoose');


const saleSchema = mongoose.Schema(
    {
        Products: [
            { 
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                name: String,
                price: Number,
                quantity: Number,
            },
        ],
        total: { type: Number, required: true },
        createAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
