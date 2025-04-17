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

  console.log(popData);
  console.log(energyData);
}
calculateEnergyData();
