let uuid = require('uuid');
let uuidv4 = uuid.v4;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let db = require("./db");

let idCounter = 0;
let booking_id = 1;
let customers = new Array ();
let malebike = new Array ();
let bike_01 = new Array ();
let bike_02 = new Array ();
let bike_03 = new Array ();
let bike_04 = new Array ();
let bike_05 = new Array ();
let bike_06 = new Array ();
let sessionHandler = new Array ();
let userid = 1;

app.use(bodyParser.urlencoded({enxtended: true}));
app.use(bodyParser.json());

let server = app.listen(8080, function () {
	let port = server.address().port;

	console.log("Webserver is running on port " + port);
});

/*
//REST API abrufen
app.get('/api/v1/customers', (req, res) => {
	let userID = Object.keys(customers);	//Gibt Liste der Schlüssel aus Customers zurück
	res.send(userIDs)
});

//Customer hinzufügen
app.post('/api/v1/customers', (req, res) => {
	let customerID = 'id' + idCounter;	//erstellt eine Variable, die die ID ist, wenn man einen Kunden anlegt
	idCounter = idCounter + 1;
	let customer = req.body;	//Parameter (Vorname, Name) im Body mitschicken (bspw. in Insomnia mgl.)
	customers[customerID = customer];
	res.send(customerID);		//zuweisen der ID, siehe let customerID
});

app.get('/api/v1/customers/:userID', (req, res) => {
	let id = req.params.userID;

	let user = customers[id];

	if (user === undefined || user === null) {
		res.status(404);
		return res.send("Customer not found");
	}
	return res.send(user);
});

//Customers ändern
app.put('/api/v1/customers/:userID', (req, res) => {
	let customerID = req.params.userID;
	let customer = req.body;
	customers[customerID] = customer;
	res.send(customerID);
});


//Verfübarkeit für ein Fahrrad prüfen
app.post('/api/v1/malebike', (req, res) => {
	let i = 0;
	console.log(req.body); //data: value
	if(malebike.length == 0){
		malebike.push(req.body.data); //value einfügen
		console.log("length 0");
		return res.send("1");
	}
	else{
		while(i < malebike.length){
			if(malebike[i] === req.body.data){
				console.log("ist bereits vorhanden");
				return res.send("0");
			}
			else{
				i++;
				console.log(i);
			}
		}
		malebike.push(req.body.data);
		console.log("geht noch");
		console.log(malebike);
		return res.send("1");
	}
	console.log("Yes");
	//res.send("1");
});*/

app.post('/api/v1/checkAvailability', (req, res) => {
	let i = 0; //Index-Durchzähler
	let counter = 0; //Fahrradbestand
	let result = new Array ();
	console.log(req.body);
	switch(req.body.id) {
		case 1:
			if(bike_01.length == 0){
				console.log("length 0");
				const obj = {value: "1", number: 10};
				sessionHandler.push(req.body.data, 10-counter, req.body.id); //Session-Handling
				return res.send(obj);
			}
			else{
				while(i < bike_01.length){
					if(counter < 10){
						if(bike_01[i] === req.body.data){
							counter += 1;
							i++;
							console.log(counter);
						}
						else{i++;}
					}
					else{return res.send("0");}
				}
				const obj = {value: "1", number: 10-counter};
				sessionHandler.push(req.body.data, 10-counter, req.body.id); //Session-Handling
				console.log(obj);
				return res.send(obj);
			}
		case 2:
			if(bike_02.length == 0){
				console.log("length 0");
				const obj = {value: "2", number: 10};
				sessionHandler.push(req.body.data, 10-counter, req.body.id); //Session-Handling
				console.log(sessionHandler);
				return res.send(obj);
			}
			else{
				while(i < bike_02.length){
					if(counter < 10){
						if(bike_02[i] === req.body.data){
							counter += 1;
							i++;
							console.log(counter);
						}
						else{i++;}
					}
					else{return res.send("0");}
				}
				const obj = {value: "2", number: 10-counter};
				sessionHandler.push(req.body.data, 10-counter, req.body.id); //Session-Handling
				console.log(obj);
				return res.send(obj);
			}
		case 3:
			if(bike_03.length == 0){
				const obj = {value: "3", number: 10};
				sessionHandler.push(req.body.data, 10-counter, req.body.id);
				return res.send(obj);
			}
			else{
				while(i < bike_03.length){
					if(counter < 10){
						if(bike_03[i] === req.body.data){
							counter += 1;
							i++;
						}
						else{i++;}
					}
					else{return res.send("0");}
				}
				const obj = {value: "3", number: 10-counter};
				sessionHandler.push(req.body.data, 10-counter, req.body.id);
				return res.send(obj);
			}
		case 4:
			if(bike_04.length == 0){
				const obj = {value: "4", number: 10};
				sessionHandler.push(req.body.data, 10-counter, req.body.id);
				return res.send(obj);
			}
			else{
				while(i < bike_04.length){
					if(counter < 10){
						if(bike_04[i] === req.body.data){
							counter += 1;
							i++;
						}
						else{i++;}
					}
					else{return res.send("0");}
				}
				const obj = {value: "4", number: 10-counter};
				sessionHandler.push(req.body.data, 10-counter, req.body.id);
				return res.send(obj);
			}
		case 5:
			if(bike_05.length == 0){
				const obj = {value: "5", number: 10};
				sessionHandler.push(req.body.data, 10-counter, req.body.id);
				return res.send(obj);
			}
			else{
				while(i < bike_05.length){
					if(counter < 10){
						if(bike_05[i] === req.body.data){
							counter += 1;
							i++;
						}
						else{i++;}
					}
					else{return res.send("0");}
				}
				const obj = {value: "5", number: 10-counter};
				sessionHandler.push(req.body.data, 10-counter, req.body.id);
				return res.send(obj);
			}
		case 6:
			if(bike_06.length == 0){
				const obj = {value: "6", number: 10};
				sessionHandler.push(req.body.data, 10-counter, req.body.id);
				return res.send(obj);
			}
			else{
				while(i < bike_06.length){
					if(counter < 10){
						if(bike_06[i] === req.body.data){
							counter += 1;
							i++;
						}
						else{i++;}
					}
					else{return res.send("0");}
				}
				const obj = {value: "6", number: 10-counter};
				sessionHandler.push(req.body.data, 10-counter, req.body.id);
				return res.send(obj);
			}
	}
	console.log("Sent");
});

//Session-Handling
app.post('/api/v1/session', (req, res) => {
	console.log(sessionHandler);
	return res.send(sessionHandler);
	//return sessionHandler.length = 0;
})

//Buchung durchführen
/*app.post('/api/v1/booking', (req, res) => {
	console.log(req.body);
	console.log(sessionHandler);
	let i = 0;
	if(req.body.number > sessionHandler[1]){
		sessionHandler.length = 0;
		return res.send("0")
	}
	else{
		if(customers.some(user => user.email === req.body.email) == true){
			//Customer ID schon vorhanden
			//bike_id, number, date bei dem Customer einfügen
			let index = customers.findIndex(user => user.email === req.body.email);
			let user = {
				bike_id: sessionHandler[2],
				date: sessionHandler[0],
				number: req.body.number
			}
			customers[index].bikes.push(user);
		}
		else{
			let userid = customers.length + 1;
			let user = {id: userid,
				name: req.body.name, 
				email: req.body.email, bikes: {
					bike_id: sessionHandler[2],
					date: sessionHandler[0],
					number: req.body.number
				},
				password: req.body.password}
			customers[userid] = user;
			console.log(customers);
		}
	}
	sessionHandler.length = 0;
	return res.send("1");
})*/

app.post('/api/v1/booking', (req, res) => {
	console.log(req.body);
	console.log(sessionHandler);
	let i = 0;
	db.each(`SELECT * FROM customers WHERE email = "${req.body.email}"`, (error, row) => {
		if (error) {
			i = 1;
			throw new Error(error.message);
		}
		console.log(row);
		i = 1;
		console.log(i);
	});
	if(req.body.number > sessionHandler[1]){
		sessionHandler.length = 0;
		return res.send("0")
	}
	else{
		if(i == 1){
			//Customer ID schon vorhanden
			//bike_id, number, date bei dem Customer einfügen
			db.run(
				`INSERT INTO customers (customer_id, name, email, password) VALUES (?, ?, ?)`, 
				[userid, req.body.name, req.body.email, req.body.password],
				function (error) {
					if (error) {
						console.error(error.message);
					}
					console.log(`Inserted a row with the ID: ${this.lastID}`);
				}
			);
			db.run(
				`INSERT INTO bookings (bookings_id, bike_id, booking_date, number, customer_id) VALUES (?, ?, ?)`, 
				[booking_id, sessionHandler[2], sessionHandler[0], req.body.number, userid],
				function (error) {
					if (error) {
						console.error(error.message);
					}
					console.log(`Inserted a row with the ID: ${this.lastID}`);
				}
			);
			userid++;
			booking_id++;
		}
		else{
			db.run(
				`INSERT INTO bookings (bookings_id, bike_id, booking_date, number, customer_id) VALUES (?, ?, ?)`, 
				[booking_id, sessionHandler[2], sessionHandler[0], req.body.number, row[0]],
				function (error) {
					if (error) {
						console.error(error.message);
					}
					console.log(`Inserted a row with the ID: ${this.lastID}`);
				}
			);
			booking_id++;
		}
	}
	sessionHandler.length = 0;
	return res.send("1");
})