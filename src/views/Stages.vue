<template>
  <div class="home">
    <router-link to="/stages/new">Criar etapa</router-link>

    <card-list :items="stages" route="/stages" />
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue';
import http from "@/utils/http-common.js";
import CardList from '../components/CardList.vue';

export default {
  components: { CardList },
  name: "Levels",
  setup() {
    const state = reactive({
      stages: [],
    });

    onMounted(async () => {
      const { data } = await http.get("/stages");
      state.stages = data;
    });

    return state;
  },
};
</script>
