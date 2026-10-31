const mongoose = require('mongoose');

async function openDatabaseConnection() {
    if (!process.env.DB_URI) throw new Error('DB_URI is not configured');

    const connection = await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    console.log(`Connected to MongoDB: ${connection.connection.host}`);
    return connection;
}

module.exports = openDatabaseConnection;
