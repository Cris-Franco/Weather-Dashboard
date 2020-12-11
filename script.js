// City variable declared
var city="";

// variables
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty = $("#humidity");
var currentWSpeed = $("#wind-speed");
var currentUvindex = $("#uv-index");
var sCity=[];

// Declare API key
var APIKey="e6e82133cbe9e3f1d15080618e7765d4";

// Function to display weather
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}
// Function to get weather information using api call
function currentWeather(city){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
       
        // Get the weather icons
        var weathericon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/"+ weathericon +"@2x.png";

        // Format City & Date
        var date = new Date(response.dt*1000).toLocaleDateString();
        $(currentCity).html(response.name +"("+date+")" + "<img src=" + iconurl + ">");
        
        // Display temperature
        var tempF = response.main.temp
        $(currentTemperature).html(tempF + "&#8457");
        
        // Humidity
        $(currentHumidty).html(response.main.humidity + "%");
        
        // Wind speed
        var windsmph= response.wind.speed;
        $(currentWSpeed).html(windsmph + "MPH");

        // Display UVIndex
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}

// Add searched city history
function addToList(c){
    var listEl= $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}