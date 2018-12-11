<template lang="pug">
  .animated.fadeIn
    .mb-3
        .form-inline.mx-auto(style="max-width: 500px;")
          b-form-input(type="text" placeholder="Search here" v-model="query" @keyup.enter.native="callSearch()").form-control.f-grow
          b-form-select(v-model="matchField" :options="options").form-control
          b-button(variant="primary" @click="callSearch()") Search
    //- <!-- Main Charts + Data -->
    <b-card-group columns class="card-columns cols-2">
      <b-card header="Resolvable vs Unresolvable Product Links">
        <div class="chart-wrapper">
          <div class="container">
            <div class="row">
              <div class="col-md-6 offset-md-3">
                <pie-resolved/>
              </div>
            </div>
          </div>
        </div>
      </b-card>
      <b-card header="Product Link Locations">
        <div class="container">
          <div class="row mb-3">
            <div class="offset-lg-1 col-lg-10">
              <div class="chart-wrapper">
                <pie-product-urls/>
              </div>
            </div>
          </div>
        </div>
      </b-card>
      <b-card header="Data Preservation Rates by Website">
        <div class="chart-wrapper">
          <grant-count-bar/>
        </div>
      </b-card>
      <b-card header="Number of Grants by Institution">
        <div class="chart-wrapper">
          <h-bar-institutions/>
        </div>
      </b-card>
      <b-card header="Grants By Year">
        <grants-by-year/>
      </b-card>
      <b-card header="NEH Divisions">
        <pie-divisions/>
      </b-card>
      <b-card header="NEH Programs">
        <pie-programs/>
      </b-card>
    </b-card-group>
</template>

<style>
.form-inline .f-grow {
  flex-grow: 1;
}
</style>

<script>
import PieDivisions from '~/components/charts/PieDivisions';
import GrantsByYear from '~/components/charts/GrantsByYear';
import CardLine1ChartExample from '~/components/dashboard/CardLine1ChartExample';
import CardLine2ChartExample from '~/components/dashboard/CardLine2ChartExample';
import CardLine3ChartExample from '~/components/dashboard/CardLine3ChartExample';
import CardBarChartExample from '~/components/dashboard/CardBarChartExample';
import MainChartExample from '~/components/dashboard/MainChartExample';
import SocialBoxChartExample from '~/components/dashboard/SocialBoxChartExample';
import CalloutChartExample from '~/components/dashboard/CalloutChartExample';
import { Callout } from '~/components/';
import BarExample from '~/components/charts/BarExample';
import LineExample from '~/components/charts/LineExample';
import DoughnutExample from '~/components/charts/DoughnutExample';
import RadarExample from '~/components/charts/RadarExample';
import PieExample from '~/components/charts/PieExample';
import PolarAreaExample from '~/components/charts/PolarAreaExample';
import PieResolved from '~/components/charts/PieResolved';
import PieUnresolvedRatio from '~/components/charts/PieUnresolvedRatio';
import PieProductUrls from '~/components/charts/PieProductUrls';
import HBarInstitutions from '~/components/charts/HBarInstitutions';
import PiePrograms from '~/components/charts/PiePrograms';
import GrantCountBar from '~/components/charts/GrantCountBar';

const axios = require('axios');
const bodybuilder = require('bodybuilder');

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
  return arr.map(ele => intToRGB(hashCode(ele)));
}

export default {
  name: 'Dashboard',
  components: {
    PieDivisions,
    PiePrograms,
    GrantCountBar,
    Callout,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample,
    BarExample,
    LineExample,
    DoughnutExample,
    RadarExample,
    PieExample,
    PolarAreaExample,
    PieResolved,
    PieUnresolvedRatio,
    PieProductUrls,
    HBarInstitutions,
    GrantsByYear
  },
  data: function() {
    return {
      grants: [],
      institutions: [],
      institutionNames: [],
      institutionNumbers: [],
      institutionColors: [],
      institutionsNumber: 0,
      intitutionDatasets: [],
      pieData: {},
      totalGrants: 0,
      selected: 'Month',
      query: '',
      options: [
        { value: '', text: 'Full Text' },
        { value: 'projectDirector', text: 'Director Name' },
        { value: 'institution', text: 'Institution' },
        { value: 'title', text: 'Title' },
        { value: 'fields', text: 'Subject' },
        { value: 'division', text: 'Division' },
        { value: 'program', text: 'Program' }
      ],
      matchField: ''
    };
  },
  created() {
    let body = {
      query: {
        match_all: {}
      }
    };
    axios.post('http://localhost:8080/api/raw', body).then(results => {
      this.totalGrants = results.data.hits.total;
    });
  },
  methods: {
    variant(value) {
      let $variant;
      if (value <= 25) {
        $variant = 'info';
      } else if (value > 25 && value <= 50) {
        $variant = 'success';
      } else if (value > 50 && value <= 75) {
        $variant = 'warning';
      } else if (value > 75 && value <= 100) {
        $variant = 'danger';
      }
      return $variant;
    },
    flag(value) {
      return 'flag-icon flag-icon-' + value;
    }
  }
};
</script>
