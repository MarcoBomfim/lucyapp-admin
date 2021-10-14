<template>
  <div class="home">
    <div class="form">
      <form @submit.prevent="createLevel">
        <label for="name">Nome da fase</label>
        <input type="text" name="name" id="name" v-model="name"><br>
        <label>Selecione as etapas do nível (opcional)</label><br>
        <select name="stages" id="stages-select" multiple>
          <option 
            v-for="(stage, index) in stages"
            :value="stage._id"
            :key="index"
          >
            {{ stage.name }}
          </option>
        </select>
        <br>
        <button type="submit">Criar nível</button>
      </form>
    </div> 
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import http from "@/utils/http-common.js";

export default {
  name: "NewLevel",
  data() {
    return { name: '' }
  },
  setup() {
    const state = reactive({ stages: [] });

    onMounted(async () => {
      const { data } = await http.get("/stages");
      state.stages = data;
    });

    return state;
  },
  methods: {
    async createLevel () {
      const levelBody = {
        name: this.name,
        stages: this.stages.map(stage => stage._id)
      }

      await http.post("/levels", { ...levelBody })
      this.$router.push('/levels')
    }
  }
};
</script>
