


window.onload = loadFlightData;

//AJAX request to load flight data

let filteredPlanesPos = [];

function loadFlightData(){
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json", true);

    xhttp.onload = function() {
        if(this.status == 200) {
            let data = JSON.parse(this.responseText);
            
            let planesPos = [];
            let output = "";

            for(let i = 0; i < data.acList.length; i++) {
                    if("Lat" in data.acList[i]) {
                        planesPos.push(data.acList[i]);
                    }
            }
            

            filteredPlanesPos = planesPos.filter(function(e){
               
                if((parseInt(e.Lat) == latLongArray[0]) && (parseInt(e.Long) == latLongArray[1])) {
                    return true;
                } else {
                    return false;
                } 
            });

            //console.log(filteredPlanesPos);

            filteredPlanesPos.sort((a, b) => b.Alt - a.Alt);

            for(let j = 0; j < filteredPlanesPos.length; j++) {
                
                let li = document.createElement('LI');
                     output += '<li title="Click for more info">' +
                              '<img class="plane-logo" scr="" />' +
                              '<p id="alt">Altitude: ' + '<span>' + filteredPlanesPos[j].Alt + ' ft</span>' +
                              '</p>' + '<p class="flight-code">Flight code No: ' + '<span>' + filteredPlanesPos[j].Id + '</span></p></li>';
                }

            if(filteredPlanesPos.length == 0) {
                document.getElementById("message").innerText = "There are no airplanes over your current location at the moment, please try again in a couple of minutes!"
            } else {
                document.getElementById("flight-list").insertAdjacentHTML("afterbegin", output);
            }
            
            let p = document.querySelector("#flight-list p");

            if(document.getElementById("flight-list").contains(p)){
                
                let flightCodeElem = document.querySelectorAll(".flight-code span");
                let planeLogoElem = document.querySelectorAll(".plane-logo");

                for(let z = 0; z < flightCodeElem.length; z++) {

                    if(flightCodeElem[z].innerText.slice(-1) % 2 != 0) {
                        planeLogoElem[z].setAttribute("src", "https://cdn3.iconfinder.com/data/icons/airport-travel-set/15/plane-left-512.png");
                    } else {
                        planeLogoElem[z].setAttribute("src", "https://cdn3.iconfinder.com/data/icons/airport-travel-set/15/plane-right-512.png");
            }
          }
        }
      }
    }
        xhttp.send();
};


let latLongArray = [];

//Geolocation set up

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
};

function showPosition(position) {
     latLongArray.push(parseInt(position.coords.latitude));
     latLongArray.push(parseInt(position.coords.longitude));
        
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("geo-error").innerText = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("geo-error").innerText = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            document.getElementById("geo-error").innerText = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("geo-error").innerText = "An unknown error occurred."
            break;
    }
}
getUserLocation();

document.getElementById("flight-list").addEventListener("click", function(e) {
    
    let li = e.target.closest('li');
    let singleOutput = "";
    let main = document.getElementById("main");

    if(!li) return;
    //console.log(li.children[2].firstElementChild.innerText);
    //console.log(e);

    let result = filteredPlanesPos.find(function(item) {
        if(item.Id == li.children[2].firstElementChild.innerText){
            return item;
        }        
    });
    //console.log(result);

    singleOutput += '<div id="flight-details"><p>Airplane manufacturer: ' + '<span>' + result.Man + '</span>' + '</p><p>Airplane model: ' + '<span>' + result.Mdl + '</span>' + '</p><p>Destination: ' + '<span>' + result.To + '</span>' + '</p><p>Flight origin: ' + '<span>' + result.From + '</span>' + '</p><a href="index.html"><b>Back to Air Traffic Info</b></a></div>';

    main.removeChild(main.firstElementChild);

    main.insertAdjacentHTML("afterbegin", singleOutput);

    console.log(singleOutput);
});