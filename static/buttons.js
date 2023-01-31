

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
function checkAvailability(bike_id, chosenDate) {
    let availability = new Array();
    console.log(chosenDate)
    if(chosenDate == undefined){
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
    console.log(availability.data);
    //current_checkout.push(document.getElementById('date_bike').value);
    axios.post('/api/v1/checkAvailability', availability)
    .then(function (res) {
        console.log(res);
        if(res.data == "0") {
            location.href = "booking-unavailable.html";
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
        //if(res.data[1] < 1){
            //location.href = "booking-unavailable.html";
        //}
        //else{
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
        //}
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
    let session = new Array();
    let i = 1;
    let bike_list = "<ul class='list-group'>";
    axios.post('/api/v1/session', )
    .then(function (res) {
        console.log(res);
        session.push(res);
        console.log(session);
    }) 
    axios.post('/api/v1/alternatives', )
    .then(function (res) {
        console.log(res);
        console.log(session[0].data[0]);
        //let obj = res.data.find(o => o.bike_id === 1)
        //console.log(obj);
        while(i < 7) {
            let obj = res.data.find(o => o.bike_id === i);
            if(obj == undefined) {
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
                if(obj.num == 0) {
                    i++;
                } else {
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
        console.log(bike_list);
        document.getElementById("return_alternatives").innerHTML = bike_list;
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
        console.log(Object.keys(res.data).length);
        console.log(res.data[0].number);
        if(res.data == 0){
            let error_message = "<div><p>Fehler: Bitte erneut einloggen!</p></div>";
            document.getElementById("return_bookings").innerHTML = error_message;
        }
        else{
            //let bike_name = "b";
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
                bike_list += "</li>";
                bike_list += "<div class='mb-3'>";
                bike_list += "<button type='button' class='btn btn-danger btn-sm' onclick='deleteBooking(";
                bike_list += res.data[i].bookings_id;
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
function deleteBooking(bookings_id) {
    let b_id = {bookings_id};
    console.log(b_id);
    axios.post('/api/v1/deleteBooking', b_id)
    .then(function (res) {
        console.log(res);
        location.href = "mybookings.html";
    })
}

function logout(){
    axios.post('/api/v1/logout', )
    .then(function (res) {
        console.log("httasd");
        location.href = "index.html";
        alert('Erfolgreich ausgeloggt.');
    })
};

function getFeedback(){
    let i =1;
    let review = "";
    axios.post('/api/v1/feedback', )
    .then(function (res) {
        console.log(res);
        console.log(res.data[1].feedback);
        while(i < 4){
            review += "<blockquote class='blockquote text-center'><p class='mb-0'>";
            review += res.data[i].feedback.toString();
            review += "</br>"
            review += "</br><footer class='blockquote-footer'>schrieb <cite title='Source Title'>";
            review += res.data[i].name.toString();
            review += "</cite></footer></blockquote>";
            i++;
        }
        document.getElementById("return_reviews").innerHTML = review;
    })
};

function setFeedback(){
    let feedback = {
        name: document.getElementById('name').value,
        content: document.getElementById('message').value
    }
    console.log(feedback);
    axios.post('/api/v1/feedback', feedback)
    .then(function (res) {
        console.log(res);
        console.log(res.data[0].feedback);
        alert('Rezension erfolgreich eingereicht.');
        location.href = "index.html";
    })
}