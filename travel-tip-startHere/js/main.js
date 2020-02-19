console.log('Main!');

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

            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
    weatherService.connectWeather(35, 139)
        .then(res => {
            document.querySelector('.weather-container').innerHTML = res;
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
        mapService.panTo(userCoords.lat, userCoords.lng);
        mapService.addMarker(userCoords);
        mapService.geocodeLatLng(userCoords);
    })
        .catch(err => console.error('There was an error locating you: ' + err))
})
