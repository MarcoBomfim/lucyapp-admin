<template>
  <div class="home">
    <h1>LucyApp admin</h1>
    <h3 v-if="$auth.isAuthenticated" class="is-size-3 has-background-dark welcome">Logado como: {{ userName }}!</h3>
  </div>
</template>

<script>
export default {
  name: "Home",
  computed: {
    userName () {
      // Because of Vue3 reactivity, we need to get the Proxy's value
      const user = this.$auth.user.value;
      return user.name;
    }
  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
};
</script>
