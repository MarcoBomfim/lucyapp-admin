<template>
  <div class="home">
    <router-link to="/exercises/new">Criar exercício</router-link>

    <card-list :items="exercises" route="/exercises" />
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import http from "@/utils/http-common.js";
import CardList from '@/components/CardList.vue'

export default {
  name: "Exercises",
  components: { CardList },
  setup() {
    const state = reactive({ exercises: [] });

    onMounted(async () => {
      const { data } = await http.get("/exercises");
      state.exercises = data;
    });

    return state;
  },
};
</script>
