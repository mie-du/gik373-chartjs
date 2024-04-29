/* Lite gemensamma inställningar för typsnitt som återanvänds i flera diagram nedan. */
const fonts = {
  title: {
    size: 20,
    family: 'Montserrat, sans-serif',
    weight: 'normal'
  }
};
/* Stödfunktion för att generera färger.  */
function getColors(data, opacity) {
  return data.map(
    (point, idx) => `hsla(${80 + idx * 35}, 100%, 40%, ${opacity})`
  );
}

async function getIncomeData() {
  /* Query (fråga) hämtad från SCB https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__HE__HE0110__HE0110F/TabVXDispI4C/ efter valda kriterier */
  const query = {
    query: [
      {
        code: 'Alder',
        selection: {
          filter: 'item',
          values: ['20-64', '65+']
        }
      },
      {
        code: 'Hushallstyp',
        selection: {
          filter: 'item',
          values: ['E91']
        }
      },
      {
        code: 'Upplatelseform',
        selection: {
          filter: 'item',
          values: ['TOTUF']
        }
      },
      {
        code: 'InkomstTyp',
        selection: {
          filter: 'item',
          values: ['DispInkInkl']
        }
      },
      {
        code: 'ContentsCode',
        selection: {
          filter: 'item',
          values: ['000006SL']
        }
      },
      {
        code: 'Tid',
        selection: {
          filter: 'item',
          values: ['2018', '2019', '2020', '2021', '2022']
        }
      }
    ],
    response: {
      format: 'JSON'
    }
  };
  /* HTTP-förfrågan utformad från SCB:s fråga */
  const request = new Request(
    'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/HE/HE0110/HE0110F/TabVXDispI4C',
    {
      method: 'POST',
      body: JSON.stringify(query)
    }
  );
  /* Skickar förfrågan med fetch */
  const response = await fetch(request);
  /* Hämtar ut själva svaret med response.json() */
  const APIData = await response.json();
  console.log(APIData);
  /* Sätter samam data i chart-egenskaper */
  /* Plockar ur värden och skapar arrayer i format som chart.js förstår */

  /* År (etiketter för x-axeln) finns i 4 elementet i arrayen keys (set används för att plocka ut unika värden ) */
  const labels = [...new Set(APIData.data.map((obj) => obj.key[4]))];
  /* Åldersgrupp (etikett för respektive dataset) finns i element 0 i arrayen keys (Set används för att plocka ut unika värden) */
  const datasetLabels = [...new Set(APIData.data.map((obj) => obj.key[0]))];
  /* Alla värden finns i arrayen values. De fem första för första åldersgruppen, osv.  */
  const values = APIData.data.map((obj) => obj.values[0]);

  const datasets = [
    {
      /* Första elementet i datasetLabels är för första åldersgruppen */
      label: datasetLabels[0],
      /* Första fem elementen i arrayen representerar den första åldersgruppen för respektive år */
      data: values.splice(0, 5),
      /* Inställningar för utseende på linje. https://www.chartjs.org/docs/latest/charts/line.html#dataset-properties */
      tension: 0.5,
      backgroundColor: 'hsla(165, 100%, 40%, 1)',
      borderColor: 'hsla(165, 100%, 40%, 0.6)',
      /* Inställningar för utseende på linjens punkter.  https://www.chartjs.org/docs/latest/configuration/elements.html#types */
      pointStyle: 'rectRot',
      pointHoverBackgroundColor: 'hsla(165, 100%, 20%, 1)',
      pointRadius: '6',
      pointHoverRadius: '6'
    },
    {
      /* Nästa element i datasetLabels är för andra åldersgruppen */
      label: datasetLabels[1],
      /* Resterande 5 element av values-arrayen (efter att de 5 första är borttagna) */
      data: values,
      /* Inställningar för utseende på linje. https://www.chartjs.org/docs/latest/charts/line.html#dataset-properties */
      tension: 0.5,
      backgroundColor: 'hsla(77, 100%, 40%, 1)',
      borderColor: 'hsla(77, 100%, 40%, 0.6)',
      /* Inställningar för utseende på linjens punkter.  https://www.chartjs.org/docs/latest/configuration/elements.html#types */
      pointStyle: 'rectRot',
      pointHoverBackgroundColor: 'hsla(77, 100%, 20%, 1)',
      pointRadius: '6',
      pointHoverRadius: '6'
    }
  ];
  /* Hämtar canvas-element i DOM-trädet */
  const canvas = document.getElementById('scb');
  new Chart(canvas, {
    /* Typ av diagram */
    type: 'line',
    /* Använder labels (etiketter längs x-axeln) och dataset för att sätta samman innehållet i diagramet*/
    data: {
      labels,
      datasets
    },
    /* Ytterligare inställningar, här i form av en titel för diagramet.  */
    options: {
      plugins: {
        title: {
          text: 'Medelvärde disponibel inkomst tkr/år inkl. kapitalvinst per åldersgrupp',
          display: true,
          font: fonts.title
        }
      }
    }
  });
}

async function getGoalByArea(goalId) {
  /* Förfrågan skickad med fetch till un:s api (compare across goal data) */
  const APIData = await fetch(
    'https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/GetCompareacrossgoalData',
    {
      method: 'POST',
      /* Innehåll i body hämtad från https://unstats.un.org/SDGAPI/swagger/#!/DataAvailability/V1SdgDataAvailabilityGetCompareacrossgoalDataPost goalId enligt vad som skickades till funktionen. */
      body: `dataPointType=1&goals=${goalId}&natureOfData=All`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
    /* Gör om resultatet till JSON */
  ).then((response) => response.json());

  /* hämtar ut regioner från API-data */
  const regions = APIData.regions;
  /* Hämtar alla mål från API:et också för att kunna skriva ut information om det specifika målet */
  const APILabels = await fetch(
    'https://unstats.un.org/SDGAPI/v1/sdg/Goal/List?includechildren=false'
  ).then((response) => response.json());

  /* Hämtar ut önskat mål (beroende på dess id) */
  const goal = APILabels.filter((label) => label.code == goalId)[0];
  const goalLabel = `Goal ${goal.code} - ${goal.title}, per area`;
  document.getElementById('unMoreInfo').innerHTML = goal.description;
  const labels = regions
    .map((region) => region.region)
    /* Ta bort världen ur datasetet */
    .filter((region) => region !== 'World');

  const data = regions.map((region) => region.goals[0].percentage);

  const datasets = [
    {
      label: 'Uppfyllnad av mål per region (%)',
      data,
      backgroundColor: getColors(data, '0.5'),
      borderRadius: 10
    }
  ];
  const canvas = document.getElementById('un');
  //tar bort progress-cirkeln när allt är färdigt
  document.getElementById('progressImg').style.display = 'none';
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
  const APIData = await response.json();
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

  const data = APIData.data.map((data) => data.values[0]);

  //mappar koderna som finns i resultatet med de läsbara varianterna som mappades manuellt
  const labels = APIData.data.map((data) => codeMapLabels[data.key[1]]);

  const datasets = [
    {
      label: 'Drivmedel hos nyregistrerade personbilar Mars 2024',
      data,
      backgroundColor: getColors(data, '0.6')
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
      },
      locale: 'sv'
    }
  });
}

getIncomeData();
registredVehicles();
/* Funktionen möjliggör att skicka in en siffra (1-17) som representerar ett mål */
getGoalByArea(2);
