<script>
import { Bar } from 'vue-chartjs';
import axios from 'axios';
export default {
  extends: Bar,
  props: {
    height: {
      type: Number,
      default: 200
    }
  },
  mounted() {
    let options = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            display: false,
            categoryPercentage: 1,
            barPercentage: 0.5
          }
        ],
        yAxes: [
          {
            display: false
          }
        ]
      }
    };
    axios.get('http://localhost:8080/api/grantsovertime').then(results => {
      console.log(results.data);
      results.data = results.data.slice(results.data.length - 10); // take the last 10 items
      let labels = results.data.map(x => x.key_as_string.slice(0, 4));
      let datasets = [
        {
          backgroundColor: 'rgba(255,255,255,.3)',
          borderColor: 'transparent',
          data: results.data.map(x => x.doc_count)
        }
      ];
      this.renderChart(
        {
          labels,
          datasets
        },
        options
      );
    });
  }
};
</script>
