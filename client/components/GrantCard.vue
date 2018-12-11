<template lang="pug">
.card
  .card-body
    a(:href="'http://localhost:3000/grants/' + r._id ")
      h4.card-title {{ r._source.title }}
    .container
      .row
        .col-12.card-col
          p.card-text.no-link <strong>Fields</strong>:&nbsp
            span(v-for="(f, i) in r._source.fields") <a :href="'http://localhost:3000/search?matchField=fields&q=' + f">{{ f.trim() }}</a>
              span(v-if="i+1 < r._source.fields.length") ,&nbsp
            | <br><strong>Director</strong>: <a :href="'http://localhost:3000/search?matchField=projectDirector&q=' + r._source.projectDirector">{{ r._source.projectDirector }}</a><br>
            | <strong>Institution</strong>: <a :href="'http://localhost:3000/search?matchField=institution&q=' + r._source.institution">{{ r._source.institution.replace(/\(.*\)/g, '') }}</a><br>
        .col-6.card-col
          p.card-text <strong>Start/End Dates</strong>: {{ r._source.grantStartDate.replace(/-/g,"/") }} - {{ r._source.grantEndDate.replace(/-/g,"/") }}<br>
            | <strong>Approved</strong>: ${{ commas(r._source.approvedUsd) }}<br>
            | <strong>Awarded</strong>: ${{ commas(r._source.awardedUsd) }}
        .col-6.card-col
          p.card-text.no-link
            | <strong>Grant ID</strong>: {{ r._id }}<br>
            | <strong>Division</strong>: <a :href="'http://localhost:3000/search?matchField=division&q=' + r._source.division">{{ r._source.division }}</a><br>
            | <strong>Program</strong>: <a :href="'http://localhost:3000/search?matchField=program&q=' + r._source.program">{{ r._source.program }}</a>
      .row
        .col-12.card-col
          p.card-text(v-if="r._source.products.length > 0 && r._source.products.filter(x => x.primaryURL).length > 0")
            strong Products
            ul(style="max-height: 100px; overflow:auto;padding-left:20px;")
              li(v-for="(p, i) in r._source.products" v-if="p.primaryURL && p.primaryURLRoot")
                | {{ p.title[0] }} (
                a(:href="p.primaryURL" :title="p.title[0]") {{ p.primaryURLRoot }}
                | )
</template>

<style>
.no-link a {
  color: inherit;
}
.card-col {
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 15px;
}
</style>
<script>
export default {
  props: {
    r: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    commas(value) {
      if (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        return '';
      }
    }
  }
};
</script>
