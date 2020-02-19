'use strict';

import { WEATHER_KEY } from './.gitignore.secret.js'

export function connectWeather(lat, lon) {
    const API_KEY = WEATHER_KEY;
    var weather = axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`)
        .then(res => {
            console.log(res, 'res');
            res = res.data;
            return res.data;
        })
    return weather;
}