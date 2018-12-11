<script>
import { Pie } from 'vue-chartjs';
import axios from 'axios';

function hashCode(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  var c = (i & 0x00ffffff).toString(16).toUpperCase();
  return '00000'.substring(0, 6 - c.length) + c;
}
function stringArrayToColors(arr) {
  return arr.map(ele => `#${intToRGB(hashCode(ele))}`);
}

export default {
  extends: Pie,
  props: {
    datasets: {
      type: Array,
      default() {
        return [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
            data: [50, 25, 25]
          }
        ];
      }
    },
    labels: {
      type: Array,
      default() {
        return ['First label', 'Second', 'Third'];
      }
    }
  },
  mounted() {
    axios.get('http://localhost:8080/api/resolved').then(results => {
      let datasets = [
        {
          backgroundColor: ['#dddddd', '#ff5555'],
          data: [results.data.resolved, results.data.unresolved]
        }
      ];
      let labels = ['Resolved', 'Unresolved'];
      let chartData = {
        datasets,
        labels
      };
      console.log('rendering chart...');
      this.renderChart(chartData, {
        responsive: true,
        maintainAspectRatio: false,
        onClick: this.chartClickEvent
      });
    });
  },
  methods: {
    chartClickEvent(event, array) {
      let label = array[0]._model.label;
      let resolved = label === 'Resolved' ? true : false;
      let routeData = this.$router.resolve({
        name: 'search',
        query: {
          q: resolved,
          matchField: 'products.primaryURLResolves',
          bool: true
        }
      });
      window.open(routeData.href, '_blank');
    }
  }
};
</script>
