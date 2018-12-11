<script>
import { HorizontalBar } from 'vue-chartjs';
import axios from 'axios';
// const { reactiveProp } = mixins;

function hashCode(str) {
  // java String#hashCode
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
  extends: HorizontalBar,
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
    axios.get('http://localhost:8080/api/institutions').then(results => {
      let instNames = results.data.map(x => x.key.split('(')[0]);
      instNames = instNames.slice(3);

      let instNums = results.data.map(x => x.doc_count);
      instNums = instNums.slice(3);
      let institutionColors = stringArrayToColors(instNames);
      console.log('Institution percentages');
      console.log(instNums.map(x => (x / 63975) * 100));
      let institutionDatasets = [
        {
          backgroundColor: institutionColors,
          data: instNums
        }
      ];
      let chartData = {
        datasets: institutionDatasets,
        labels: instNames
      };
      this.renderChart(chartData, {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        onClick: this.chartClickEvent
      });
    });
  },
  methods: {
    chartClickEvent(event, array) {
      if (array[0]._model) {
        let institutionName = array[0]._model.label;
        let routeData = this.$router.resolve({
          name: 'search',
          query: { q: institutionName, matchField: 'institution' }
        });
        window.open(routeData.href, '_blank');
      } else {
        this.super(...arguments);
      }
    }
  }
};
</script>
