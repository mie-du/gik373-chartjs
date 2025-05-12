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
        values: ['2023']
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
  .then((data) => {
    console.log(data);
    console.log(data.data[0]);
  });

const urlUN =
  'https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/GetIndicatorsAllCountries';

const requestUN = new Request(urlUN, {
  method: 'POST',
  body: 'dataPointType=1&countryId=348&natureOfData=all',
  headers: {
    'Content-Type':
      'application/x-www-form-urlencoded'
  }
});

fetch(requestUN)
  .then((response) => response.json())
  .then((data) => console.log(data));

fetch(
  'https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/List'
)
  .then((response) => response.json())
  .then((data) => console.log(data));

//Från eurostat (database -> välj statistik -> visa som tabell -> (välj parametrar) -> download -> välj "jsonstat" i file format -> copy api link -> använd länk enligt nedan)
fetch(
  'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10_gdp$defaultview/?format=JSON&lang=en'
)
  .then((response) => response.json())
  .then((data) => console.log(data));
