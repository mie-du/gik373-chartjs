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
    label: 'Befolkning i Dalarna 2023',
    data: [22753, 51735, 59986, 15345, 26402, 11243, 20536],
    backgroundColor: 'rgba(44, 255, 12, 0.4)',
    borderWidth: 2,
    borderColor: 'black'
  },
  {
    label: 'Befolkning i Dalarna 2024',
    data: [22553, 50735, 52996, 35345, 36402, 11143, 10536]
  }
];

const data = { labels: labels, datasets: datasets };

console.log(data);

const config = {
  type: 'bar',
  data: data,
  options: {}
};

const canvasElement = document.getElementById('myChart');
console.log(canvasElement);

const myChart = new Chart(canvasElement, config);
