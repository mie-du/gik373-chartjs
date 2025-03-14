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
          '2011',
          '2012',
          '2013',
          '2014',
          '2015',
          '2016',
          '2017',
          '2018',
          '2019',
          '2020',
          '2021',
          '2022',
          '2023'
        ]
      }
    }
  ],
  response: {
    format: 'JSON'
  }
};

function printSCBChart(dataSCB) {
  const years = dataSCB.data;
  console.log(years);
  const labels = years.map((year) => year.key[1]);
  console.log(labels);
  const data = years.map((year) => year.values[0]);
  console.log(data);

  const datasets = [
    {
      label: 'Befolkningsutveckling Borlänge',
      data,
      fill: false,
      borderWidth: 2,
      borderColor: 'hsla(250, 100%, 30%, 1)',
      hoverBorderWidth: 4
    }
  ];

  new Chart(document.getElementById('scb'), {
    type: 'line',
    data: { labels, datasets }
  });
}

const request = new Request(urlSCB, {
  method: 'POST',
  body: JSON.stringify(querySCB)
});

fetch(request)
  .then((response) => response.json())
  .then(printSCBChart);

const urlUN =
  'https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/GetIndicatorsAllCountries';

const requestUN = new Request(urlUN, {
  method: 'POST',
  body: 'dataPointType=1&countryId=0&natureOfData=all',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

fetch(requestUN)
  .then((response) => response.json())
  .then(printUNChart);

function printUNChart(dataUN) {
  const indicators = dataUN[6].indicators;
  console.log(indicators);
  const labels = indicators.map((indicator) => indicator.code);
  console.log(labels);
  const data = indicators.map((indicator) => indicator.percentage);
  console.log(data);

  const datasets = [
    {
      label: 'Uppfyllnad per indikator (%)',
      data,
      borderWidth: 2,
      backgroundColor: 'hsla(70, 100%, 30%, 0.4)',
      borderColor: 'hsla(70, 100%, 30%, 1)',
      hoverBorderWidth: 4,
      tension: 0.5
    }
  ];

  new Chart(document.getElementById('un'), {
    type: 'bar',
    data: { labels, datasets },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Världens uppfyllnad av mål 7 - Hållbar energi för alla',
          font: {
            size: 24
          }
        }
      }
    }
  });
}
