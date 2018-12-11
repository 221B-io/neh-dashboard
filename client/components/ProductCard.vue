<template lang="pug">
.card
  .card-body
    h5.card-title {{ p.title[0] }}
    p.card-text
      span(v-for="key in Object.keys(p)" :key="key" v-if="!blacklist.includes(key)")
        | <strong>{{ key }}</strong>: {{ p[key] }}<br>
    p.card-text(v-if="p.primaryURL && p.primaryURLRoot") Source: <a :href="p.primaryURL">{{ p.primaryURLRoot}}</a>
    p.card-text(v-if="p.secondaryURL && p.secondaryURLRoot") Secondary Source: <a :href="p.secondaryURL">{{ p.secondaryURLRoot}}</a>
</template>

<style>
</style>
<script>
export default {
  props: {
    p: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      blacklist: [
        'title',
        'primaryURLRoot',
        'primaryURLResolves',
        'primaryURLDescription',
        'primaryURL',
        'grantId'
      ]
    };
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
