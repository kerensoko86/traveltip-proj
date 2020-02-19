'use strict';

const WEATHER_KEY = '97fad777ac48a0fb3701c316fb482470';

export const weatherService = {
    connectWeather
}

function connectWeather(lat, lon) {
    const API_KEY = WEATHER_KEY;
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`)
        .then(res => {
            console.log('reskeren', res);
            return res.data;
        })
}