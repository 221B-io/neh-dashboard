<script>
import { Bar } from 'vue-chartjs';
import axios from 'axios';

export default {
  extends: Bar,
  mounted() {
    let data = [
      53089,
      6402,
      2200,
      966,
      465,
      299,
      149,
      125,
      67,
      54,
      44,
      29,
      21,
      15,
      11,
      8,
      2,
      3,
      4,
      6,
      2,
      3,
      2,
      1,
      0,
      2,
      1,
      1,
      1,
      1,
      1,
      1
    ];
    let labels = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '31',
      '32',
      '42',
      '47',
      '69'
    ];
    let backgroundColor = labels.map(() => '#ccc');
    let datasets = [
      {
        backgroundColor,
        data
      }
    ];
    let chartData = {
      datasets,
      labels
    };
    this.renderChart(chartData, {
      responsive: true,
      maintainAspectRatio: false,
      onClick: this.chartClickEvent,
      scales: {
        yAxes: [
          {
            type: 'logarithmic',
            ticks: {
              callback: function(value, index, values) {
                console.log(value);
                return Number(value);
              },
              fontSize: 10,
              padding: 10
            }
          }
        ]
      },
      legend: {
        display: false
      }
    });
  },
  methods: {
    chartClickEvent(event, array) {
      let divisionLabel = array[0]._model.label;
      let routeData = this.$router.resolve({
        name: 'search',
        query: { q: divisionLabel, matchField: 'division' }
      });
      window.open(routeData.href, '_blank');
    }
  }
};
</script>
