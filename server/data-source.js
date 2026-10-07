const mongoose = require('mongoose');
const dns = require('dns');

try {
    dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    console.warn('Could not set custom DNS servers:', e.message);
}

class Database {
    static async connect() {
        const dbUrl = process.env.MONGO_DB_URL;

        if (!dbUrl) {
            throw new Error('MONGO_DB_URL is not configured. Add it to server/.env.');
        }

        await mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 10000,
        });
    }

    static async disconnect() {
        await mongoose.disconnect();
    }
}

module.exports = Database;
