<template lang="pug">
.container
  .row
    .col-lg-8.offset-lg-2
      .form-inline
        b-form-input(type="text" placeholder="Search here" v-model="query" @keyup.enter.native="callSearch()").form-control.f-grow
        b-form-select(v-model="matchField" :options="options").form-control
        b-button(variant="primary" @click="callSearch()") Search
  .row.mt-5.pt-5(v-if="results.length === 0 && !this.searched && !this.loading")
    .col-12.text-center
      h3.text-muted When you search for a term, any results will appear here.
  .row.mt-5.pt-5(v-if="results.length === 0 && this.searched && !this.loading")
    .col-12.text-center
      h3.text-muted No results found :(
  .results-table.mt-4
    .row(v-if="results.length > 0")
      .col-lg-8.offset-lg-2
        p.pull-right.text-muted Showing results {{ from + 1 }}-{{ from + pageSize }} of {{ totalResults }}
    .row(v-for="r in results")
      .col-lg-8.offset-lg-2
        grant-card(:r='r')
    .row(v-if="results.length > 0")
      .col-lg-8.offset-lg-2.mb-5
        b-pagination(size="md" :total-rows="this.totalResults" v-model="currentPage" :per-page="pageSize" align="center")
</template>
<style>
.form-inline .f-grow {
  flex-grow: 1;
}
</style>
<script>
import axios from 'axios';
import GrantCard from '~/components/GrantCard';
export default {
  components: {
    GrantCard
  },
  asyncData({ query }) {
    // check if query params
    let results = [];
    let totalResults = 0;
    let myQuery = '';
    let exactMatch = false;
    let matchField = '';
    let loading = false;
    let pageSize = 10;
    let bool = false;
    let stringifiedQuery = '';
    let urlExists = false;
    if (query.q) {
      myQuery = query.q;
      loading = true;
    }
    if (query.matchField) {
      matchField = query.matchField;
    }
    if (query.bool) {
      bool = !!query.bool;
    }
    if (query.stringifiedQuery) {
      stringifiedQuery = query.stringifiedQuery;
    }
    if (query.urlExists === 'true') {
      urlExists = true;
    }
    return {
      query: myQuery,
      totalResults,
      results,
      matchField,
      searched: false,
      currentPage: 1,
      pageSize,
      from: 0,
      loading,
      stringifiedQuery,
      urlExists,
      bool,
      options: [
        { value: '', text: 'Full Text' },
        { value: 'projectDirector', text: 'Director Name' },
        { value: 'institution', text: 'Institution' },
        { value: 'title', text: 'Title' },
        { value: 'fields', text: 'Subject' },
        { value: 'division', text: 'Division' },
        { value: 'program', text: 'Program' }
      ]
    };
  },
  watch: {
    currentPage(val) {
      window.scrollTo(0, 0);
      this.search(this.query, val, this.pageSize);
      this.from = (val - 1) * this.pageSize;
    }
  },
  mounted() {
    if (this.query) {
      this.search(this.query, 1, this.pageSize);
    }
  },
  methods: {
    async callSearch() {
      // called when a search is made manually instead of through a redirect
      if (!this.options.map(x => x.value).includes(this.matchField)) {
        this.matchField = '';
      }
      this.search(this.query, this.currentPage, this.pageSize);
    },
    async search(query, page, pageSize) {
      this.results = [];
      this.loading = true;
      let results = {};
      // If the a field is specified and exact matching is chosen,
      // post a term query to ES

      if (this.matchField) {
        // If exact matching is not chosen, but a field is, use that field
        let body = {
          query: {},
          from: this.from,
          size: this.pageSize
        };

        // This section is to handle boolean, non-string queries
        if (this.bool && (query === 'true' || query === 'false')) {
          if (query === 'true') {
            query = true;
          }
          if (query === 'false') {
            query = false;
          }
          body.query = { term: {} };
          body.query.term[this.matchField] = query;
        } else {
          body.query = { match_phrase: {} };
          body.query.match_phrase[this.matchField] = query;
        }

        // For the specific use-case Jeff mentioned
        if (this.urlExists) {
          console.log('url has to exist!!');
          body = {
            query: {
              bool: {
                must: [
                  { exists: { field: 'products.primaryURL' } },
                  {
                    match_phrase: {}
                  }
                ]
              }
            },
            size: this.pageSize,
            from: this.from
          };
          body.query.bool.must[1].match_phrase[this.matchField] = query;
        }
        results = await axios.post(`http://localhost:8080/api/raw`, body);
      } else {
        // If neither are chosen, do a full text search
        results = await axios.get(
          `http://localhost:8080/api/fulltext?q=${query}&size=${
            this.pageSize
          }&from=${this.from}`
        );
      }
      this.results = results.data.hits.hits;
      this.totalResults = results.data.hits.total;
      let queryParams = {
        q: this.query,
        bool: this.bool,
        from: this.from,
        size: this.size,
        currentPage: this.currentPage,
        matchField: this.matchField,
        urlExists: this.urlExists
      };
      this.$router.push({
        path: this.$route.path,
        query: queryParams
      });

      this.exactMatch = false;
      this.searched = true;
      this.loading = false;
    }
  }
};
</script>
