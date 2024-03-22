const urlSCB =
  'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/LE/LE0102/LE0102L/LE0102L4';

const querySCB = {
  query: [
    {
      code: 'Kon',
      selection: {
        filter: 'item',
        values: ['5+6']
      }
    },
    {
      code: 'Alder',
      selection: {
        filter: 'item',
        values: ['0-17']
      }
    },
    {
      code: 'Inkomststandard',
      selection: {
        filter: 'item',
        values: ['lagStd']
      }
    },
    {
      code: 'Familjetyp',
      selection: {
        filter: 'item',
        values: ['Total']
      }
    },
    {
      code: 'Antalsyskon',
      selection: {
        filter: 'item',
        values: ['999']
      }
    }
  ],
  response: {
    format: 'px'
  }
};

fetch(urlSCB, { method: 'POST', body: JSON.stringify(querySCB) })
  .then((response) => response.json())
  .then((data) => console.log(data));
