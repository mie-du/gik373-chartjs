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

console.log(data);

const config = { type: 'bar', data };

const canvas = document.getElementById('myChart');
const myChart = new Chart(canvas, config);

const myChart2 = new Chart(document.getElementById('myChart2'), {
  type: 'line',
  data: {
    labels: [2022, 2023],
    datasets: [
      {
        label: 'Borlänge',
        data: [52178, 51735],
        borderColor: 'black'
      },
      {
        label: 'Falun',
        data: [59818, 59986],
        borderColor: 'green'
      }
    ]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Custom Chart Title',
        font: { size: 36, family: 'Times New Roman' }
      }
    }
  }
});
