const mongoose = require('mongoose');

const availableCategories = [
    'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones',
    'Food', 'Books', 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Outdoor', 'Home'
];

const productPhotoSchema = new mongoose.Schema({
    public_id: { type: String, required: true },
    url: { type: String, required: true }
}, { _id: false });

const customerReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Enter a product name'], trim: true, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    ratings: { type: Number, default: 0 },
    images: { type: [productPhotoSchema], default: [] },
    category: { type: String, required: true, enum: availableCategories },
    seller: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    reviews: { type: [customerReviewSchema], default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
