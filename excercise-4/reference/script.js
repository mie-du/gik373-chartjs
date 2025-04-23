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
    format: 'JSON'
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

  const energyData = await fetch(energyUrl, {
    method: 'POST',
    body: JSON.stringify(energyQuery)
  }).then((response) => response.json());

  const popValues = popData.data.map((popDataItem) => popDataItem.values);
  console.log(popValues);
  const energyValues = energyData.data.map(
    (energyDataItem) => energyDataItem.values
  );
  console.log(energyValues);

  const energyPerPerson = energyValues.map(
    (energyValue, i) => (energyValue / popValues[i]) * 1000000
  );
  console.log(energyPerPerson);

  const regions = energyData.data.map(
    (energyDataItem) => regionCodes[energyDataItem.key[0]]
  );
  const mapData = { regions, energyPerPerson };
  console.log(mapData);
  return mapData;
}

async function displayEnergyDataOnMap() {
  const mapData = await calculateEnergyData();

  const data = [
    {
      type: 'choroplethmap',
      locations: mapData.regions,
      z: mapData.energyPerPerson,
      featureidkey: 'properties.name',
      separators: ', ',
      colorbar: { title: { text: 'KWh/person', side: 'right' } },
      geojson:
        'https://raw.githubusercontent.com/okfse/sweden-geojson/refs/heads/master/swedish_regions.geojson '
    }
  ];

  const layout = {
    map: { center: { lon: 17.3, lat: 63 }, zoom: 3.3 },
    width: 370,
    height: 600
  };

  Plotly.newPlot('energyStatistics', data, layout);
}

async function displayEuroDataOnMap() {
  const data = [
    {
      type: 'choroplethmap',

      locations: ['Sweden', 'Romania', 'Finland', 'Belarus', 'Ukraine'],
      z: [10020, 1000, 2231.322, 3423.123, 5441, 1223.1],
      featureidkey: 'properties.name',
      //för stora tal är standard den amerikanska separeringen av 1000 (komma för 1000-tal, punkt för decimaler. Det kan hända att vi vill ha den svenska)
      separators: ', ',
      geojson: '../geojson/world.geojson',
      //information om skalan
      colorbar: {
        title: { text: 'Enhet på skalan', side: 'top' }
      }
    }
  ];

  const layout = {
    map: {
      center: { lon: 23.1, lat: 55.51 },
      zoom: 2.8,
      style: 'dark'
    },
    height: 900,
    separators: ', ',
    //utseende på skala
    colorscale: {
      sequential: [
        [0, 'hsl(118, 65.40%, 84.10%)]'],
        [0.35, 'hsl(127, 85.70%, 43.90%)]'],
        [0.5, 'hsl(75, 65.20%, 43.90%)]'],
        [0.6, 'hsl(59, 65.00%, 64.10%)'],
        [0.7, 'hsl(35, 95.20%, 49.40%)]'],
        [1, 'hsl(18, 87.30%, 50.60%)]']
      ]
    }
  };

  Plotly.newPlot('europeStatistics', data, layout);
}
displayEuroDataOnMap();
displayEnergyDataOnMap();
