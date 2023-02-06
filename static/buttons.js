//Aufruf im onload der index.html
//Verfügbarkeit prüfen mit Übergabe der Werte des jeweiligen Fahrradtyps
//(1: Damenfahrrad, 2: Herrenfahrrad, 3: Kinderfahrrad Mädchen, 4: Kinderfahrrad Junge, 5: Tandem, 6: Bierfahrrad)
function checkAvailability(bike_id, chosenDate) {
    let availability = new Array(); //Array erzeugen für SessionHandler
    console.log(chosenDate)
    if(chosenDate == undefined){ //Prüfen, ob chosenDate übergeben wurde aus booking-unavailable.html
        availability = {
            id: bike_id,
            data: document.getElementById('date_bike'+ bike_id).value
        }
    } else {
        availability = {
            id: bike_id,
            data: chosenDate
        }
    }
    axios.post('/api/v1/checkAvailability', availability)
    .then(function (res) {
        console.log(res);
        if(res.data == "0") { //Buchung an dem gewählten Datum nicht mehr verfügbar
            location.href = "booking-unavailable.html";
        }
        else { //Buchung an dem gewählten Datum möglich
            location.href = "booking.html";
            console.log("Datum bestätigt");
        }
    })
};

//Aufruf im onload der booking.html
//Anzahl der Fahrräder und Datum in der Buchungsseite ausgeben
function checkNumber() {
    axios.post('/api/v1/session', ) //SessionHandler abrufen
    .then(function (res) {
        console.log(res);
        let html_date = "<div>";
        let html_objnumber = "<div>";
        let objdate = res.data[0].toString(); 
        let objnumber = res.data[1].toString();
        html_date += "<p>";
        html_date += objdate; //Datum
        html_date += "</p>";
        html_date += "</div>";
        html_objnumber += "<p>";
        html_objnumber += "Verfügbare Fahrräder an diesem Tag: "
        html_objnumber += objnumber; //Anzahl verfügbarer Fahrräder des gewählten Typs
        html_objnumber += "</p>";
        html_objnumber += "</div>";
        document.getElementById("return_availability").innerHTML = html_date;
        document.getElementById("return_number").innerHTML = html_objnumber;
    })
};

//Buchung und Benutzer speichern auf booking.html
function saveBooking() {
    let customer = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        number: document.getElementById('number').value,
        password: document.getElementById('password').value
    }
    console.log("Customer angelegt");
    axios.post('/api/v1/booking', customer)
    .then(function (res) {
        console.log(res);
        if(res.data == "0") { //Prüfen, ob eingegebene Anzahl höher ist als verfügbare Anzahl
            alert('Anzahl nicht verfügbar.');
            location.href = "booking.html";
        }
        else {
            console.log("Buchung bestätigt");
            location.href = "booking-successful.html"
        }
    })
};

//Aufruf im onload der booking-unavailable.html
//Falls gewählter Fahrradtyp an dem Tag nicht verfügbar, verfügbare Alternativen an dem Tag anzeigen
function showAlternatives() {
    let session = new Array();
    let i = 1;
    let bike_list = "<ul class='list-group'>";
    axios.post('/api/v1/session', ) //sessionHandler abrufen
    .then(function (res) {
        session.push(res);
        console.log(session);
    }) 
    axios.post('/api/v1/alternatives', ) //Rückgabe aller Buchungen für den Tag gruppiert nach Fahrradtyp
    .then(function (res) {
        console.log(res);
        while(i < 7) { //Iteration über die 6 Fahrradtypen
            let obj = res.data.find(o => o.bike_id === i); //Prüfen, ob Fahrradtyp in Array vorhanden
            if(obj == undefined) { //Wenn Fahrradtyp nicht vorhanden = keine Buchungen, also noch 10 verfügbare Modelle des Typs
                bike_list += "<li class='list-group-item'>";
                if(i == 1){bike_list += "Damenfahrrad";
                } else if (i == 2){bike_list += "Herrenfahrrad";
                } else if (i == 3){
                    bike_list += "Kinderfahrrad (Mädchen)";
                } else if (i == 4){
                    bike_list += "Kinderfahrrad (Jungen)";
                } else if (i == 5){
                    bike_list += "Tandem";
                } else {bike_list += "Bierfahrrad"}
                bike_list += "</br>";
                bike_list += "Verfügbare Anzahl: 10";
                bike_list += "</br>";
                bike_list += "</li>";
                bike_list += "<div class='mb-3'>";
                bike_list += `<button type='button' class='btn btn-primary btn-sm' onclick='checkAvailability(${i}, "${session[0].data[0]}")'>Jetzt Buchen</button>`;
                bike_list += "</br></br>";
                i++;
            } else {
                if(obj.num == 0) { //Wenn verfügbare Anzahl 0, dann nicht anzeigen
                    i++;
                } else { //Verfügbare Anzahl und Fahrradtyp ausgeben
                    bike_list += "<li class='list-group-item'>";
                    if(i == 1){bike_list += "Damenfahrrad";}
                    else if (i == 2){bike_list += "Herrenfahrrad";
                    } else if (i == 3){
                        bike_list += "Kinderfahrrad (Mädchen)";
                    } else if (i == 4){
                        bike_list += "Kinderfahrrad (Jungen)";
                    } else if (i == 5){
                        bike_list += "Tandem";
                    } else {bike_list += "Bierfahrrad"}
                    bike_list += "</br>";
                    bike_list += "Verfügbare Anzahl: ";
                    bike_list += obj.num.toString();
                    bike_list += "</br>";
                    bike_list += "</li>";
                    bike_list += "<div class='mb-3'>";
                    bike_list += `<button type='button' class='btn btn-primary btn-sm' onclick='checkAvailability(${i}, "${session[0].data[0]}")'>Jetzt Buchen</button>`;
                    bike_list += "</br></br>";
                    i++;
                }
            }
        }
        document.getElementById("return_alternatives").innerHTML = bike_list;
    })            
};

//Login auf login.html
function login() {
    let customer = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    axios.post('/api/v1/login', customer)
    .then(function (res) {
        console.log(res);
        if(res.data == "0"){ //Falls E-Mail oder Passwort falsch
            alert('Falsche E-Mail-Adresse oder falsches Passwort');
        }
        else{
            location.href = "mybookings.html";
        }
    })            
};

//"Passwort vergessen"-Funktion auf login.html
function getPw() {
    let customer = {email: document.getElementById('email').value}
    if(customer.email == ""){ //Prüfen, ob E-Mail leer
        alert('Bitte E-Mail-Adresse angeben!');
    }
    else{
        axios.post('/api/v1/pw', customer)
        .then(function (res) {
            console.log(res);
            if(res.data == "0"){ //Falls E-Mail-Adresse nicht vorhanden in DB
                alert('Diese E-Mail-Adresse existiert nicht.');
            }
            else{ //Gefundenes Passwort zur E-Mail-Adresse ausgeben
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


//Aufruf im onload der mybookings.html
//Buchungen des angemeldeten Users ausgeben
function getBookings() {
    axios.post('/api/v1/myBookings', )
    .then(function (res) {
        console.log(Object.keys(res.data).length);
        if(res.data == 0){ //Falls customerHandler leer und somit niemand eingeloggt ist
            let error_message = "<div><p>Fehler: Bitte erneut einloggen!</p></div>";
            document.getElementById("return_bookings").innerHTML = error_message;
        }
        else{
            let bike_list = "<ul class='list-group'>";
            let current_user = "<div>";
            let i = 0;
            current_user += "<p>Angemeldet mit: ";
            current_user += res.data[0].email.toString();
            current_user += "</p></div>";
            while(i < Object.keys(res.data).length){
                bike_list += "<li class='list-group-item'>";
                if(res.data[i].bike_id.toString() == "1"){
                    bike_list += "Damenfahrrad";
                } else if (res.data[i].bike_id.toString() == "2"){
                    bike_list += "Herrenfahrrad";
                } else if (res.data[i].bike_id.toString() == "3"){
                    bike_list += "Kinderfahrrad (Mädchen)";
                } else if (res.data[i].bike_id.toString() == "4"){
                    bike_list += "Kinderfahrrad (Jungen)";
                } else if (res.data[i].bike_id.toString() == "5"){
                    bike_list += "Tandem";
                } else {bike_list += "Bierfahrrad"}
                bike_list += "</br>";
                bike_list += "Buchungsdatum: ";
                bike_list += res.data[i].booking_date.toString();
                bike_list += "</br>";
                bike_list += "Anzahl gebuchter Fahrräder: ";
                bike_list += res.data[i].number.toString();
                bike_list += "</br>";
                bike_list += "Preis: ";
                bike_list += (res.data[i].number * 10).toString(); //Preis ausgeben (je Fahrrad 10 €)
                bike_list += " €";
                bike_list += "</br>";
                bike_list += "</li>";
                bike_list += "<div class='mb-3'>";
                bike_list += "<button type='button' class='btn btn-danger btn-sm' onclick='deleteBooking(";
                bike_list += res.data[i].bookings_id; //"Stornieren"-Button anhand der Buchungs-ID
                bike_list += ")'>Stornieren</button>";
                bike_list += "</br></br>";
                i++;
            }
            bike_list += "</ul>";
            console.log(bike_list);
            document.getElementById("return_bookings").innerHTML = bike_list;
            document.getElementById("return_user").innerHTML = current_user;
        }
    })
};

//Buchungen löschen auf der mybookings.html
function deleteBooking(bookings_id) {
    let b_id = {bookings_id};
    axios.post('/api/v1/deleteBooking', b_id)
    .then(function (res) {
        console.log(res);
        location.href = "mybookings.html";
    })
}

//Logout-Funktion über Navbar oder Logout-Button
function logout(){
    axios.post('/api/v1/logout', )
    .then(function (res) {
        console.log("httasd");
        location.href = "index.html";
        alert('Erfolgreich ausgeloggt.');
    })
};

//Aufruf in onload der index.html
//Ausgabe der gespeicherten Rezensionen auf Server
function getFeedback(){
    let i =0;
    let review = "";
    axios.post('/api/v1/feedback', )
    .then(function (res) {
        console.log(res);
        while(i < 3){ //die ersten 3 ("neuesten") Rezensionen werden ausgegeben auf index.html
            review += "<blockquote class='blockquote text-center'><p class='mb-0'>";
            review += res.data[i].feedback.toString();
            review += "</br>"
            review += "</br><footer class='blockquote-footer'>schrieb <cite title='Source Title'>";
            review += res.data[i].name.toString();
            review += "</cite></footer></blockquote>";
            review += "</br>";
            i++;
        }
        document.getElementById("return_reviews").innerHTML = review;
    })
};


//Rezension einreichen über index.html
function setFeedback(){
    let feedback = {
        name: document.getElementById('name').value,
        content: document.getElementById('message').value
    }
    console.log(feedback);
    axios.post('/api/v1/feedback', feedback)
    .then(function (res) {
        console.log(res.data[0].feedback);
        alert('Rezension erfolgreich eingereicht.');
        location.href = "index.html";
    })
};


//Login-Status prüfen über "Meine Buchungen" in Navigationsleiste
function getCustomerHandler(){
    axios.post('/api/v1/getStatusOfCustomerLogin', )
    .then(function (res) {
        console.log(res);
        if(res.data == "0") { //Wenn Rückgabe "0": kein Customer angemeldet
            location.href = "login.html";
        } else { //Customer in Array: Weiterleitung auf Buchungen
            location.href = "mybookings.html";
        }
    })
};