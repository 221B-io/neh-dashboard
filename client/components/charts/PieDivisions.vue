<script>
import { HorizontalBar } from 'vue-chartjs';
import axios from 'axios';

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
  mounted() {
    axios.get('http://localhost:8080/api/divisions').then(results => {
      let d = results.data.aggregations.divisions.buckets;
      let labels = d.map(x => x.key);
      let institutionNumbers = d.map(x => x.doc_count);
      let institutionColors = stringArrayToColors(labels);
      console.log('Division percentages');
      console.log(institutionNumbers.map(x => (x / 63975) * 100));
      let institutionDatasets = [
        {
          backgroundColor: institutionColors,
          data: institutionNumbers
        }
      ];
      let chartData = {
        datasets: institutionDatasets,
        labels
      };
      this.renderChart(chartData, {
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
