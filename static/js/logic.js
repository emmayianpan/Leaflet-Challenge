//create Map
function createMap(earthquake) {
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });


    var myMap = L.map("map", {
        center: [44.59, -103.46],
        zoom: 3,
        layers: [lightmap, earthquake]
    });

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var grade = [-10, 10, 30, 50, 70, 90];
        for (var i = 0; i < grade.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(grade[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp&nbsp</i> ' +
                grade[i] + (grade[i + 1] ? '&ndash;' + grade[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
};

// set Color 
function Color(depth) {
    return depth > 90 ? '#802b00' :
        depth > 70 ? '#b33c00' :
            depth > 50 ? '#e64d00' :
                depth > 30 ? '#ff661a' :
                    depth > 10 ? '#ff9966' :
                        '#ffbb99';
};

// Read Data and create features 
// pointToLayer : https://leafletjs.com/examples/geojson/
function createFeatures() {
    var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    d3.json(url, function (data) {
        console.log(data);

        var geojson = L.geoJSON(data.features, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: (feature.properties.mag) * 3,
                    fillColor: Color(feature.geometry.coordinates[2]),
                    color: "black",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },

            onEachFeature: function (feature, layer) {
                layer.bindPopup("<strong> Magnitude: " + feature.properties.mag +
                    "<hr></hr>Depth: " + feature.geometry.coordinates[2] + "</strong>");
            }
        });
        createMap(geojson);
    });
};
createFeatures(); 