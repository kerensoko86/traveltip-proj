console.log('Main!');

import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'

var copiedUrl;

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
            console.log('User position is:', pos.coords);
            weatherService.connectWeather(pos.coords.latitude, pos.coords.longitude)
                .then(weather => renderWeather(weather))
        })
        .catch(err => {
            console.log('err!!!', err);
        })

    function renderWeather(weather) {
        console.log('inside lopopo: ', weather.data);
        var strHTML = `<h2>Weather Today</h2> 
        <img src='http://openweathermap.org/img/wn/${weather.data.weather[0].icon}.png'/>
        <p>${weather.data.name},${weather.data.sys.country} <img src='img/flags/24/${weather.data.sys.country}.png'/>   <span class='weather-desc'>${weather.data.weather[0].main}</span></p>
        <p>${(+weather.data.main.temp / 33.8).toFixed(2)} °C</p>
        <p>temperature from ${(+weather.data.main.temp_min / 33.8).toFixed(2)} to ${(+weather.data.main.temp_max / 33.8).toFixed(2)} °C,
        wind ${+weather.data.wind.speed} m/s</p>`
        document.querySelector('.weather-container').innerHTML = strHTML;
    }
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

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//set location by clicking on the map


// MY LOCATION FEATURE
document.querySelector('.my-location').addEventListener('click', (ev) => {
    locService.getPosition().then(result => {
        const userLocation = { lat: result.coords.latitude, lng: result.coords.longitude }
        mapService.panTo(userLocation);
        mapService.addMarker(userLocation);
        mapService.geocodeLatLng(userLocation);
    })
        .catch(err => console.error('There was an error locating you: ' + err))
})

document.querySelector('.copy-location').addEventListener('click', (ev) => {
    locService.getPosition().then(result => {
        const userCoords = { lat: result.coords.latitude, lng: result.coords.longitude }
        copyTextToClipboard(userCoords);
        // copyTextToClipboard(JSON.stringify(userCoords));
        mapService.panTo(userCoords.lat, userCoords.lng);
        mapService.addMarker(userCoords);
        mapService.geocodeLatLng(userCoords);
    })
        .catch(err => console.error('There was an error locating you: ' + err))
})

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
            console.log('Async: Copying to clipboard was successful!', text);
            copiedUrl = text;
            onSendUrl(copiedUrl);
        },
        function (err) {
            console.error('Async: Could not copy text: ', err);
        }
    );
}

function onSendUrl(copiedUrl) {
    const url = document.location.href;
    console.log('url is: ', url);
    var newUrl = `${url}/?lat=${copiedUrl.lat}&long=${copiedUrl.lng}`
    console.log('newUrl is: ', newUrl);
    return newUrl;
}