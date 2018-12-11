<script>
import { Line } from 'vue-chartjs';
import axios from 'axios';
const dollarinflation = require('dollarinflation');

function commas(value) {
  if (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return '';
  }
}
export default {
  extends: Line,
  async mounted() {
    let options = {
      maintainAspectRatio: false
      // scales: {
      //   yAxes: [
      //     {
      //       ticks: {
      //         // Include a dollar sign in the ticks
      //         callback: function(value, index, values) {
      //           return '$' + commas(value);
      //         }
      //       }
      //     }
      //   ]
      // }
    };
    let results = await axios.get('http://localhost:8080/api/grantsovertime');
    results.data.pop();
    let labels = results.data.map(x => x.key_as_string.slice(0, 4));
    let dataFemale = results.data.map(x => {
      let buckets = x.gender.buckets.filter(y => y.key === 'female');
      if (buckets.length > 0) {
        return buckets[0].doc_count;
      } else {
        return 0;
      }
    });
    let dataMale = results.data.map(x => {
      let buckets = x.gender.buckets.filter(y => y.key === 'male');
      if (buckets.length > 0) {
        return buckets[0].doc_count;
      } else {
        return 0;
      }
    });
    let dataMalePercentage = [];
    let dataFemalePercentage = [];
    for (let i = 0; i < dataMale.length; i += 1) {
      dataMalePercentage.push(dataMale[i] / (dataMale[i] + dataFemale[i]));
    }
    for (let i = 0; i < dataMale.length; i += 1) {
      dataFemalePercentage.push(dataFemale[i] / (dataMale[i] + dataFemale[i]));
    }
    let datasets = [
      {
        label: 'Number of Grants',
        borderColor: '#00f',
        data: results.data.map(x => x.doc_count)
      }
      // {
      //   label: 'Inflation-Adjusted Average Award Size',
      //   borderColor: '#3f3',
      //   data: results.data.map(
      //     x =>
      //       dollarinflation(
      //         parseInt(x.key_as_string.slice(0, 4)) > 2014
      //           ? 2014
      //           : parseInt(x.key_as_string.slice(0, 4)),
      //         2014,
      //         x.total_usd.value / x.doc_count
      //       ) * 1.0682 // inflation between 2014 and 2018
      //   )
      // },
      // {
      //   label: 'Male',
      //   borderColor: '#cc5500',
      //   data: dataMale
      // },
      // {
      //   label: 'Female',
      //   borderColor: '#228B22',
      //   data: dataFemale
      // },
      // {
      //   label: 'Male %',
      //   borderColor: '#cc5500',
      //   data: dataMalePercentage
      // },
      // {
      //   label: 'Female %',
      //   borderColor: '#228B22',
      //   data: dataFemalePercentage
      // }
    ];
    this.renderChart(
      {
        labels,
        datasets
      },
      options
    );
  }
};
</script>
