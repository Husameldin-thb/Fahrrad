let uuid = require('uuid');
let uuidv4 = uuid.v4;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let db = require("./db");

let idCounter = 0;
let customers = new Array ();
//let malebike = new Array ();
//let bike_01 = new Array ();
//let bike_02 = new Array ();
//let bike_03 = new Array ();
//let bike_04 = new Array ();
//let bike_05 = new Array ();
//let bike_06 = new Array ();
let sessionHandler = new Array ();
let customerHandler = new Array ();
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

app.use(bodyParser.urlencoded({enxtended: true}));
app.use(bodyParser.json());

let server = app.listen(8080, function () {
	let port = server.address().port;

	console.log("Webserver is running on port " + port);
});

app.post('/api/v1/checkAvailability', (req, res) => {
	let number = new Array ();
	console.log(req.body);
	db.all(`SELECT 10-SUM(number) AS num FROM bookings WHERE booking_date = "${req.body.data}" AND bike_id = "${req.body.id}"`, (error, row) => {
		if (error) {
			throw new Error(error.message);
		}
		number = row;
		console.log(row);
		console.log(row[0].num);
		if(row[0].num == 0){
			sessionHandler.push(req.body.data, row[0].num, req.body.id);
			return res.send("0");
		} else if(row[0].num == null) {
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
	//return sessionHandler.length = 0;
})

app.post('/api/v1/booking', (req, res) => {
	console.log(req.body);
	console.log(sessionHandler);
	//let iiii = new Array();
	let content = "0";
	db.get(`SELECT * FROM customers WHERE email = "${req.body.email}"`, (error, row) => {
		if (error) {
			throw new Error(error.message);
		}
		return row
			? content = "1"
			: console.log("empty");
		//iiii = row;
		//console.log(row);
	});
	//console.log(iiii);
	if(req.body.number > sessionHandler[1]){
		sessionHandler.length = 0;
		return res.send("0")
	}
	else{
		//if(iiii.length < 1 || iiii == undefined) {
		if(content == "0") {	
			//Customer ID schon vorhanden
			//bike_id, number, date bei dem Customer einfügen
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
		else{
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
	sessionHandler.length = 0;
	return res.send("1");
})

//get alternative bikes from db
app.post('/api/v1/alternatives', (req, res) => {
	console.log(sessionHandler);
	db.all(`SELECT 10-SUM(number) AS num, bike_id FROM bookings WHERE booking_date = "${sessionHandler[0]}" GROUP BY bike_id`, (error, row) => {
		if (error) {
			throw new Error(error.message);
		}
		return res.send(row);
	});
	sessionHandler.length = 0;
});

app.post('/api/v1/login', (req, res) => {
	console.log(req.body);
	db.get(`SELECT * FROM customers WHERE email = "${req.body.email}" AND password = "${req.body.password}"`, (error, row) => {
		if (error) {
			throw new Error(error.message);
		}
		customerHandler.push(row);
		console.log(customerHandler);
		return row
			? res.send("1")
			: res.send("0");
	});
});

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

app.post('/api/v1/logout', (req, res) => {
	customerHandler.length = 0;
	return res.send(true);
});

app.post('/api/v1/feedback', (req, res) => {
	console.log(req.body); 
	console.log(Object.keys(req.body).length);
	if(Object.keys(req.body).length === 0){
		return res.send(savedFeedbacks);
	} else {
		let setFeedback = {
			name: req.body.name,
			feedback: req.body.content
		};
		console.log(savedFeedbacks);
		savedFeedbacks.unshift(setFeedback);
		return res.send(savedFeedbacks);
	}
});

app.post('/api/v1/getStatusOfCustomerLogin', (req, res) => {
	console.log(customerHandler.length);
	if(customerHandler.length === 0){
		return res.send("0");
	} else {return res.send("1");}
});