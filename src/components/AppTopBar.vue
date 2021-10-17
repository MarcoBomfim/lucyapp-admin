<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <!-- <img alt="Logo" src="images/logo-dark.svg" /> -->
      <span>LucyApp Admin</span>
    </router-link>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true
      }"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li>
        <button @click="logout" class="p-link layout-topbar-button">
          <i class="pi pi-sign-out"></i>
          <span>Settings</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AppTopBar",
  methods: {
    onMenuToggle(event) {
      this.$emit("menu-toggle", event);
    },
    onTopbarMenuToggle(event) {
      this.$emit("topbar-menu-toggle", event);
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
};
</script>
