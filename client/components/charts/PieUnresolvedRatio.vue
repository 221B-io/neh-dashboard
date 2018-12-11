<script>
import { HorizontalBar } from 'vue-chartjs';
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
  extends: HorizontalBar,
  mounted() {
    let body = {
      size: 0,
      aggs: {
        unique_root: {
          terms: {
            field: 'products.primaryURLRoot.keyword',
            size: 100
          },
          aggs: {
            root_bucket: {
              filter: {
                exists: {
                  field: 'products.primaryURLRoot.keyword'
                }
              },
              aggs: {
                root_count: {
                  value_count: {
                    field: 'products.primaryURLRoot.keyword'
                  }
                }
              }
            },
            resolve_bucket: {
              filter: {
                term: {
                  'products.primaryURLResolves': true
                }
              },
              aggs: {
                resolve_count: {
                  value_count: {
                    field: 'products.primaryURLResolves'
                  }
                }
              }
            }
          }
        }
      }
    };
    axios.post('http://localhost:8080/api/raw', body).then(results => {
      let data = results.data.aggregations.unique_root.buckets.map(item => {
        item.ratio = item.resolve_bucket.doc_count / item.doc_count;
        return item;
      });
      data = data.filter(item => {
        return item.doc_count > 20;
      });
      data = data.sort((a, b) => {
        if (a.ratio > b.ratio) {
          return -1;
        } else {
          return 1;
        }
      });
      let labels = data.map(item => item.key);
      let backgroundColor = stringArrayToColors(labels);
      let datasets = [
        {
          backgroundColor,
          data: data.map(item => item.ratio)
        }
      ];
      let chartData = {
        datasets,
        labels
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
