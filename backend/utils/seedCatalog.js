const dotenv = require('dotenv');
const Product = require('../models/productModel');
const openDatabaseConnection = require('../config/mongoConnection');
const catalog = require('../data/products.json');

dotenv.config({ path: 'backend/config/config.env' });

async function seedCatalog() {
    try {
        await openDatabaseConnection();
        await Product.deleteMany({});
        const inserted = await Product.insertMany(catalog);
        console.log(`Added ${inserted.length} products`);
        process.exit(0);
    } catch (error) {
        console.error('Could not load products:', error.message);
        process.exit(1);
    }
}

seedCatalog();
