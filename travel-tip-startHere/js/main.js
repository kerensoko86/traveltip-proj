console.log('Main!');

import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'


locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    mapService.initMap()
        .then(() => {
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
}

document.querySelector('.my-location').addEventListener('click', (ev) => {
    locService.getPosition().then(result => {
        const userCoords = { lat: result.coords.latitude, lng: result.coords.longitude }
        mapService.panTo(userCoords.lat, userCoords.lng);
        mapService.addMarker(userCoords);
    })
        .catch(err => console.error('There was an error locating you: ' + err))
})