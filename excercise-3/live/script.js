//hitta url
const urlSCB =
  'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy';

//formatera förfrågan såsom mottagar-API:et vill ha det
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
        values: ['2020', '2021', '2022', '2023']
      }
    }
  ],
  response: {
    format: 'JSON'
  }
};

//skapa förfrågan till given url, med given data som API:et vill ha
const request = new Request(urlSCB, {
  method: 'POST',
  body: JSON.stringify(querySCB)
});

//skicka själva förfrågan via HTTP med fetch api
fetch(request)
  //gör om till json
  .then((response) => response.json())
  //callback som körs när data hämtats färdigt.
  .then((scbData) => {
    //titta på data
    console.log(scbData);
    //behandla data

    //formatera data som chart.js vill ha det
    const values = scbData.data.map((value) => value.values[0]);
    console.log('värden:', values);

    const labels = scbData.data.map((value) => value.key[1]);
    console.log('etiketter', labels);
    //lägg in i diagram

    const datasets = [
      //endast ett dataset
      {
        label: 'Befolkning Borlänge',
        //värden hämtade från scb på rad 50
        data: values
      }
    ];

    const data = {
      //labels hämtade från scb på rad 53
      labels,
      datasets
    };

    console.log(data);
    //charat type line istället för bar
    const config = { type: 'line', data };
    //hämtar canvaselement med id scb
    const canvas = document.getElementById('scb');
    const scbChart = new Chart(canvas, config);
  });
const urlUN =
  'https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/GetIndicatorsAllCountries';

// förstå hur förfrågan ska formuleras
const requestUN = new Request(urlUN, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'dataPointType=1&countryId=0&natureOfData=All'
});

//skicka förfrågan
fetch(requestUN)
  .then((response) => response.json())
  .then((unData) => {
    //titta på svaret
    console.log(unData);
    goalId = 6;
    //formatera svaret som chart.js vill ha det
    const values = unData[goalId].indicators.map(
      (indicator) => indicator.percentage
    );
    console.log(values);

    const labels = unData[goalId].indicators.map((indicator) => indicator.code);
    console.log(labels);

    //lägg in i diagram
    const datasets = [
      {
        label: 'Uppfyllnad av mål, världen',
        data: values
      }
    ];

    const data = { labels, datasets };
    const config = { type: 'bar', data };

    const canvas = document.getElementById('un');
    const unChart = new Chart(canvas, config);
  });
