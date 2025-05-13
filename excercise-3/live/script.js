const urlSCB =
  'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy';

const querySCB = {
  query: [
    {
      code: 'Region',
      selection: {
        filter: 'vs:RegionKommun07',
        values: ['2081']
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
          '2014',
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
    format: 'json'
  }
};

const request = new Request(urlSCB, {
  method: 'POST',
  body: JSON.stringify(querySCB)
});

fetch(request)
  .then((response) => response.json())
  .then(printSCBChart);

function printSCBChart(dataSCB) {
  console.log(dataSCB);
  const years = dataSCB.data;
  console.log(years);

  const labels = years.map((year) => year.key[1]);
  console.log(labels);

  const data = years.map(
    (year) => year.values[0]
  );

  console.log(data);

  const datasets = [
    {
      label: 'Befolkningsutveckling Borlänge',
      data: data
    }
  ];

  const myChart = new Chart(
    document.getElementById('scb'),
    {
      type: 'line',
      data: { labels: labels, datasets: datasets }
    }
  );
}

const urlUN =
  'https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/GetIndicatorsAllCountries';

const country = 752;

const requestUN = new Request(urlUN, {
  method: 'POST',
  body: `dataPointType=1&countryId=${country}&natureOfData=all`,
  headers: {
    'Content-Type':
      'application/x-www-form-urlencoded'
  }
});

fetch(requestUN)
  .then((response) => response.json())
  .then(printUNChart);

function printUNChart(unData) {
  console.log(unData);
  const indicators = unData[6].indicators;
  console.log(indicators);

  const labels = indicators.map(
    (indicator) => indicator.code
  );

  console.log(labels);

  const data = indicators.map(
    (indicator) => indicator.percentage
  );
  console.log(data);

  const datasets = [
    {
      label:
        'Uppfyllnad per indikator (%) för mål 7',
      data: data
    }
  ];
  const myChart = new Chart(
    document.getElementById('un'),
    {
      type: 'bar',
      data: { labels: labels, datasets: datasets }
    }
  );
}
