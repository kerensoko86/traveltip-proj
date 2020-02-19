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

    weatherService.connectWeather(35, 139)
        .then(weather => {
            console.log('inside lopopo: ', weather.data);
            var strHTML = `<h2>Weather Today</h2> 
            <img src="http://openweathermap.org/img/wn/${weather.data.weather[0].icon}.png"/>
            <p>${weather.data.name},${weather.data.sys.country}   <span class="weather-desc">${weather.data.weather[0].main}</span></p>
            <p>${(+weather.data.main.temp/33.8).toFixed(2)} °C</p>
            <p>temperature from ${(+weather.data.main.temp_min/33.8).toFixed(2)} to ${(+weather.data.main.temp_max/33.8).toFixed(2)} °C,
            wind ${+weather.data.wind.speed} m/s</p>`
            document.querySelector('.weather-container').innerHTML = strHTML;
        })

}

document.querySelector('.btn').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
    mapService.panTo(35.6895, 139.6917);
})