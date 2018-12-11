<template lang="pug">
.container
  .results-table.mt-5
    .row
      .col-lg-8.offset-lg-2
        grant-card(:r="r")
        h3.text-muted(style="padding-left:1.25rem") Products
        product-card(v-for="(p, i) in r._source.products" :key="i" :p="p")


</template>
<script>
import axios from 'axios';
import GrantCard from '~/components/GrantCard';
import ProductCard from '~/components/ProductCard';
export default {
  components: {
    GrantCard,
    ProductCard
  },
  asyncData({ params }) {
    // called every time before loading the component
    debugger;
    return axios
      .get(`http://localhost:8080/api/detail?q=_id:${params.id}`)
      .then(results => {
        debugger;
        return {
          id: params.id,
          r: results.data.hits.hits[0]
        };
      });
  },
  methods: {
    search() {
      axios
        .get(`http://localhost:8080/api/detail?q=${this._id}`)
        .then(results => {
          this.results = results.data.hits.hits;
          this.totalResults = results.data.hits.total;
        });
    }
  }
};
</script>
