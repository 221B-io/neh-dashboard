<template>
  <router-link :to="url" tag="li" disabled class="nav-item nav-dropdown">
    <div class="nav-link nav-dropdown-toggle" @click="handleClick">
      <i :class="icon"/>
      {{ name }}
    </div>
    <ul class="nav-dropdown-items">
      <slot/>
    </ul>
  </router-link>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick(e) {
      e.preventDefault();
      e.target.parentElement.classList.toggle('open');
    }
  }
};
</script>
