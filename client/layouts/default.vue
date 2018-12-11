<template lang="pug">
  .app
    app-header
    .app-body
      sidebar(:nav-items='nav')
      main.main
        breadcrumb(:list='list')
        .container-fluid
          nuxt
    app-footer
</template>

<script>
import nav from './menu';
import {
  Header as AppHeader,
  Sidebar,
  Aside as AppAside,
  Footer as AppFooter,
  Breadcrumb
} from '~/components/';

export default {
  name: 'Full',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },
  data() {
    return {
      nav: nav.items
    };
  },
  computed: {
    name() {
      return this.$route.name;
    },
    list() {
      return this.$route.matched;
    }
  }
};
</script>
