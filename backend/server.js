const cloudinary = require('cloudinary');
const app = require('./app');
const openDatabaseConnection = require('./config/mongoConnection');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function startShopKart() {
    try {
        await openDatabaseConnection();
        const port = Number(process.env.PORT) || 4000;
        const server = app.listen(port, () => console.log(`ShopKart server listening on ${port}`));
        process.on('unhandledRejection', error => {
            console.error('Unhandled rejection:', error);
            server.close(() => process.exit(1));
        });
    } catch (error) {
        console.error('Server could not start:', error.message);
        process.exit(1);
    }
}

startShopKart();
