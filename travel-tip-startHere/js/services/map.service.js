const MAP_KEY = 'AIzaSyDsUYlakovTBY9oO5413n3HYQWD4QV4H-Q';

export const mapService = {
    initMap,
    addMarker,
    panTo,
    geocodeLatLng,
    getLocationFromAPI
}

var map;
var mainMarker;
var infowindow;


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            map = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            map.addListener('dblclick', event => {
                // console.log(event.latLng);
                moveMarker(event.latLng)
            })
            console.log('Map!', map);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: 'Hello World!'
    });
    if (!mainMarker) { mainMarker = marker }
    return marker;
}

function moveMarker(loc) {
    mainMarker.setPosition(loc);
    geocodeLatLng(loc);
}

function panTo(loc) {
    var laLatLng = new google.maps.LatLng(loc.lat, loc.lng);
    map.panTo(laLatLng);
}

function geocodeLatLng(loc) {
    const geocoder = new google.maps.Geocoder;
    if (!infowindow) infowindow = new google.maps.InfoWindow;
    geocoder.geocode({ 'location': loc }, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, mainMarker);
            } else {
                infowindow.setContent('Opps, it seems like there is nothing there!');
            }
        } else {
            infowindow.setContent('Opps, it seems like there is nothing there!');
        }
    });
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = MAP_KEY; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getLocationFromAPI(elValue) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${elValue}&key=${MAP_KEY}`)
        .then(res => res)
}