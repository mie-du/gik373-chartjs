const regionCodes = {
  '01': 'Stockholm',
  '03': 'Uppsala',
  '04': 'Södermanland',
  '05': 'Östergötland',
  '06': 'Jönköping',
  '07': 'Kronoberg',
  '08': 'Kalmar',
  '09': 'Gotland',
  10: 'Blekinge',
  12: 'Skåne',
  13: 'Halland',
  14: 'Västra Götaland',
  17: 'Värmland',
  18: 'Örebro',
  19: 'Västmanland',
  20: 'Dalarna',
  21: 'Gävleborg',
  22: 'Västernorrland',
  23: 'Jämtland',
  24: 'Västerbotten',
  25: 'Norrbotten'
};
const popUrl =
  'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy';

const popQuery = {
  query: [
    {
      code: 'Region',
      selection: {
        filter: 'vs:RegionLän07',
        values: [
          '01',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '12',
          '13',
          '14',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
          '25'
        ]
      }
    },
    {
      code: 'ContentsCode',
      selection: {
        filter: 'item',
        values: ['BE0101N1']
      }
    },
    {
      code: 'Tid',
      selection: {
        filter: 'item',
        values: ['2021']
      }
    }
  ],
  response: {
    format: 'json'
  }
};

const energyUrl =
  'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/EN/EN0105/EN0105A/OverEl';

const energyQuery = {
  query: [
    {
      code: 'Region',
      selection: {
        filter: 'item',
        values: [
          '01',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '12',
          '13',
          '14',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
          '25'
        ]
      }
    },
    {
      code: 'Forbrukarkat',
      selection: {
        filter: 'item',
        values: ['Hus']
      }
    }
  ],
  response: {
    format: 'JSON'
  }
};

async function calculateEnergyData() {
  const popData = await fetch(popUrl, {
    method: 'POST',
    body: JSON.stringify(popQuery)
  }).then((response) => response.json());

  console.log(popData);

  const energyData = await fetch(energyUrl, {
    method: 'POST',
    body: JSON.stringify(energyQuery)
  }).then((response) => response.json());

  console.log(energyData);
  //{
  // region: [array av län/regioner],
  // enedgyPerPerson: [uträknad elförbrukning per capita]
  //}

  //invånare/län: popData.data[x].values[0]
  //förbrukning energyData.data[x].values[0]

  const popValues = popData.data.map(
    (popDataItem) => popDataItem.values[0]
  );

  const energyValues = energyData.data.map(
    (energyDataItem) => energyDataItem.values[0]
  );

  console.log(popValues); //personer
  console.log(energyValues); //GWh

  const energyPerPerson = energyValues.map(
    (energyValue, i) =>
      (energyValue / popValues[i]) * 1000000
  );

  console.log(energyPerPerson);

  //{
  // regions: [array av län/regioner],
  // energyPerPerson: [uträknad elförbrukning per capita]
  //}

  const regions = energyData.data.map(
    (energyDataItem) =>
      regionCodes[energyDataItem.key[0]]
  );

  const mapData = {
    regions: regions,
    energyPerPerson: energyPerPerson
  };

  console.log(mapData);

  return mapData;
}

//https://plotly.com/javascript/tile-county-choropleth/

async function displayEnergyDataOnMap() {
  const mapData = await calculateEnergyData();
  console.log(mapData);

  var data = [
    {
      type: 'choroplethmap',
      locations: mapData.regions,
      featureidkey: 'properties.name',
      z: mapData.energyPerPerson,
      geojson:
        'https://raw.githubusercontent.com/okfse/sweden-geojson/refs/heads/master/swedish_regions.geojson'
    }
  ];

  var layout = {
    map: {
      center: { lon: 17.3, lat: 63 },
      zoom: 3.3
    },
    width: 370,
    height: 600
  };

  Plotly.newPlot(
    'energyStatistics',
    data,
    layout
  );
}

displayEnergyDataOnMap();
