<template>
  <div class="home">
    <div class="form">
      <form @submit.prevent="createStage">
        <label for="name">Nome da etapa</label>
        <input type="text" name="name" id="name" v-model="name"><br>
        <label>Selecione a fase desta etapa</label><br>
        <select name="stages" id="levels-select" v-model="level">
          <option 
            v-for="(level, index) in levels"
            :value="level._id"
            :key="index"
          >
            {{ level.name }}
          </option>
        </select>
        <br><br>
        <button type="submit">Criar etapa</button>
      </form>
    </div> 
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import http from "@/utils/http-common.js";

export default {
  name: "NewStage",
  data() { return { name: '', level: undefined }},
  setup() {
    const state = reactive({ levels: [] });

    onMounted(async () => {
      const { data } = await http.get("/levels");
      state.levels = data;
    });

    return state;
  },
  methods: {
    async createStage () {
      const stageBody = {
        name: this.name, 
        level: this.level
      }

      await http.post("/stages", { ...stageBody })
      this.$router.push('/stages');
    }
  }
};
</script>
