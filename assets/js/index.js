const map = L.map('map').setView([32.26467483981997, -111.00205274628576], 19);
map.options.minZoom = 16;
var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

var parcelStyle = {
    fillColor: '#fae094',
    fillOpacity: 1,
    color: '#c8ba92',
    weight: 1,
    opacity: 1,
};

L.geoJSON(parcels, {
    style: parcelStyle,
    onEachFeature: function (feature, layer) {
        let html=feature.properties.sl;

        if(feature.properties.type==='OTHER')
            html+='<br>'+ feature.properties.name;

        layer.bindTooltip(html + '', {
            permanent: true,
            direction: "center",
            opacity: 1,
            className: 'label-tooltip'
        });
    }
}).addTo(map);

// let sheet = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRObOsQiH_HX2ztDCROGeJENzJUaTgzrqd0y-_vl4lROv0ZUXHdTVFIQ6ibpSm3wSGDh8JSWaMtVDIM/pub?output=csv';
let sheet = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4OzonVDVf-gKufo3tWF1WOKYvxvuQyWgEIJV8iZDPNdPrUvCZ-oDEYltb8P9NudPVt3sxKS28DhxL/pub?output=csv';

Papa.parse(sheet, {
    download: true,
    header: true,
    complete: function (results) {
        let data = results.data;

        let points = joinDataWithGeoJSON(parcelStatus, data);
        // console.log(points);

        L.geoJSON(points, {
            pointToLayer: function (feature, latlng) {
                if (feature.properties.status != '') {
                    return L.circleMarker(latlng, {
                        radius: 10,
                        fillColor: getFillColorByStatus(feature.properties.status),
                        fillOpacity: 1,
                        color: 'black',
                        weight: 1,
                        opacity: 1,
                    });
                }

            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.name, {
                    permanent: true,
                    direction: "center",
                    opacity: 1,
                    className: 'label-tooltip'
                });
            }
        }).addTo(map);
    }
});
