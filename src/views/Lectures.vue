<template>
  <div class="home">
    <router-link to="/lectures/new">Criar Aula</router-link>

    <card-list :items="lectures" route="/lectures" />
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import http from "@/utils/http-common.js";
import CardList from '@/components/CardList';

export default {
  name: "Lectures",
  components: {
    CardList
  },
  setup() {
    const state = reactive({ lectures: [] });

    onMounted(async () => {
      const { data } = await http.get("/lectures");
      state.lectures = data;
    });

    return state;
  },
};
</script>
