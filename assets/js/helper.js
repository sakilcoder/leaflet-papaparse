function joinDataWithGeoJSON(geojsonData, googleSheetData) {
    
    const joinedFeatures = geojsonData.features.map(feature => {
      const sl = feature.properties.sl;
      const matchingRow = googleSheetData.find(row => row.sl == sl);
    //   console.log(matchingRow);
      if (matchingRow) {
        // Merge the properties of the GeoJSON feature with the Google Sheet data
        return { ...feature, properties: { ...feature.properties, ...matchingRow } };
      } else {
        return feature;
      }
    });

    // Create a new GeoJSON object with the joined data
    const joinedGeoJSON = { ...geojsonData, features: joinedFeatures };

    // Now you have the GeoJSON with the joined data, you can do whatever you want with it
    return joinedGeoJSON;
  }

  function getFillColorByStatus(status){
    if(status==='Sold'){
        return 'red';
    }else if(status === 'Available'){
        return 'green';
    }else if(status === 'Reserved'){
        return 'skyblue';
    }else {
        return 'orange';
    }
  }