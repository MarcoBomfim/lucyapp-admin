<template>
  <div class="grid crud-demo">
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template v-slot:left>
            <div class="my-2">
              <Button
                label="Criar"
                icon="pi pi-plus"
                class="p-button-success mr-2 top-left-buttons"
                @click="openNew"
              />
              <!-- <Button
                label="Excluir"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="confirmDeleteSelected"
                :disabled="!selectedExercises || !selectedExercises.length"
              /> -->
            </div>
          </template>

          <template v-slot:right>
            <Button
              label="Exportar para .CSV"
              icon="pi pi-upload"
              class="p-button-help"
              @click="exportCSV($event)"
            />
          </template>
        </Toolbar>

        <DataTable
          ref="dt"
          :value="exercises"
          v-model:selection="selectedExercises"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5,10,25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} exercises"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Exercícios</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global']"
                  placeholder="Pesquisar..."
                />
              </span>
            </div>
          </template>

          <!-- <Column
            selectionMode="multiple"
            headerStyle="width: 3rem"
          ></Column> -->
          <Column
            field="_id"
            header="ID"
            :sortable="true"
          >
            <template #body="slotProps">
              <span class="p-column-title">ID</span>
              {{slotProps.data._id}}
            </template>
          </Column>
          <Column
            field="name"
            header="Name"
            :sortable="true"
          >
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{slotProps.data.name}}
            </template>
          </Column>
<!--           <Column
            field="description"
            header="Descrição"
            :sortable="true"
          >
            <template #body="slotProps">
              <span class="p-column-title">Descrição</span>
              {{slotProps.data.description}}
            </template>
          </Column>
 -->          <Column>
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success row-buttons"
                @click="editExercise(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning row-buttons"
                @click="confirmDeleteExercise(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="exerciseDialog"
          :style="{width: '450px'}"
          header="Detalhes da Exercício"
          :modal="true"
          class="p-fluid"
        >   
          <div class="field">
            <div class="video-container">
              <Image width="250" height="250" v-if="exercise.graph" :src="exercise.graph" />
            </div>
            <div>
              <label for="video">Gráfico do exercício</label>
              <FileUpload
                mode="basic"
                name="graph[]" 
                :customUpload="true" 
                @uploader="uploadFiles" 
              />
            </div>
          </div>
          <ProgressBar v-show="uploading === true" mode="indeterminate" class="progress-bar" /> 
          <div class="field">
            <label for="name">Nome</label>
            <InputText
              id="name"
              v-model.trim="exercise.name"
              required="true"
              autofocus
              :class="{'p-invalid': submitted && !exercise.name}"
            />
            <small
              class="p-invalid"
              v-if="submitted && !exercise.name"
            >Name is required.</small>
          </div>
          <div class="field">
            <label for="description">Conteúdo</label>
            <Textarea
              id="description"
              v-model="exercise.content"
              required="true"
              rows="3"
              cols="20"
            />
          </div>
          <div class="field">
            <label for="level">Etapa</label>
            <Dropdown
              v-model="selectedStage"
              :options="stages"
              optionLabel="name"
              placeholder="Selecione a etapa desta aula"
            />
          </div>

          <template #footer>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              class="p-button-text"
              @click="hideDialog"
            />
            <Button
              label="Salvar"
              icon="pi pi-check"
              class="p-button-text"
              @click="saveExercise"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteExerciseDialog"
          :style="{width: '450px'}"
          header="Atenção"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="exercise"> Você tem certeza que deseja deletar a exercício <b>{{exercise.name}}</b>?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteExerciseDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteExercise"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteExercisesDialog"
          :style="{width: '450px'}"
          header="Atenção"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="exercise"> Você tem certeza que deseja deletar essas exercícios?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteExercisesDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedExercises"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>

</template>

<script>
import UploadService from '../utils/uploadFilesService';
import http from "../utils/http-common.js";

export default {
  data() {
    return {
      exercises: null,
      levels: null,
      uploading: false,
      selectedStage: null,
      exerciseDialog: false,
      deleteExerciseDialog: false,
      deleteExercisesDialog: false,
      exercise: {},
      selectedExercises: null,
      submitted: false,
      filters: {},
      userToken: null
    };
  },
  async mounted() {
    this.userToken = await this.$auth.getTokenSilently();
    const exercisesResponse = await http.get("/exercises", {
      headers: {
        'Authorization': `Bearer ${this.userToken}`
      },
    });
    const stagesResponse = await http.get("/stages", {
      headers: {
        'Authorization': `Bearer ${this.userToken}`
      },
    });

    this.exercises = exercisesResponse.data;
    this.stages = stagesResponse.data;
  },
  methods: {
    openNew() {
      this.exercise = {};
      this.submitted = false;
      this.exerciseDialog = true;
    },
    hideDialog() {
      this.exerciseDialog = false;
      this.submitted = false;
    },
    async uploadFiles(event) {
      try {
        this.uploading = true;
        const file = event.files[0];

        const result = await UploadService.upload(file, file.name);
        this.$toast.add({severity: 'info', summary: 'Success', detail: `${result.data.s3_key} uploaded to ${result.data.fileLink}`, life: 5000});

        // Set image URL to payload
        this.exercise.graph = result.data.fileLink;

        this.uploading = false;
      } catch (err) {
        return err;
      }
    },
    async saveExercise() {
      this.submitted = true;
      if (this.exercise.name.trim()) {
        if (this.exercise._id) {
          await http.post(`/exercises/${this.exercise._id}`, {
            ...this.exercise,
            stage: this.selectedStage
          }, {
            headers: {
              'Authorization': `Bearer ${this.userToken}`
            },
          });

          const { data } = await http.get("/exercises", {
            headers: {
              'Authorization': `Bearer ${this.userToken}`
            },
          });
          this.exercises = data;

          this.$toast.add({
            severity: "success",
            summary: "Tudo certo!",
            detail: "Exercício atualizada",
            life: 3000
          });
          this.hideDialog();
        } else {
          await http.post(`/exercises`, {
            ...this.exercise,
            stage: this.selectedStage
          }, {
            headers: {
              'Authorization': `Bearer ${this.userToken}`
            },
          });

          const { data } = await http.get("/exercises", {
            headers: {
              'Authorization': `Bearer ${this.userToken}`
            },
          });
          this.exercises = data;

          this.$toast.add({
            severity: "success",
            summary: "Tudo certo!",
            detail: "Exercício criada",
            life: 3000
          });
        }
        this.hideDialog();
        this.exercise = {};
      }
    },
    editExercise(exercise) {
      this.exercise = { ...exercise };
      this.exerciseDialog = true;
    },
    confirmDeleteExercise(exercise) {
      this.exercise = exercise;
      this.deleteExerciseDialog = true;
    },
    async deleteExercise() {
      await http.delete(`/exercises/${this.exercise._id}`, {
        headers: {
          'Authorization': `Bearer ${this.userToken}`
        },
      });

      this.$toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Exercício Deletada",
        life: 3000
      });

      const { data } = await http.get("/exercises", {
        headers: {
          'Authorization': `Bearer ${this.userToken}`
        },
      });

      this.exercises = data;
      this.exercise = {};
      this.hideDialog();
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteExercisesDialog = true;
    },
    async deleteSelectedExercises() {
      this.exercisesToDelete = this.exercises.filter(
        val => !this.selectedExercises.includes(val)
      );

      this.exercisesToDelete.forEach(async exercise => {
        await http.delete(`/exercises/${exercise._id}`, {
          headers: {
            'Authorization': `Bearer ${this.userToken}`
          },
        });
      });

      this.deleteExercisesDialog = false;
      this.selectedExercises = null;
      const { data } = await http.get("/exercises", {
        headers: {
          'Authorization': `Bearer ${this.userToken}`
        },
      });
      this.exercises = data;

      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Exercícios Deletadas",
        life: 3000
      });

      this.hideDialog();
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    }
  }
};
</script>

<style scoped lang="scss">
.exercise-badge {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;

  &.status-instock {
    background: #c8e6c9;
    color: #256029;
  }

  &.status-outofstock {
    background: #ffcdd2;
    color: #c63737;
  }

  &.status-lowstock {
    background: #feedaf;
    color: #8a5340;
  }
}
.top-left-buttons {
  margin-right: 15px;
}
.row-buttons {
  margin-right: 15px;
}
.progress-bar {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}
.video-container {
  display: flex;
  justify-content: center;
}
</style>
