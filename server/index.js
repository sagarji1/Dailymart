const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const app = require('./app');
const Database = require('./data-source');

const port = 8080;

// IIFE
(async() => {
    try {
        await Database.connect();
        console.log('DB Connection Open');
        app.listen(port, () => {
            console.log(`server running on port ${port}`);
        });
    }
    catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
})();
