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
    data: [
      22753, 51735, 59986, 15345, 26402, 11243,
      20536
    ],
    backgroundColor: 'rgba(244,255,12,0.7)',
    borderColor: 'rgba(254, 35, 12, 0.2)',
    borderWidth: 2,
    hoverBackgroundColor:
      'rgba(254, 35, 12, 0.2)',
    hoverBorderColor: 'rgb(0,0,0)'
  },
  {
    label: 'Befolkning 2023',
    data: [
      22932, 52178, 59818, 15443, 26353, 11271,
      20679
    ],
    backgroundColor: 'rgba(44,255,12,0.7)'
  }
];

const config = {
  type: 'bar',
  data: { labels: labels, datasets: datasets },
  options: {}
};

const canvas = document.getElementById('myChart');
const myChart = new Chart(canvas, config);

const config2 = {
  type: 'line',
  data: {
    labels: [2022, 2023],
    datasets: [
      {
        label: 'Borlänge',
        data: [52178, 51735]
      },
      {
        label: 'Falun',
        data: [59818, 59986]
      }
    ]
  }
};

const overYear = new Chart(
  document.getElementById('overYear'),
  config2
);
