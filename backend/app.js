const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const errorResponses = require('./middlewares/errorResponses');

if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(fileUpload());

const routeFiles = [
    './routes/productRoutes',
    './routes/authRoutes',
    './routes/paymentRoutes',
    './routes/orderRoutes'
];
routeFiles.forEach(file => app.use('/api/v1', require(file)));

app.use('/api/v1', (req, res) => {
    res.status(404).json({ success: false, message: 'This API endpoint does not exist.' });
});

if (process.env.NODE_ENV === 'PRODUCTION') {
    const buildFolder = path.join(__dirname, '..', 'frontend', 'build');
    app.use(express.static(buildFolder));
    app.get('*', (req, res) => res.sendFile(path.join(buildFolder, 'index.html')));
}

app.use(errorResponses);
module.exports = app;
