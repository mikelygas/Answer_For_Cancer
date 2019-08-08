function onEachFeature(feature, layer) {
    layer.setStyle({color: '#000000'});
    if (feature.properties.years) {
    var tooltipText = '<div><strong>' + feature.properties.NAME + '</strong></strong>';
    feature.properties.years.forEach(function(year) {
        tooltipText += '<div><strong>' + year[0] + ': </strong> <span>' + Math.round(year[1], 2) + '</span></div>';
    });
    layer.bindTooltip(tooltipText, {className: 'leaflet-tooltip'});

    }
}

function plotMap() {
    var newMap = L.map('map').setView([38.9188702,-90.0708398], 3);
    var shapeStyle = {
        opacity: 1,
        weight: 2,
        color: '#fff',
        fill: 'blue',
        fillColor: '#000000',
        fillRule: 'nonzero',
        fillOpacity: 0.7
    };
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: ''
    }).addTo(newMap);
    // loading GeoJSON file - Here my html and usa_adm.geojson file resides in same folder
    $.getJSON("/static/json/us-state-shapes.json",function(data){
        // L.geoJson function is used to parse geojson file and load on to map
        L.geoJson(data, {style: shapeStyle, onEachFeature: onEachFeature}).addTo(newMap);
    });
}

plotMap();
