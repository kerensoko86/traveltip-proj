const MAP_KEY = 'AIzaSyDsUYlakovTBY9oO5413n3HYQWD4QV4H-Q';

export const mapService = {
    initMap,
    addMarker,
    panTo,
    geocodeLatLng
}

var map;


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
            console.log('Map!', map);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(loc) {
    var laLatLng = new google.maps.LatLng(loc.lat, loc.lng);
    map.panTo(laLatLng);
}

function geocodeLatLng(loc) {
    const geocoder = new google.maps.Geocoder;
    const infowindow = new google.maps.InfoWindow;
    geocoder.geocode({ 'location': loc }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                var marker = new google.maps.Marker({
                    position: loc,
                    map: map
                });
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
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