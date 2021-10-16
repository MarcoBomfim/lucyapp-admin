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
                :disabled="!selectedStages || !selectedStages.length"
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
          :value="stages"
          v-model:selection="selectedStages"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5,10,25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} stages"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Fases</h5>
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
                @click="editStage(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning row-buttons"
                @click="confirmDeleteStage(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="stageDialog"
          :style="{width: '450px'}"
          header="Detalhes da Fase"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Nome</label>
            <InputText
              id="name"
              v-model.trim="stage.name"
              required="true"
              autofocus
              :class="{'p-invalid': submitted && !stage.name}"
            />
            <small
              class="p-invalid"
              v-if="submitted && !stage.name"
            >Name is required.</small>
          </div>
          <div class="field">
            <label for="description">Descrição</label>
            <Textarea
              id="description"
              v-model="stage.description"
              required="true"
              rows="3"
              cols="20"
            />
          </div>
          <div class="field">
            <label for="level">Fase</label>
            <Dropdown
              v-model="selectedLevel"
              :options="levels"
              optionLabel="name"
              placeholder="Selecione a fase desta etapa"
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
              @click="saveStage"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteStageDialog"
          :style="{width: '450px'}"
          header="Atenção"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="stage"> Você tem certeza que deseja deletar a fase <b>{{stage.name}}</b>?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteStageDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteStage"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteStagesDialog"
          :style="{width: '450px'}"
          header="Atenção"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="stage"> Você tem certeza que deseja deletar essas fases?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteStagesDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedStages"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>

</template>

<script>
import http from "../utils/http-common.js";

export default {
  data() {
    return {
      stages: null,
      levels: null,
      selectedLevel: null,
      stageDialog: false,
      deleteStageDialog: false,
      deleteStagesDialog: false,
      stage: {},
      selectedStages: null,
      submitted: false,
      filters: {}
    };
  },
  async mounted() {
    const stagesResponse = await http.get("/stages");
    const levelsResponse = await http.get("/levels");

    this.stages = stagesResponse.data;
    this.levels = levelsResponse.data;
  },
  methods: {
    openNew() {
      this.stage = {};
      this.submitted = false;
      this.stageDialog = true;
    },
    hideDialog() {
      this.stageDialog = false;
      this.submitted = false;
    },
    async saveStage() {
      this.submitted = true;
      if (this.stage.name.trim()) {
        if (this.stage._id) {
          await http.post(`/stages/${this.stage._id}`, {
            ...this.stage,
            level: this.selectedLevel
          });

          const { data } = await http.get("/stages");
          this.stages = data;

          this.$toast.add({
            severity: "success",
            summary: "Tudo certo!",
            detail: "Fase atualizada",
            life: 3000
          });
          this.hideDialog();
        } else {
          await http.post(`/stages`, {
            ...this.stage,
            level: this.selectedLevel
          });

          const { data } = await http.get("/stages");
          this.stages = data;

          this.$toast.add({
            severity: "success",
            summary: "Tudo certo!",
            detail: "Fase criada",
            life: 3000
          });
        }
        this.hideDialog();
        this.stage = {};
      }
    },
    editStage(stage) {
      this.stage = { ...stage };
      this.stageDialog = true;
    },
    confirmDeleteStage(stage) {
      this.stage = stage;
      this.deleteStageDialog = true;
    },
    async deleteStage() {
      await http.delete(`/stages/${this.stage._id}`);

      this.$toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Fase Deletada",
        life: 3000
      });

      const { data } = await http.get("/stages");

      this.stages = data;
      this.stage = {};
      this.hideDialog();
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteStagesDialog = true;
    },
    async deleteSelectedStages() {
      this.stagesToDelete = this.stages.filter(
        val => !this.selectedStages.includes(val)
      );

      this.stagesToDelete.forEach(async stage => {
        await http.delete(`/stages/${stage._id}`);
      });

      this.deleteStagesDialog = false;
      this.selectedStages = null;
      const { data } = await http.get("/stages");
      this.stages = data;

      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Fases Deletadas",
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
.stage-badge {
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
</style>