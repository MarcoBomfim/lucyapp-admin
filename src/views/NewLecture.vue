<template>
  <div class="home">
    <div class="form">
      <form @submit.prevent="createLecture">
        <div>Progresso: {{ this.progress }} </div>
        <input v-model="name" placeholder="Nome da aula" /><br>

        <label class="btn btn-default">
          <input type="file" ref="file" @change="selectFile" />
        </label>
        <br>

        <label>Insira o conteúdo de texto da aula</label><br>
        <textarea id="lecture-content" v-model="content"></textarea><br><br>

        <label>Selecione a etapa a qual essa aula pertence</label><br>
        <select name="stages" id="stages-select" v-model="selectedStage ">
          <option 
            v-for="(stage, index) in stages"
            :value="stage"
            :key="index"
          >
            {{ stage.name }}
          </option>
        </select><br>

        <!-- https://bestofvue.com/repo/vueform-multiselect-vuejs-form-select -->
        <label>Selecione os exercícios desta aula</label><br>
        <select name="stages" id="stages-select" v-model="lectureExercises" multiple>
          <option 
            v-for="(exercise, index) in exercises"
            :value="exercise._id"
            :key="index"
          >
            {{ exercise.name }}
          </option>
        </select>

        <br>
        <button type="submit">Criar aula</button>
      </form>
    </div> 
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import UploadService from '@/utils/uploadFilesService';
import http from "@/utils/http-common.js";

export default {
  name: "NewLevel",
  data() {
    return {
      selectedStage: undefined,
      lectureExercises: [],
      content: '',
      progress: 0,
      name: ''
    }
  },
  setup() {
    const state = reactive({
      stages: [],
      exercises: [],
    });

    onMounted(async () => {
      const stagesResponse = await http.get("/stages");
      const exercisesResponse = await http.get("/exercises");

      state.stages = stagesResponse.data;
      state.exercises = exercisesResponse.data;
    });

    return state;
  },
  methods: {
    async createLecture () {
      const { file } = this;
 
      const { data: { fileLink }} = await this.upload(file, file.name)

      const lectureBody = { 
        video: fileLink,
        name: this.name,
        content: this.content,
        stage: this.selectedStage,
        exercises: this.lectureExercises
      }

      // TODO: Content and Stage are not being sent to API
      // TODO: There's fixes on the API to release
      // TODO: Make sure to add all envs necessary on Heroku
      await http.post("/lectures", lectureBody)

      this.$router.push('/lectures')
    },
    selectFile() {
      this.file = this.$refs.file.files[0]; // this.$refs.file.files is a FileList
    },
    async upload(file, fileName) {
      this.progress = 0;

      try {
        const result = await UploadService.upload(file, fileName, (event) => {
          this.progress = Math.round((100 * event.loaded) / event.total);
        });

        return result;
      } catch (err) {
        this.progress = 0;
        this.currentFile = undefined;
        this.selectedFiles = undefined;

        return err;
      }
    },
  }
};
</script>
