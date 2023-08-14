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
        let html = feature.properties.sl;

        if (feature.properties.type === 'OTHER')
            html += '<br>' + feature.properties.name;

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

                var popup = L.popup();
                let str_popup = '<p style="font-weight:bold; font-size: 10px">' + feature.properties.name + '</p>';

                if (feature.properties.name == 'B11' || feature.properties.name == 'B12')
                    str_popup += `<div id="myCarousel" class="carousel slide" data-ride="carousel" style="min-width:250px">
                <!-- Indicators -->
                <ol class="carousel-indicators">
                  <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                  <li data-target="#myCarousel" data-slide-to="1"></li>
                  <li data-target="#myCarousel" data-slide-to="2"></li>
                </ol>
            
                <!-- Wrapper for slides -->
                <div class="carousel-inner">
                  <div class="item active">
                    <img src="assets/images/interior-11.jpeg" style="width:100%;">
                  </div>
            
                  <div class="item">
                    <img src="assets/images/interior-12.jpeg" style="width:100%;">
                  </div>
                
                  <div class="item">
                    <img src="assets/images/newhome-800x500.png" style="width:100%;">
                  </div>
                </div>
            
                <!-- Left and right controls -->
                <a class="left carousel-control" href="#myCarousel" data-slide="prev">
                  <span class="glyphicon glyphicon-chevron-left"></span>
                  <span class="sr-only">Previous</span>
                </a>
                <a class="right carousel-control" href="#myCarousel" data-slide="next">
                  <span class="glyphicon glyphicon-chevron-right"></span>
                  <span class="sr-only">Next</span>
                </a>
              </div>`;

                str_popup += feature.properties.status + ' (' + feature.properties.type + ')<br>';
                if (feature.properties.home != '') {
                    str_popup += 'Home: ' + feature.properties.home + '<br>';
                    str_popup += 'Beds: ' + feature.properties.beds + '<br>';
                    str_popup += 'Baths: ' + feature.properties.baths + '<br>';
                    str_popup += 'Price: ' + feature.properties.price + '<br>';
                }

                popup.setContent(str_popup);
                layer.bindPopup(popup);

            }
        }).addTo(map);
    }
});
