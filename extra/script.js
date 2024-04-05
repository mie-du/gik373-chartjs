/* https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/ */
/* Låginkomst 0-17 */

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
  const stat = await response.json();
  /* Sätter samam data i chart-egenskaper */
  /* Plockar ur värden och skapar arrayer i format som chart.js förstår */
  const labels = stat.data.map((obj) => obj.key[4]);
  /* console.log(labels); */
  const values = stat.data.map((obj) => obj.values[0]);
  /* console.log(values); */
  const datasets = [
    {
      label: 'Antal barn under 17 boende i hushåll med låg inkomststandard',
      data: values,
      /* https://www.chartjs.org/docs/latest/charts/line.html#dataset-properties */
      tension: 0.5,
      backgroundColor: 'hsla(120, 100%, 50%, 0.5)',
      borderColor: 'hsla(120, 100%, 50%, 0.5)',
      /* https://www.chartjs.org/docs/latest/configuration/elements.html#types */
      pointStyle: 'rectRot',
      pointBackgroundColor: 'hsla(120, 100%, 70%, .6)',
      pointHoverBackgroundColor: 'hsla(120, 100%, 30%)',
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
          font: { size: 20 }
        }
      }
    }
  });
}

getLowIncomeData();

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
  console.log(regions); 
  const labelResult = await fetch(
    'https://unstats.un.org/SDGAPI/v1/sdg/Goal/List?includechildren=false'
  ).then((response) => response.json());
  console.log(labelResult);
  const goal = labelResult.filter((label) => label.code == goalId)[0];
  const goalLabel = `Goal ${goal.code} - ${goal.title}`;

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
          font: { size: 20 }
        }
      }
    }
  });
}

getGoalByArea(1);
