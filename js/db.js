let sqlite3 = require('sqlite3').verbose();
let filepath = "./webshop.db";

function createDbConnection() {
    let db = new sqlite3.Database(filepath, (error) => {
        if (error) {
            return console.error(error.message);
        }
        createTable(db);
    });
    console.log("Connection with Webshop established");
    return db;
}

function createTable(db) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS customers (
            customer_id INTEGER NOT NULL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL
        );
    `);
    db.exec(`
        CREATE TABLE IF NOT EXISTS bookings (
            bookings_id INTEGER NOT NULL,
            bike_id INTEGER NOT NULL,
            booking_date VARCHAR(50) NOT NULL,
            number INTEGER NOT NULL,
            customer_id INTEGER NOT NULL,
            PRIMARY KEY (bookings_id),
            FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        );
    `);
}

module.exports = createDbConnection();