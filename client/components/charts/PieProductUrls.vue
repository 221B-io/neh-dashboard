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
    axios.get('http://localhost:8080/api/urlroots').then(results => {
      results.data.shift(); // remove WorldCat
      this.institutionNames = results.data.map(x => x.key);
      this.institutionNumbers = results.data.map(x => x.doc_count);
      this.institutionColors = stringArrayToColors(this.institutionNames);
      console.log('Product URL percentages');
      console.log(this.institutionNumbers.map(x => (x / 63975) * 100));
      this.institutionDatasets = [
        {
          backgroundColor: this.institutionColors,
          data: this.institutionNumbers
        }
      ];
      this.institutions = results;
      this.chartData = {
        datasets: this.institutionDatasets,
        labels: this.institutionNames
      };
      this.renderChart(this.chartData, {
        responsive: true,
        maintainAspectRatio: false,
        onClick: this.chartClickEvent,
        legend: {
          display: false
        }
      });
    });
  },
  methods: {
    chartClickEvent(event, array) {
      let rootURL = array[0]._model.label;
      let routeData = this.$router.resolve({
        name: 'search',
        query: { q: rootURL, matchField: 'products.primaryURLRoot' }
      });
      window.open(routeData.href, '_blank');
    }
  }
};
</script>
