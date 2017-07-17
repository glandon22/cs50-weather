$(document).ready(function() {

    //set up variables to keep track of temp conversions
    var clickCount = 0;
    var conversionCount = 0;
    var fahrTemp;
    var fahrFeels;
    var celsTemp;
    var celsFeels;

    //show weather using geolocation
    $(".blue").click(getLocation);
    //show weather w zipcode search
    $(".green").click(buildUrl);
    //switch between fahrenheit to celcius or vice versa
    $("#convert").click(convert);
    //reload page to find new weather
    $("#more-weather").click(reload);

    function getLocation() {
        //if user has preiously denied location service access but continues clicking locate, refresh page and try again.
        if (clickCount != 0) {
            window.location.reload()
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var url = "https://api.apixu.com/v1/current.json?key=66a8186574ae42c096f172033172606&q=" + lat + "," + lon;
                weatherData(url);
            });
        } else {
            alert("You have denied access to our geolocation services. We will only use your location to find your current weather. If you would like to find your weather, please refresh the page.")
        }

        clickCount++;
    };
    //build URL for API call with user input(zip code)
    function buildUrl() {

        //make sure input is an integer
        var sanityCheck = parseInt($("#location-search").val()) || 2;

        if (sanityCheck === 2) {
            alert("Please enter a valid American five-digit zip code.");
            return;
        }

        var url = "https://api.apixu.com/v1/current.json?key=66a8186574ae42c096f172033172606&q=" + $("#location-search").val();
        weatherData(url);
    }

    function weatherData(url) {

        $.ajax({
            url: url,
            dataType: 'json',
            success: function(data) {

                //store some JSON data for later use
                var time = '';
                var imgNumber = data["current"]["condition"]["code"] - 887;
                fahrTemp = data["current"]["temp_f"] + "&deg;F";
                fahrFeels = data["current"]["feelslike_f"] + "&deg;F";
                celsTemp = data["current"]["temp_c"] + "&deg;C";
                celsFeels = data["current"]["feelslike_c"] + "&deg;C";

                //determine what time of day it is for image selection
                if (data["current"]["is_day"] == 1) {
                    time = "day";
                }

                else {
                    time = "night";
                }

                //populate weather info on page
                document.getElementById("weather-words").innerHTML = data["current"]["condition"]["text"];
                document.getElementById("temp").innerHTML = fahrTemp;
                document.getElementById("actual").innerHTML = "Actual temp:";
                document.getElementById("weather-icon").innerHTML = "<img src='weather/64x64/" + time + "/" + imgNumber + ".png'/> ";
                document.getElementById("feels").innerHTML = "Feels like:";
                document.getElementById("feels-like").innerHTML = fahrFeels;

                //make sure relevant data is received, otherwise change output
                if (data["location"]["region"] == "") {
                    document.getElementById("location").innerHTML = data["location"]["name"] + ", " + data["location"]["country"];
                }

                else {
                    document.getElementById("location").innerHTML = data["location"]["region"] + ", " + data["location"]["country"];
                }

                var backgroundCheck = data["current"]["condition"]["code"];

                //check what weather conditions are to load background image. this part make program very slow
                switch(backgroundCheck) {
                    case 1000:
                        document.body.style.backgroundImage = "url('sunny.jpg')";
                        break;

                    case 1003:
                    case 1006:
                    case 1009:
                        document.body.style.backgroundImage = "url('cloudy.jpg')";
                        break;

                    case 1030:
                    case 1135:
                    case 1147:
                        document.body.style.backgroundImage = "url('mist.jpg')";
                        break;

                    case 1063:
                    case 1087:
                    case 1150:
                    case 1153:
                    case 1180:
                    case 1183:
                    case 1186:
                    case 1189:
                    case 1192:
                    case 1195:
                    case 1240:
                    case 1243:
                    case 1246:
                    case 1273:
                    case 1276:
                        document.body.style.backgroundImage = "url('rainy.jpeg')";
                        break;

                    case 1066:
                    case 1114:
                    case 1117:
                    case 1210:
                    case 1213:
                    case 1216:
                    case 1219:
                    case 1222:
                    case 1225:
                    case 1255:
                    case 1258:
                    case 1279:
                    case 1282:
                        document.body.style.backgroundImage = "url('snow.jpeg')";
                        break;

                    case 1069:
                    case 1072:
                    case 1168:
                    case 1171:
                    case 1198:
                    case 1201:
                    case 1204:
                    case 1207:
                    case 1237:
                    case 1249:
                    case 1252:
                    case 1261:
                    case 1264:
                        document.body.style.backgroundImage = "url('sleet.jpeg')";
                        break;
                }

                $("#search-holder").remove();
                document.getElementById("weather-info").style.visibility="visible";
                },
            error: function(data) {
                alert("We couldn't find this zip code. Please try again.");
            }

        });
    };

    function convert () {
        //change data on page from fahr to celsius upon user request
        if (conversionCount % 2 == 0) {
            document.getElementById("temp").innerHTML = celsTemp;
            document.getElementById("feels-like").innerHTML = celsFeels;
            $("#convert").html('Convert to F');
            conversionCount++;
        }

        else {
            document.getElementById("temp").innerHTML = fahrTemp;
            document.getElementById("feels-like").innerHTML = fahrFeels;
            $("#convert").html('Convert to C');
            conversionCount++;
        }
    };

    //reload page if user wants to see more weather
    function reload() {
        window.location.reload();
    }




});