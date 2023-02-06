let fs = require("fs");
let sqlite3 = require('sqlite3').verbose();
let filepath = "./webshop.db";

//Datenbankverbindung aufbauen
function createDbConnection() {
    if (fs.existsSync(filepath)) {
        return new sqlite3.Database(filepath);
    } else {
        let db = new sqlite3.Database(filepath, (error) => {
            if (error) {
                return console.error(error.message);
            }
            createTable(db);
        });
        console.log("Connection with Webshop established");
        return db;
    }
}

//Tabellen erstellen 
function createTable(db) {
    //Kundentabelle
    db.exec(`
        CREATE TABLE customers (
            customer_id INTEGER NOT NULL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL
        );
    `);
    //Buchungstabelle
    db.exec(`
        CREATE TABLE bookings (
            bookings_id INTEGER NOT NULL,
            bike_id INTEGER NOT NULL,
            booking_date VARCHAR(50) NOT NULL,
            number INTEGER NOT NULL,
            email VARCHAR(50) NOT NULL,
            PRIMARY KEY (bookings_id),
            FOREIGN KEY (email) REFERENCES customers (email)
        );
    `);
}

module.exports = createDbConnection();