const urlSCB =
  'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy';

const querySCB = {
  query: [
    {
      code: 'Region',
      selection: {
        filter: 'vs:RegionKommun07',
        values: [
          '2021',
          '2023',
          '2026',
          '2029',
          '2031',
          '2034',
          '2039',
          '2061',
          '2062',
          '2080',
          '2081',
          '2082',
          '2083',
          '2084',
          '2085'
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
        values: [
          '2015',
          '2016',
          '2017',
          '2018',
          '2019',
          '2020',
          '2021',
          '2022',
          '2023',
          '2024'
        ]
      }
    }
  ],
  response: {
    format: 'JSON'
  }
};

const request = new Request(urlSCB, {
  method: 'POST',
  body: JSON.stringify(querySCB)
});

fetch(request)
  .then((response) => response.json())
  .then((data) => printSCBChart(data));

function printSCBChart(dataSCB) {
  //lägga in all data i ett diagram
  console.log(dataSCB);

  //splice = dela upp arrayen i antal element (10) från index (0). Varning: delen tas bort ur originalarrayen.
  //const dataObjectVansbro = dataSCB.data.splice(0, 10);

  //snyggare sätt: använd filter för att filtrera ut alla som har värdet 2021 som första element i key.
  const dataObjectVansbro = dataSCB.data.filter(
    (object) => object.key[0] == 2021
  );
  console.log(dataObjectVansbro);

  const labels = dataObjectVansbro.map((vansbro) => vansbro.key[1]);
  console.log(labels);

  const dataVansbro = dataObjectVansbro.map((vansbro) => vansbro.values[0]);
  console.log(dataVansbro);

  //med splice() har vansbro tagits bort, näst 10 är malung/sälen
  //const dataObjectMalung = dataSCB.data.splice(0, 10);

  //snyggare sätt: använd filter för att filtrera ut alla som har värdet 2023 som första element i key.
  const dataObjectMalung = dataSCB.data.filter(
    (object) => object.key[0] == 2023
  );
  const dataMalung = dataObjectMalung.map((malung) => malung.values[0]);

  //ett dataset för Vansbro och ett annat för Malung = 2 staplar (datapunkter) per år
  const datasets = [
    {
      label: 'Befolkningsmängd per år i Vansbro',
      data: dataVansbro,
      borderWidth: 2,
      borderColor: 'hsla(250, 100%, 30%, 1)',
      hoverBorderWidth: 4
    },
    {
      label: 'Befolkningsmängd per år i Malung/Sälen',
      data: dataMalung,
      borderWidth: 2,
      borderColor: 'hsla(150, 100%, 30%, 1)',
      hoverBorderWidth: 4
    }
  ];

  //när egenskap och variabel heter likadant räcker det att skriva endast t.ex label istället för label: label.
  new Chart(document.getElementById('scb'), {
    type: 'bar',
    data: { labels, datasets }
  });
}

const urlUN =
  'https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/GetIndicatorsAllCountries';

const requestUN = new Request(urlUN, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'dataPointType=1&countryId=0&natureOfData=All'
});

fetch(requestUN)
  .then((response) => response.json())
  .then((data) => printUNChart(data));

function printUNChart(dataUN) {
  console.log(dataUN);
  const indicators = dataUN[6].indicators;
  console.log(indicators);

  const labels = indicators.map((indicator) => indicator.code);
  console.log(labels);

  const data = indicators.map((indicator) => indicator.percentage);
  console.log(data);

  const datasets = [
    {
      label: 'Uppfyllnad per indikator för mål 7 (%)',
      data
    }
  ];

  new Chart(document.getElementById('un'), {
    type: 'bar',
    data: { labels, datasets }
  });
}
