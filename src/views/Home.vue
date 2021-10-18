<template>
  <div v-if="isAuthenticated" class="home">
    <h1>LucyApp admin</h1>
    <p>Olá {{ stateUser.user.name }}</p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: "Home",
  setup() {
    const store = useStore()
    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const stateUser = computed(() => JSON.parse(store.state.user))

    return {
      isAuthenticated,
      stateUser
    }
  },
};
</script>
