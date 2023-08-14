function joinDataWithGeoJSON(geojsonData, googleSheetData) {

  const joinedFeatures = geojsonData.features.map(feature => {
    const sl = feature.properties.sl;
    const matchingRow = googleSheetData.find(row => row.sl == sl);
    //   console.log(matchingRow);
    if (matchingRow) {

      return { ...feature, properties: { ...feature.properties, ...matchingRow } };
    } else {
      return feature;
    }
  });

  const joinedGeoJSON = { ...geojsonData, features: joinedFeatures };
  return joinedGeoJSON;
}

function getFillColorByStatus(status) {
  if (status === 'Sold') {
    return 'red';
  } else if (status === 'Available') {
    return 'green';
  } else if (status === 'Reserved') {
    return 'skyblue';
  } else {
    return 'orange';
  }
}