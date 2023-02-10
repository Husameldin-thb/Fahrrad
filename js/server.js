let uuid = require('uuid');
let uuidv4 = uuid.v4;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let db = require("./db");

let sessionHandler = new Array (); //aktuelle Sitzung speichern: Index[0]: Datum, Index[1]: Anzahl der Fahrräder, Index[2]: Fahrrad-ID
let customerHandler = new Array (); //aktuellen Customer speichern

//Array, in dem Rezensionen gespeichert werden inkl. "Muster-Rezensionen"
let savedFeedbacks = [
	{
		name: "Marius H.",
		feedback: "Toller Service"
	},
	{
		name: "Meier",
		feedback: "Den ganzen Tag Fahrrad fahren für wenig Geld - super!"
	},
	{
		name: "Harald Meier",
		feedback: "Gern wieder"
	}
];

//Server erstellen
app.use(bodyParser.urlencoded({enxtended: true}));
app.use(bodyParser.json());

let server = app.listen(8080, function () {
	let port = server.address().port;

	console.log("Webserver is running on port " + port);
});

//Verfügbarkeit eines Fahrrad an einem übergebenen Datum prüfen
app.post('/api/v1/checkAvailability', (req, res) => {
	let number = new Array ();
	console.log(req.body);
	db.all(`SELECT 10-SUM(number) AS num FROM bookings WHERE booking_date = "${req.body.data}" AND bike_id = "${req.body.id}"`, (error, row) => {
		if (error) {
			throw new Error(error.message);
		}
		number = row;
		console.log(row);
		if(row[0].num == 0){ //Wenn Anzahl 0 = Fahrrad nicht mehr verfügbar
			sessionHandler.push(req.body.data, row[0].num, req.body.id);
			return res.send("0");
		} else if(row[0].num == null) { //Wenn keine Buchungen gefunden = Fahrrad noch 10 Mal verfügbar
			sessionHandler.push(req.body.data, 10, req.body.id);
			return res.send("1");
		}
		else{
			sessionHandler.push(req.body.data, row[0].num, req.body.id);
			return res.send("1");
		}
	});
});

//Session-Handling
app.post('/api/v1/session', (req, res) => {
	console.log(sessionHandler);
	return res.send(sessionHandler);
})

//Buchung in DB speichern
app.post('/api/v1/booking', (req, res) => {
	console.log(req.body);
	let content = "0";
	db.get(`SELECT * FROM customers WHERE email = "${req.body.email}"`, (error, row) => { //Prüfen, ob Kunde bereits vorhanden ist
		if (error) {
			throw new Error(error.message);
		}
		return row
			? content = "1"
			: console.log("empty");
	});
	if(req.body.number > sessionHandler[1]){ //Falls Anzahl größer als verfügbare Anzahl
		sessionHandler.length = 0;
		return res.send("0")
	}
	else{
		if(content == "0") { //Wenn Kunde noch nicht in DB	
			db.run(
				`INSERT INTO customers (customer_id, name, email, password) VALUES (?, ?, ?, ?)`, 
				[null, req.body.name, req.body.email, req.body.password],
				function (error) {
					if (error) {
						console.error(error.message);
					}
					console.log(`Inserted a row in customers with the ID: ${this.lastID}`);
				}
			);
			db.run(
				`INSERT INTO bookings (bookings_id, bike_id, booking_date, number, email) VALUES (?, ?, ?, ?, ?)`, 
				[null, sessionHandler[2], sessionHandler[0], req.body.number, req.body.email],
				function (error) {
					if (error) {
						console.error(error.message);
					}
					console.log(`Inserted a row in bookings with the ID: ${this.lastID}`);
				}
			);
		}
		else{ //Wenn Kunde schon in DB vorhanden, dann nur noch Buchunng in DB speichern
			db.run(
				`INSERT INTO bookings (bookings_id, bike_id, booking_date, number, email) VALUES (?, ?, ?, ?, ?)`, 
				[null, sessionHandler[2], sessionHandler[0], req.body.number, req.body.email],
				function (error) {
					if (error) {
						console.error(error.message);
					}
					console.log(`Inserted a row in bookings with the ID: ${this.lastID}`);
				}
			);
		}
	}
	sessionHandler.length = 0; //Buchung erfolgreich: sessionHandler leeren
	return res.send("1");
})

//Alternativen in DB ausgeben, wenn gewünschtes Fahrrad nicht verfügbar ist
app.post('/api/v1/alternatives', (req, res) => {
	console.log(sessionHandler);
	db.all(`SELECT 10-SUM(number) AS num, bike_id FROM bookings WHERE booking_date = "${sessionHandler[0]}" GROUP BY bike_id`, (error, row) => {
		if (error) {
			throw new Error(error.message);
		}
		return res.send(row);
	});
	sessionHandler.length = 0; //Alternativen ausgegeben: sessionHandler leeren
});

//Login-Daten prüfen
app.post('/api/v1/login', (req, res) => {
	console.log(req.body);
	db.get(`SELECT * FROM customers WHERE email = "${req.body.email}" AND password = "${req.body.password}"`, (error, row) => {
		if (error) {
			throw new Error(error.message);
		}
		customerHandler.push(row);
		console.log(customerHandler);
		return row
			? res.send("1") //Login-Daten gefunden bzw. korrekt
			: res.send("0"); //Login-Daten falsch bzw. nicht gefunden
	});
});

//Passwort zu einer übergebenen E-Mail abfragen
app.post('/api/v1/pw', (req, res) => {
	console.log(req.body);
	db.get(`SELECT password FROM customers WHERE email = ?`, [req.body.email], (error, row) => {
		if (error) {
			throw new Error(error.message);
		}
		return row
			? res.send(row)
			: res.send("0");
	});
});

//Buchungen eines Kunden anhand dessen E-Mail-Adresse von DB abfragen
app.post('/api/v1/myBookings', (req, res) => {
	console.log(customerHandler[0].email);
	if(customerHandler.length == 0) {
		return res.send("0");
	} else {
		db.all(`SELECT * FROM bookings WHERE email = ?`, [customerHandler[0].email], (error, row) => {
			if (error) {
				throw new Error(error.message);
			}
			return res.send(row);
		});
	}
});

//Buchung stornieren anhand der übergebenen Buchungs-ID
app.post('/api/v1/deleteBooking', (req, res) => {
	console.log(req.body.bookings_id);
	db.run(
		`DELETE FROM bookings WHERE bookings_id = ?`, 
		[req.body.bookings_id],
		function (error) {
			if (error) {
				console.error(error.message);
			}
			console.log(`Row deleted.`);
		}
	);
	return res.send(true);
});

//Kunden ausloggen
app.post('/api/v1/logout', (req, res) => {
	customerHandler.length = 0; //customerHandler leeren
	return res.send(true);
});

//Rezensionen ausgeben und speichern
app.post('/api/v1/feedback', (req, res) => {
	console.log(Object.keys(req.body).length);
	if(Object.keys(req.body).length === 0){ //wenn keine JSON übergeben wurde, Rezensionen übermitteln
		return res.send(savedFeedbacks);
	} else { //Wenn JSON übergeben, dann enthaltene Werte als Rezension speichern
		let setFeedback = {
			name: req.body.name,
			feedback: req.body.content
		};
		console.log(savedFeedbacks);
		savedFeedbacks.unshift(setFeedback); //Rezension an vorderster Stelle des Arrays der gespeicherten Rezensionen einfügen
		return res.send(savedFeedbacks); //Rezensionen zurückgeben
	}
});

//Prüfen, ob Kunde eingeloggt, also customerHandler nicht leer ist
app.post('/api/v1/getStatusOfCustomerLogin', (req, res) => {
	console.log(customerHandler.length);
	if(customerHandler.length === 0){
		return res.send("0");
	} else {return res.send("1");}
});