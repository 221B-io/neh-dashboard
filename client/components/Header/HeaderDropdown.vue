<template>
  <b-nav-item-dropdown right no-caret>
    <template slot="button-content">
      <img src="~static/img/avatars/6.jpg" class="img-avatar" alt="admin@bootstrapmaster.com">
    </template>
    <b-dropdown-header tag="div" class="text-center">
      <strong>Account</strong>
    </b-dropdown-header>
    <b-dropdown-item>
      <i class="fa fa-bell-o"/>Updates
      <b-badge variant="info">{{ itemsCount }}</b-badge>
    </b-dropdown-item>
    <b-dropdown-item>
      <i class="fa fa-envelope-o"/>Messages
      <b-badge variant="success">{{ itemsCount }}</b-badge>
    </b-dropdown-item>
    <b-dropdown-item>
      <i class="fa fa-tasks"/>Tasks
      <b-badge variant="danger">{{ itemsCount }}</b-badge>
    </b-dropdown-item>
    <b-dropdown-item>
      <i class="fa fa-comments"/>Comments
      <b-badge variant="warning">{{ itemsCount }}</b-badge>
    </b-dropdown-item>
    <b-dropdown-header tag="div" class="text-center">
      <strong>Settings</strong>
    </b-dropdown-header>
    <b-dropdown-item>
      <i class="fa fa-user"/>Profile
    </b-dropdown-item>
    <b-dropdown-item>
      <i class="fa fa-wrench"/>Settings
    </b-dropdown-item>
    <b-dropdown-item>
      <i class="fa fa-usd"/>Payments
      <b-badge variant="secondary">{{ itemsCount }}</b-badge>
    </b-dropdown-item>
    <b-dropdown-item>
      <i class="fa fa-file"/>Projects
      <b-badge variant="primary">{{ itemsCount }}</b-badge>
    </b-dropdown-item>
    <b-dropdown-divider/>
    <b-dropdown-item>
      <i class="fa fa-shield"/>Lock Account
    </b-dropdown-item>
    <b-dropdown-item @click="logout">
      <i class="fa fa-lock"/>Logout
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  name: 'HeaderDropdown',
  data: () => {
    return { itemsCount: 42 };
  },
  methods: {
    async logout() {
      try {
        this.$store.dispatch('logout').then(() => {
          this.$router.push('/login');
        });
      } catch (e) {
        this.formError = e.message;
      }
    }
  }
};
</script>
