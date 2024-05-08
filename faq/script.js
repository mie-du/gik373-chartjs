const urlSCB =
  'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy';

const querySCB = {
  query: [
    {
      code: 'Region',
      selection: {
        filter: 'vs:RegionKommun07',
        //kommuner (2st)
        values: ['2081', '2080']
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
        //år (13st)
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
  //kontrollera datasetet
  console.log(dataSCB);

  //hämta alla labels - enligt scb:s format (som inte ännu passar oss)
  const labelsRaw = dataSCB.data.map((data) => data.key[1]);
  console.log(labelsRaw);
  //hämta alla värden - enligt scb:s format (som inte ännu passar oss)
  const valuesRaw = dataSCB.data.map((data) => data.values[0]);
  console.log(valuesRaw);
  //göra alla labels unika
  const labels = [...new Set(labelsRaw)];
  console.log(labels);
  //dela värdena så att hälften hör till Borlänge och resten till Falun.
  const dataBorl = valuesRaw.splice(0, labels.length);
  const dataFalun = valuesRaw;

  console.log('Borlänge: ', dataBorl, 'Falun', dataFalun);

  //1 dataset per linje eller stapel per datapunkt vid x axeln.
  const datasets = [
    {
      label: 'Befolkningsutveckling Borlänge',
      data: dataBorl,
      fill: false,
      borderWidth: 2,
      hoverBorderWidth: 4,
      tension: 0.5
    },
    {
      label: 'Befolkningsutveckling Falun',
      data: dataFalun,
      fill: false,
      borderWidth: 2,
      hoverBorderWidth: 4,
      tension: 0.5
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

//exempel nästlade then - så ska vi inte göra
fetch(
  'https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/GetCompareacrossgoalData',
  {
    method: 'POST',
    body: `dataPointType=1&goals=1&natureOfData=All`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
)
  .then((response) => response.json())
  .then((firstAPIData) => {
    fetch(
      'https://unstats.un.org/SDGAPI/v1/sdg/Goal/List?includechildren=false'
    )
      .then((response) => response.json())
      .then((secondAPIData) => {
        //gör något med firstData och secondData i ett diagram.
      });
  });

//async funktion som passar bättre när man vill hämta saker från olika källor men använda dem tillsammans.
async function getGoalByArea(goalId) {
  const APIData = await fetch(
    'https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/GetCompareacrossgoalData',
    {
      method: 'POST',
      body: `dataPointType=1&goals=${goalId}&natureOfData=All`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  ).then((response) => response.json());

  const regions = APIData.regions;

  const APILabels = await fetch(
    'https://unstats.un.org/SDGAPI/v1/sdg/Goal/List?includechildren=false'
  ).then((response) => response.json());

  //använda både APIData och APILabels på olika sätt för att skapa diagram osv...

  /* Hämtar ut önskat mål (beroende på dess id) */
  const goal = APILabels.filter((label) => label.code == goalId)[0];

  //mappar regioner för att ange labels. Vi ska inte ha världen.
  const labels = regions
    .map((region) => region.region)
    /* Ta bort världen ur datasetet */
    .filter((region) => region !== 'World');

  //sätter respektive regions percentage-egenskap som data.
  const data = regions.map((region) => region.goals[0].percentage);

  const datasets = [
    {
      label: 'Uppfyllnad av mål per region (%)',
      data,
      borderRadius: 10
    }
  ];
  const canvas = document.getElementById('un');

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets
    }
  });
}

getGoalByArea(1);
