var map = L.map('map').setView([20, 0], 2);  // Centered to show global earthquakes

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var geojsonUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Function to determine the color based on depth
function getColor(depth) {
    return depth > 90 ? '#800026' :
           depth > 70 ? '#BD0026' :
           depth > 50 ? '#E31A1C' :
           depth > 30 ? '#FC4E2A' :
           depth > 10 ? '#FD8D3C' :
                        '#FEB24C';
}

// Function to determine the radius of the circle marker based on magnitude
function getRadius(magnitude) {
    return magnitude ? magnitude * 4 : 1;  // Magnitude 1 will be size 4, higher magnitudes will be larger
}

axios.get(geojsonUrl)
    .then(function(response) {
        var geojsonLayer = L.geoJSON(response.data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]), // Depth is the third coordinate
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<strong>Magnitude: ' + feature.properties.mag + '</strong><br/>' + 
                                'Depth: ' + feature.geometry.coordinates[2] + ' km<br/>' + 
                                feature.properties.place);
            }
        }).addTo(map);
    })
    .catch(function(error) {
        console.error('Error fetching the GeoJSON data:', error);
    });
