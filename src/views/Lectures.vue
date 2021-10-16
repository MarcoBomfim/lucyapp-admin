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
                :disabled="!selectedLectures || !selectedLectures.length"
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
          :value="lectures"
          v-model:selection="selectedLectures"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5,10,25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} lectures"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Aulas</h5>
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
          <Column
            field="description"
            header="Descrição"
            :sortable="true"
          >
            <template #body="slotProps">
              <span class="p-column-title">Descrição</span>
              {{slotProps.data.description}}
            </template>
          </Column>
          <Column>
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success row-buttons"
                @click="editLecture(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning row-buttons"
                @click="confirmDeleteLecture(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="lectureDialog"
          :style="{width: '450px'}"
          header="Detalhes da Aula"
          :modal="true"
          class="p-fluid"
        >   
          <div class="field">
            <div class="video-container">
              <video
                v-if="lecture.video"
                width="250"
                height="250"
                controls
                :src="lecture.video"
                class="video"
              ></video> 
            </div>
            <div>
              <label for="video">Vídeo</label>
              <FileUpload
                mode="basic"
                name="video[]" 
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
              v-model.trim="lecture.name"
              required="true"
              autofocus
              :class="{'p-invalid': submitted && !lecture.name}"
            />
            <small
              class="p-invalid"
              v-if="submitted && !lecture.name"
            >Name is required.</small>
          </div>
          <div class="field">
            <label for="description">Conteúdo</label>
            <Textarea
              id="description"
              v-model="lecture.content"
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
              @click="saveLecture"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteLectureDialog"
          :style="{width: '450px'}"
          header="Atenção"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="lecture"> Você tem certeza que deseja deletar a aula <b>{{lecture.name}}</b>?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteLectureDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteLecture"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteLecturesDialog"
          :style="{width: '450px'}"
          header="Atenção"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="lecture"> Você tem certeza que deseja deletar essas aulas?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteLecturesDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedLectures"
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
      lectures: null,
      levels: null,
      uploading: false,
      selectedStage: null,
      lectureDialog: false,
      deleteLectureDialog: false,
      deleteLecturesDialog: false,
      lecture: {},
      selectedLectures: null,
      submitted: false,
      filters: {}
    };
  },
  async mounted() {
    const lecturesResponse = await http.get("/lectures");
    const stagesResponse = await http.get("/stages");

    this.lectures = lecturesResponse.data;
    this.stages = stagesResponse.data;
  },
  methods: {
    openNew() {
      this.lecture = {};
      this.submitted = false;
      this.lectureDialog = true;
    },
    hideDialog() {
      this.lectureDialog = false;
      this.submitted = false;
    },
    async uploadFiles(event) {
      try {
        this.uploading = true;
        const file = event.files[0];

        const result = await UploadService.upload(file, file.name);
        this.$toast.add({severity: 'info', summary: 'Success', detail: `${result.data.s3_key} uploaded to ${result.data.fileLink}`, life: 5000});

        // Set video URL to payload
        this.lecture.video = result.data.fileLink;

        this.uploading = false;
      } catch (err) {
        return err;
      }
    },
    async saveLecture() {
      this.submitted = true;
      if (this.lecture.name.trim()) {
        if (this.lecture._id) {
          await http.post(`/lectures/${this.lecture._id}`, {
            ...this.lecture,
            stage: this.selectedStage
          });

          const { data } = await http.get("/lectures");
          this.lectures = data;

          this.$toast.add({
            severity: "success",
            summary: "Tudo certo!",
            detail: "Aula atualizada",
            life: 3000
          });
          this.hideDialog();
        } else {
          await http.post(`/lectures`, {
            ...this.lecture,
            stage: this.selectedStage
          });

          const { data } = await http.get("/lectures");
          this.lectures = data;

          this.$toast.add({
            severity: "success",
            summary: "Tudo certo!",
            detail: "Aula criada",
            life: 3000
          });
        }
        this.hideDialog();
        this.lecture = {};
      }
    },
    editLecture(lecture) {
      this.lecture = { ...lecture };
      this.lectureDialog = true;
    },
    confirmDeleteLecture(lecture) {
      this.lecture = lecture;
      this.deleteLectureDialog = true;
    },
    async deleteLecture() {
      await http.delete(`/lectures/${this.lecture._id}`);

      this.$toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Aula Deletada",
        life: 3000
      });

      const { data } = await http.get("/lectures");

      this.lectures = data;
      this.lecture = {};
      this.hideDialog();
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteLecturesDialog = true;
    },
    async deleteSelectedLectures() {
      this.lecturesToDelete = this.lectures.filter(
        val => !this.selectedLectures.includes(val)
      );

      this.lecturesToDelete.forEach(async lecture => {
        await http.delete(`/lectures/${lecture._id}`);
      });

      this.deleteLecturesDialog = false;
      this.selectedLectures = null;
      const { data } = await http.get("/lectures");
      this.lectures = data;

      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Aulas Deletadas",
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
.lecture-badge {
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
