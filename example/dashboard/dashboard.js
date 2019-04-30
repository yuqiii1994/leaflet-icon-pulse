(function() {
    // set up the map theme
    var map = new L.Map('map', {
            center: new L.LatLng(-33.8688, 151.0093), // Sydney
            zoom: 10
        }),
        layer = new L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            minZoom: 5,
            maxZoom: 18
        });
    map.addLayer(layer);

    // add blink marker
    var pulsingIcon = {};
    Object.keys(pmAggr).forEach(function(key) {
        var scaleVal = scaleMarker(pmAggr[key]['delayFactor']);
        if (pmAggr[key]['latitude'] == null || pmAggr[key]['longitude'] == null) return;
        pulsingIcon[key] = L.icon.pulse({iconSize:
            [scaleVal['iconSize'],scaleVal['iconSize']], 
            radius: scaleVal['radius'], 
            fillColor: (pmAggr[key]['delayFactor'] < 30) ? '#AB4201': 'red',
            color: (pmAggr[key]['delayFactor'] < 30) ? '#AB4201': 'red'});
        var marker = L.marker([
                    pmAggr[key]['latitude'], pmAggr[key]['longitude']],
                    {icon: pulsingIcon[key], title: key}).addTo(map)
                    .bindPopup(key.toString() + '\t' + pmAggr[key]['delayFactor'].toFixed(2).toString());
        marker.on('click', function(e){
            this.openPopup();
        });
    });

    // add legend
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = "<p style='color: #000000; background-color: #FFFFFF'>&nbsp;&nbsp;" +
                        "Train Delay Index is determined by delayed customer number and waiting time&nbsp;</p>"
        return div;
    };
    legend.addTo(map);

    function scaleMarker(num){
        if (num < 10) return {'iconSize': 2, 'radius': 4} ;
        else if (num < 30) return {'iconSize': 3, 'radius': 7} ;
        else if (num < 70) return {'iconSize': 5, 'radius': 10} ;
        else if (num < 300) return {'iconSize': 7, 'radius': 20} ;
        else return {'iconSize': 9, 'radius': 30} ;
    }
})();