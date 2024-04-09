/* https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/ */
/* Låginkomst 0-17 */

const fonts = {
  title: {
    size: 20,
    family: 'Montserrat, sans-serif',
    weight: 'normal'
  }
};

async function getLowIncomeData() {
  const query = {
    query: [
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
        code: 'BakgrundSvUt',
        selection: {
          filter: 'item',
          values: ['TotalC']
        }
      },
      {
        code: 'UtbNivaForalder',
        selection: {
          filter: 'item',
          values: ['30']
        }
      }
    ],
    response: {
      format: 'json'
    }
  };
  const request = new Request(
    'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/LE/LE0102/LE0102L/LE0102L5',
    {
      method: 'POST',
      body: JSON.stringify(query)
    }
  );
  const response = await fetch(request);
  const dataResult = await response.json();
  /* Sätter samam data i chart-egenskaper */
  /* Plockar ur värden och skapar arrayer i format som chart.js förstår */
  const labels = dataResult.data.map((obj) => obj.key[4]);
  /* console.log(labels); */
  const values = dataResult.data.map((obj) => obj.values[0]);
  /* console.log(values); */
  const datasets = [
    {
      label: 'Antal barn under 17 boende i hushåll med låg inkomststandard',
      data: values,
      /* https://www.chartjs.org/docs/latest/charts/line.html#dataset-properties */
      tension: 0.5,
      backgroundColor: 'hsla(165, 100%, 40%, 1)',
      borderColor: 'hsla(165, 100%, 40%, 0.6)',
      /* https://www.chartjs.org/docs/latest/configuration/elements.html#types */
      pointStyle: 'rectRot',
      pointHoverBackgroundColor: 'hsla(165, 100%, 20%, 1)',
      pointRadius: '6',
      pointHoverRadius: '6'
    }
  ];

  /* console.log(datasets); */
  const canvas = document.getElementById('scb');
  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      plugins: {
        title: {
          text: 'Barn (0-17 år) i hushåll med låg inkomststandard',
          display: true,
          font: fonts.title
        }
      }
    }
  });
}

async function getGoalByArea(goalId) {
  const dataResult = await fetch(
    'https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/GetCompareacrossgoalData',
    {
      method: 'POST',
      body: `dataPointType=1&goals=${goalId}&natureOfData=All`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  ).then((response) => response.json());

  const regions = dataResult.regions;

  const labelResult = await fetch(
    'https://unstats.un.org/SDGAPI/v1/sdg/Goal/List?includechildren=false'
  ).then((response) => response.json());

  const goal = labelResult.filter((label) => label.code == goalId)[0];
  const goalLabel = `Goal ${goal.code} - ${goal.title}, per area`;

  const labels = regions
    .map((region) => region.region)
    /* Ta bort världen ur datasetet */
    .filter((region) => region !== 'World');

  console.log(labels);
  const data = regions.map((region) => region.goals[0].percentage);
  console.log(data);
  const datasets = [
    {
      label: 'Uppfyllnad av mål ' + goalId + ' (%)',
      data,
      backgroundColor: [
        'hsla(0, 100%, 70%, .6)',
        'hsla(20, 100%, 70%, .6)',
        'hsla(40, 100%, 70%, .6)',
        'hsla(60, 100%, 70%, .6)',
        'hsla(80, 100%, 70%, .6)',
        'hsla(100, 100%, 70%, .6)',
        'hsla(120, 100%, 70%, .6)',
        'hsla(140, 100%, 70%, .6)',
        'hsla(160, 100%, 70%, .6)',
        'hsla(170, 100%, 70%, .6)',
        'hsla(190, 100%, 70%, .6)'
      ],
      borderRadius: 10
    }
  ];
  const canvas = document.getElementById('un');
  //tar bort progress-cirkeln när allt är färdigt
  document.getElementById('progress').remove();
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets
    },
    options: {
      plugins: {
        title: {
          text: goalLabel,
          display: true,
          font: fonts.title
        }
      }
    }
  });
}

async function registredVehicles() {
  const query = {
    query: [
      {
        code: 'Region',
        selection: {
          filter: 'item',
          values: ['00']
        }
      },
      {
        code: 'Drivmedel',
        selection: {
          filter: 'item',
          values: ['100', '110', '120', '130', '140', '150', '160', '190']
        }
      },
      {
        code: 'Tid',
        selection: {
          filter: 'item',
          values: ['2024M03']
        }
      }
    ],
    response: {
      format: 'json'
    }
  };

  const request = new Request(
    'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/TK/TK1001/TK1001A/PersBilarDrivMedel',
    {
      method: 'POST',
      body: JSON.stringify(query)
    }
  );
  const response = await fetch(request);
  const dataResult = await response.json();
  console.log(dataResult);
  //manuellt mappade läsbara versioner av de koder som representerar respektive drivmedel.
  const codeMapLabels = {
    100: 'Bensin',
    110: 'Diesel',
    120: 'El',
    130: 'Elhybrid',
    140: 'Laddhybrid',
    150: 'Etanol/etanol flexifuel',
    160: 'Gas/gas flexifuel',
    190: 'Övriga bränslen'
  };
  const values = dataResult.data.map((data) => data.values[0]);
  //mappar koderna som finns i resultatet med de läsbara varianterna som mappades manuellt
  const labels = dataResult.data.map((data) => codeMapLabels[data.key[1]]);
  const datasets = [
    {
      label: 'Drivmedel hos nyregistrerade personbilar Mars 2024',
      data: values
    }
  ];
  const canvas = document.getElementById('scbV');
  new Chart(canvas, {
    type: 'pie',
    data: {
      labels,
      datasets
    },
    options: {
      plugins: {
        title: {
          text: 'Typer av nyregistrerade personbilar, mars 2024',
          display: true,
          font: fonts.title
        }
      }
    }
  });
}
getLowIncomeData();
registredVehicles();
getGoalByArea(1);
