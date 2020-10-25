const massive = require('massive');

require('dotenv').config();

let dbPromise;
const { connection_string } = process.env;

module.exports = {
    initDb() {
        dbPromise = dbPromise || massive(connection_string);
        return dbPromise;
    }
}