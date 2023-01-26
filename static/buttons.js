let a = "Damenfahrrad";
let b = "Herrenfahrrad";

//let current_checkout = new Array();

//Verfügbarkeit prüfen
/*function malebikeAvailable() {
    let male_availability = {
        data: document.getElementById('date_malebike').value
    }
    console.log(male_availability.data);
    console.log("Hat geklappt");
    axios.post('/api/v1/malebike', male_availability)
    .then(function (res) {
        console.log(res);
        let html = "<div>";
        if(res.data == "1") {
            html += "<p>";
            html += "Verfügbar";
            html += "</p>";
            html += "</div>";
            document.getElementById("return_availibility").innerHTML = html;
            console.log("Verfügbar");
        }
        else {
            html += "<p>";
            html += "Nicht verfügbar";
            html += "</p>";
            html += "</div>";
            document.getElementById("return_availibility").innerHTML = html;
            console.log("Nicht verfügbar");
        }
    })
    //location.href = "login.html";

};*/

//Verfügbarkeit prüfen auf index.html mit Übergabe der Werte des jeweiligen Fahrradtyps
function checkAvailability(bike_id) {
    let availability = {
        id: bike_id,
        data: document.getElementById('date_bike'+ bike_id).value
    }
    console.log(availability.data);
    //current_checkout.push(document.getElementById('date_bike').value);
    axios.post('/api/v1/checkAvailability', availability)
    .then(function (res) {
        console.log(res);
        if(res.data == "0") {
            location.href = "availability.html";
        }
        else {
            //current_checkout.push(res.data.number);
            location.href = "booking.html";
            console.log("Datum bestätigt");
        }
    })
};

//Anzahl der Fahrräder und Datum in der Buchung ausgeben
function checkNumber() {
    axios.post('/api/v1/session', )
    .then(function (res) {
        console.log(res);
        if(res.data[1] < 1){
            location.href = "booking-unavailable.html";
        }
        else{
            let html_date = "<div>";
            let html_objnumber = "<div>";
            let objdate = res.data[0].toString(); 
            let objnumber = res.data[1].toString();
            html_date += "<p>";
            html_date += objdate;
            html_date += "</p>";
            html_date += "</div>";
            html_objnumber += "<p>";
            html_objnumber += "Verfügbare Fahrräder an diesem Tag: "
            html_objnumber += objnumber;
            html_objnumber += "</p>";
            html_objnumber += "</div>";
            document.getElementById("return_availability").innerHTML = html_date;
            document.getElementById("return_number").innerHTML = html_objnumber;
        }
    })
};

//Buchung und Benutzer speichern
function saveBooking() {
    let customer = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        number: document.getElementById('number').value,
        password: document.getElementById('password').value
    }
    console.log(customer.name);
    console.log(customer);
    console.log("Customer angelegt");
    axios.post('/api/v1/booking', customer)
    .then(function (res) {
        console.log(res);
        if(res.data == "0") {
            alert('Anzahl nicht verfügbar.');
            location.href = "booking.html";
            //document.getElementById('number').value = 1;
        }
        else {
            console.log("Buchung bestätigt");
            location.href = "booking-successful.html"
        }
    })
};

//Falls Fahrrad an dem Tag nicht verfügbar, verfügbare andere Fahrräder an dem Tag anzeigen
function showAlternatives() {
    axios.post('/api/v1/alternatives', )
    .then(function (res) {
        console.log(res);
    })            
};

function login() {
    let customer = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    console.log(customer);
    axios.post('/api/v1/login', customer)
    .then(function (res) {
        console.log(res);
        if(res.data == "0"){
            alert('Falsche E-Mail-Adresse oder falsches Passwort');
        }
        else{
            location.href = "mybookings.html";
        }
    })            
};

function getPw() {
    let customer = {email: document.getElementById('email').value}
    console.log(customer);
    if(customer.email == ""){
        alert('Bitte E-Mail-Adresse angeben!');
        //location.href = "login.html";
    }
    else{
        axios.post('/api/v1/pw', customer)
        .then(function (res) {
            console.log(res);
            if(res.data == "0"){
                alert('Diese E-Mail-Adresse existiert nicht.');
            }
            else{
                let html = "<div>";
                let obj = res.data.password.toString(); 
                html += "<p>";
                html += "Das Passwort für die angegebene E-Mail-Adresse lautet:"
                html += obj;
                html += "</p>";
                html += "</div>";
                document.getElementById("return_pw").innerHTML = html;
            }
        })
    }
}

function getBookings() {
    axios.post('/api/v1/myBookings', )
    .then(function (res) {
        console.log(res);
        console.log(res.data[0]);
        if(res.data == "0"){
            let error_message = "<div><p>Fehler: Bitte erneut einloggen!</p></div>";
            document.getElementById("return_bookings").innerHTML = error_message;
        }
        else{
            let bike_name = "b";
            let bike_list = "<ol>";
            let i = 0;
            while(i < res.length){
                bike_list += "<li>";
                bike_list += res.data;
                bike_list += "</li>";
                i++;
            }
            bike_list += "</ol>"
            document.getElementById("return_bookings").innerHTML = bike_list;
        }
    })
};