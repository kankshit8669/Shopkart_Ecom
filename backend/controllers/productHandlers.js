const Product = require('../models/productModel');
const cloudinary = require('cloudinary');
const ErrorHandler = require('../utils/requestError');
const wrapAsyncRoute = require('../middlewares/asyncWrapper');
const ProductQueryBuilder = require('../utils/productQuery');

async function findProduct(id) {
    const product = await Product.findById(id);
    if (!product) throw new ErrorHandler('We could not find this product.', 404);
    return product;
}

function getImageInputs(value) {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
}

async function storeImages(images) {
    const uploaded = [];
    for (const image of images) {
        const saved = await cloudinary.v2.uploader.upload(image, { folder: 'products' });
        uploaded.push({ public_id: saved.public_id, url: saved.secure_url });
    }
    return uploaded;
}

async function removeImages(images) {
    for (const image of images || []) {
        if (image.public_id) await cloudinary.v2.uploader.destroy(image.public_id);
    }
}

function refreshReviewTotals(product) {
    const reviews = product.reviews;
    product.numOfReviews = reviews.length;
    product.ratings = reviews.length
        ? reviews.reduce((total, review) => total + Number(review.rating), 0) / reviews.length
        : 0;
}

exports.handleNewProduct = wrapAsyncRoute(async (req, res) => {
    const details = { ...req.body, user: req.user.id };
    details.images = await storeImages(getImageInputs(req.body.images));
    const product = await Product.create(details);
    res.status(201).json({ success: true, product });
});

exports.handleGetProducts = wrapAsyncRoute(async (req, res) => {
    const resPerPage = 4;
    const productsCount = await Product.countDocuments();
    const finder = new ProductQueryBuilder(Product.find(), req.query).search().filter();
    const matchingProducts = await finder.query;
    const filteredProductsCount = matchingProducts.length;
    finder.pagination(resPerPage);
    const products = await finder.query;
    res.json({ success: true, productsCount, resPerPage, filteredProductsCount, products });
});

exports.handleGetAdminProducts = wrapAsyncRoute(async (req, res) => {
    const products = await Product.find();
    res.json({ success: true, products });
});

exports.handleGetSingleProduct = wrapAsyncRoute(async (req, res) => {
    const product = await findProduct(req.params.id);
    res.json({ success: true, product });
});

exports.handleUpdateProduct = wrapAsyncRoute(async (req, res) => {
    const product = await findProduct(req.params.id);
    const changes = { ...req.body };
    if (req.body.images !== undefined) {
        const newImages = await storeImages(getImageInputs(req.body.images));
        await removeImages(product.images);
        changes.images = newImages;
    }
    const updated = await Product.findByIdAndUpdate(product.id, changes, {
        new: true, runValidators: true, useFindAndModify: false
    });
    res.json({ success: true, product: updated });
});

exports.handleDeleteProduct = wrapAsyncRoute(async (req, res) => {
    const product = await findProduct(req.params.id);
    await removeImages(product.images);
    await product.remove();
    res.json({ success: true, message: 'The product has been removed from the catalog.' });
});

exports.handleCreateProductReview = wrapAsyncRoute(async (req, res) => {
    const { productId, rating, comment } = req.body;
    const product = await findProduct(productId);
    const customerId = String(req.user._id);
    const existing = product.reviews.find(item => String(item.user) === customerId);

    if (existing) {
        existing.rating = Number(rating);
        existing.comment = comment;
    } else {
        product.reviews.push({
            user: req.user._id, name: req.user.name, rating: Number(rating), comment
        });
    }
    refreshReviewTotals(product);
    await product.save({ validateBeforeSave: false });
    res.json({ success: true });
});

exports.handleGetProductReviews = wrapAsyncRoute(async (req, res) => {
    const product = await findProduct(req.query.id);
    res.json({ success: true, reviews: product.reviews });
});

exports.handleDeleteReview = wrapAsyncRoute(async (req, res) => {
    const product = await findProduct(req.query.productId);
    product.reviews = product.reviews.filter(item => String(item._id) !== String(req.query.id));
    refreshReviewTotals(product);
    await product.save({ validateBeforeSave: false });
    res.json({ success: true });
});
