
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'

locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    mapService.initMap()
        .then(() => {
            const urlLocation = getLocationFromURL();
            if (urlLocation) {
                mapService.addMarker({ lat: urlLocation.lat, lng: urlLocation.lng });
                mapService.panTo(urlLocation)
            } else
                mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    locService.getPosition()
        .then(pos => {
            weatherService.connectWeather(pos.coords.latitude, pos.coords.longitude)
                .then(weather => renderWeather(weather))
        })
        .catch(err => {
            console.log('err!!!', err);
        })

    var input = document.querySelector('.my-btn');
    input.addEventListener('click', getCoords);

}

function renderWeather(weather) {
    var strHTML = `<h2>Weather Today</h2> 
    <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}.png"/>
    <p>${weather.name},${weather.sys.country} <img src="img/flags/24/${weather.sys.country}.png"/><span class="weather-desc">${weather.weather[0].main}</span></p>
                <p>${((+weather.main.temp)).toFixed(2)} °C</p>
                <p>temperature from ${(+weather.main.temp_min).toFixed(2)} to ${(+weather.main.temp_max).toFixed(2)} °C,
                wind ${+weather.wind.speed} m/s</p>`
    document.querySelector('.weather-container').innerHTML = strHTML;

}

function getCoords() {
    var elValue = document.querySelector('.location-input').value;
    mapService.getLocationFromAPI(elValue)
        .then(res => {
            var loc = res.data.results[0].geometry.location;
            mapService.panTo(loc);
            mapService.addMarker(loc);
            weatherService.connectWeather(loc.lat, loc.lng)
                .then(weather => renderWeather(weather))
        })
}


function getLocationFromURL() {
    const params = ['lat', 'lng'];
    const url = window.location.href;
    const urlLocation = {};
    params.forEach(param => {
        param = param.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + param + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        urlLocation[param] = parseInt(decodeURIComponent(results[2].replace(/\+/g, ' ')))
    })
    if (urlLocation.lng && urlLocation.lat) { //both values were set
        return urlLocation

    }
}

//set location by clicking on the map

// MY LOCATION FEATURE
document.querySelector('.my-location').addEventListener('click', (ev) => {
    locService.getPosition().then(result => {
<<<<<<< HEAD
            const userLocation = { lat: result.coords.latitude, lng: result.coords.longitude }
            mapService.panTo(userLocation);
            mapService.addMarker(userLocation);
            mapService.geocodeLatLng(userLocation);
        })
=======
        const userLocation = { lat: result.coords.latitude, lng: result.coords.longitude }
        mapService.panTo(userLocation);
        mapService.addMarker(userLocation);
        mapService.geocodeLatLng(userLocation);
    })
>>>>>>> 7e0647509f0c44d73d896bfe4b14b3e1a3e37b1d
        .catch(err => console.error('There was an error locating you: ' + err))
})

document.querySelector('.copy-location').addEventListener('click', (ev) => {
<<<<<<< HEAD
    locService.getPosition().then(result => {
            const userCoords = { lat: result.coords.latitude, lng: result.coords.longitude }
            const url = document.location.href;
            // console.log('url is: ', url);
            var newUrl = `${url}?lat=${userCoords.lat}&lng=${userCoords.lng}`
                // console.log('newUrl is: ', newUrl);
            copyTextToClipboard(newUrl);
            mapService.panTo(userCoords.lat, userCoords.lng);
            mapService.addMarker(userCoords);
            mapService.geocodeLatLng(userCoords);
        })
        .catch(err => console.error('There was an error locating you: ' + err))
})
=======
    const markerLocation = mapService.getMarkerLocation();
    const url = document.location.href;
    // console.log('url is: ', url);
    var newUrl = `${url}?lat=${markerLocation.lat}&lng=${markerLocation.lng}`
    // console.log('newUrl is: ', newUrl);
    copyTextToClipboard(newUrl);
    mapService.panTo(markerLocation.lat, markerLocation.lng);
    mapService.addMarker(markerLocation);
    mapService.geocodeLatLng(markerLocation);
});
>>>>>>> 7e0647509f0c44d73d896bfe4b14b3e1a3e37b1d


//copy location

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);


    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(
        function () {
            // console.log('Async: Copying to clipboard was successful!', text);
            return text;
        },
        function (err) {
            console.error('Async: Could not copy text: ', err);
        }
    );
}