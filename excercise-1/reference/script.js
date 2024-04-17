const labels = [
  'Avesta',
  'Borlänge',
  'Falun',
  'Hedemora',
  'Ludvika',
  'Säter',
  'Mora'
];

const datasets = [
  {
    label: 'Befolkning 2022',
    data: [22932, 52178, 59818, 15443, 26353, 11271, 20679],
    backgroundColor: 'rgba(244,255,12, 0.4)',
    borderWidth: 2,
    borderColor: 'black',
    hoverBorderWidth: 4
  },
  {
    label: 'Befolkning 2023',
    data: [22753, 51735, 59986, 15345, 26402, 11243, 20536],
    backgroundColor: 'rgba(34,255,12, 0.4)',
    borderWidth: 2,
    borderColor: 'black',
    hoverBorderWidth: 4
  }
];

const data = {
  labels,
  datasets
};

const config = { type: 'bar', data, options: {} };

const canvas = document.getElementById('myChart');
const myChart = new Chart(canvas, config);

const overYear = new Chart(document.getElementById('overYear'), {
  type: 'line',
  data: {
    labels: [2022, 2023],
    datasets: [
      { label: 'Borlänge', data: [52178, 51735] },
      { label: 'Falun', data: [59818, 59986] }
    ]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Fler inställningar',
        font: {
          size: 24
        }
      }
    }
  }
});

/* Variant där allt sätts samman direkt i Chart-objektets konstruktor */
/* 
const myChart = new Chart(document.getElementById('myChart'), {
  type: 'bar',
  data: {
    labels: [
      'Avesta',
      'Borlänge',
      'Falun',
      'Hedemora',
      'Ludvika',
      'Säter',
      'Mora'
    ],
    datasets: [
      {
        label: 'Befolkning 2023',
        data: [22753, 51735, 59986, 15345, 26402, 11243, 20536]
      }
    ]
  }
}); */
