<script>
import { Line } from 'vue-chartjs';
import axios from 'axios';
const brandPrimary = 'rgba(255,255,255,.55)';

export default {
  extends: Line,
  mounted() {
    const options = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: 'transparent',
              zeroLineColor: 'transparent'
            },
            ticks: {
              fontSize: 2,
              fontColor: 'transparent'
            }
          }
        ],
        yAxes: [
          {
            display: false,
            ticks: {
              display: false,
              min: Math.min.apply(Math, this.datasets[0].data) - 5,
              max: Math.max.apply(Math, this.datasets[0].data) + 5
            }
          }
        ]
      },
      elements: {
        line: {
          borderWidth: 1
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 4
        }
      }
    };
    axios.get('http://localhost:8080/grantsovertime').then(results => {
      let labels = results.data.map(x => x.key);
      let datasets = [results.data.map(x => x.doc_count)];
      const data = {
        labels,
        datasets
      };
      this.renderChart(data, options);
    });
  }
};
</script>
