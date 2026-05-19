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
    format: 'JSON'
  }
};

const energyUrl =
  'https://statistikdatabasen.scb.se/api/v2/tables/TAB1332/data?lang=sv&valueCodes[ContentsCode]=000000L1&valueCodes[Region]=01,03,04,05,06,07,08,09,10,12,13,14,17,18,19,20,21,22,23,24,25&valueCodes[Forbrukarkat]=Hus&valueCodes[Tid]=2021';

const regionCodeMap = {
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

async function calculateEnergyData() {
  const popData = await fetch(popUrl, {
    method: 'POST',
    body: JSON.stringify(popQuery)
  }).then((response) => response.json());

  console.log(popData);

  const energyData = await fetch(energyUrl).then((response) => response.json());
  console.log(energyData);

  const popValues = popData.data.map((popDataItem) => popDataItem.values[0]);
  console.log(popValues);

  const energyValues = energyData.value;

  console.log(energyValues);

  const kWhPerPerson = energyValues.map((energyValue, i) => {
    return Number((energyValue / popValues[i]) * 1000000).toFixed(2);
  });

  console.log(kWhPerPerson);

  const regions = popData.data.map(
    (popDataItem) => regionCodeMap[popDataItem.key[0]]
  );

  console.log(regions);

  return {
    regions,
    kWhPerPerson
  };
}

async function displayEnergyDataOnMap() {
  const mapData = await calculateEnergyData();

  console.log(mapData);

  const data = [
    {
      type: 'choroplethmap',
      locations: mapData.regions,
      z: mapData.kWhPerPerson,
      geojson:
        'https://raw.githubusercontent.com/okfse/sweden-geojson/refs/heads/master/swedish_regions.geojson',
      featureidkey: 'properties.name'
    }
  ];

  const layout = {
    map: {
      center: { lon: 17.3, lat: 63 },
      zoom: 3.7
    },
    width: 600,
    height: 1200
  };

  Plotly.newPlot('energyStatistics', data, layout);
}

var data = [
  {
    type: 'choroplethmap',
    locations: ['NY', 'MA', 'VT'],
    z: [-50, -10, -20],
    geojson:
      'https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json'
  }
];

var layout = {
  map: { center: { lon: -74, lat: 43 }, zoom: 3.5 },
  width: 600,
  height: 400
};

Plotly.newPlot('myDiv', data, layout);
displayEnergyDataOnMap();
