'use strict';

const WEATHER_KEY = '97fad777ac48a0fb3701c316fb482470';

export const weatherService = {
    connectWeather
}

function connectWeather(lat, lon) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${WEATHER_KEY}`)
        .then(res => res.data)
}