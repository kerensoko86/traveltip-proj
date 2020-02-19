'use strict';


export function connectWeather(lat, lon) {
    const API_KEY = '97fad777ac48a0fb3701c316fb482470';
    var weather = axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`)
        .then(res => {
            console.log(res, 'res');
            res = res.data;
            return res.data;
        })
    return weather;
}