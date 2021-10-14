<template>
  <form @submit.prevent="updateItem()">
    <div>
      <label for="name">Nome</label>
      <input v-model="item.name" />
    </div>

    <div v-if="this.isNotLectureNorExercise">
      <label for="media">Mídia</label>
      <div class="item-media">
        <img
          v-if="itemType === 'exercise'"
          :src="item.graph"
          alt=""
          srcset=""
        >
        <video
          v-if="itemType === 'lecture'"
          width="450"
          controls
          :src="this.item.video"
        >
        </video>
      </div>

      <div>
        <label class="btn btn-default">
          <input
            type="file"
            ref="file"
            @change="selectFile"
          />
        </label>
      </div>
    </div>

    <div v-if="this.isNotLectureNorExercise">
      <label>Conteúdo</label>
      <textarea
        id="exercise-content"
        v-model="item.content"
      ></textarea>
    </div>

    <div v-if="this.isNotLectureNorExercise">
      <label>Etapa</label>
      <select
        name="stages"
        id="stages-select"
        v-model="item.stage"
      >
        <option
          v-for="(stage, index) in stages"
          :value="stage._id"
          :key="index"
        >
          {{ stage.name }}
        </option>
      </select>
    </div>

    <div v-if="itemType === 'lecture'">
      <!-- https://bestofvue.com/repo/vueform-multiselect-vuejs-form-select -->
      <label>Exercícios</label>
      <select
        name="stages"
        id="stages-select"
        v-model="item.exercises"
        multiple
      >
        <option
          v-for="(exercise, index) in exercises"
          :value="exercise._id"
          :key="index"
        >
          {{ exercise.name }}
        </option>
      </select>
    </div>

    <button type="submit">Atualizar item</button>
  </form>
</template>

<script>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import UploadService from "@/utils/uploadFilesService";
import http from "@/utils/http-common.js";

export default {
  name: "UpdateForm",
  props: {
    itemType: String,
    fetchItemFrom: String
  },
  data() {
    return {
      progress: 0,
      isNotLectureNorExercise: undefined,
    };
  },
  setup(props) {
    const route = useRoute();
    const state = reactive({ item: {}, stages: [], exercises: [] });

    onMounted(async () => {
      const item = await http.get(`${props.fetchItemFrom}/${route.params.id}`);
      const exercisesResponse =
        props.itemType === "lecture" ? await http.get("/exercises") : [];
      const stagesResponse = await http.get(`/stages`);

      state.item = item.data;
      state.stages = stagesResponse.data;
      state.exercises = exercisesResponse.data;
    });

    return state;
  },
  methods: {
    async updateItem() {
      const { file } = this;

      if (file) {
        const {
          data: { fileLink }
        } = await this.upload(file, file.name);

        const updatedItem =
          this.itemType === "lecture"
            ? { ...this.item, video: fileLink }
            : { ...this.item, graph: fileLink };

        await http.post(`${this.fetchItemFrom}/${this.item._id}`, {
          ...updatedItem
        });

        this.$router.push(`${this.fetchItemFrom}`);
      } else {
        await http.post(`${this.fetchItemFrom}/${this.item._id}`, {
          ...this.item
        });
        this.$router.push(`${this.fetchItemFrom}`);
      }
    },
    selectFile() {
      this.file = this.$refs.file.files[0]; // this.$refs.file.files is a FileList
    },
    async upload(file, fileName) {
      this.progress = 0;

      try {
        const result = await UploadService.upload(file, fileName, event => {
          this.progress = Math.round((100 * event.loaded) / event.total);
        });

        return result;
      } catch (err) {
        this.progress = 0;
        this.currentFile = undefined;
        this.selectedFiles = undefined;

        return err;
      }
    }
  },
  getters: {
    isNotLectureNorExercise: () => {
      return this.itemType !== 'lecture' && this.itemType !== 'exercise'
    }
  }
};
</script>

<style scoped>
.item-media {
  height: 350px;
  width: 350px;
}

.item-media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>