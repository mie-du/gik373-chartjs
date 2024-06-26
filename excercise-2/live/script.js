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
        values: ['2023']
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
  .then((scbData) => {
    //titta på data
    console.log(scbData);
    //behandla data

    //formatera data som chart.js vill ha det
    const values = scbData.data.map((value) => value.values[0]);
    console.log(values);

    //lägg in i diagram
  });

//hitta rätt url
const urlUN =
  'https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/GetIndicatorsAllCountries';

// förstå hur förfrågan ska formuleras
const requestUN = new Request(urlUN, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'dataPointType=1&countryId=752&natureOfData=C'
});

//skicka förfrågan
fetch(requestUN)
  .then((response) => response.json())
  .then((unData) => {
    //titta på svaret
    console.log(unData);

    //behandla svar/gör beräkningar
    const indicator = unData[1].indicators[0];
    console.log(indicator);

    const indicatorsGoal2 = unData[1].indicators.map(
      (indicator) => indicator.percentage
    );
    console.log(indicatorsGoal2);

    //formatera svaret som chart.js vill ha det

    //lägg in i diagram
  });

//exempel umeå för grupp 6
const urlUm =
  'https://opendata.umea.se/api/explore/v2.1/catalog/datasets/vaxthusgasutslapp_umea/records?limit=20';

fetch(urlUm)
  .then((response) => response.json())
  .then((data) => console.log(data));
