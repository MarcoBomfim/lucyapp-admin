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
                :disabled="!selectedLevels || !selectedLevels.length"
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
          :value="levels"
          v-model:selection="selectedLevels"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5,10,25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} levels"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
          <h5 class="m-0">Fases</h5>
          <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Pesquisar..." />
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
                @click="editLevel(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning row-buttons"
                @click="confirmDeleteLevel(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="levelDialog"
          :style="{width: '450px'}"
          header="Detalhes da Fase"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Nome</label>
            <InputText
              id="name"
              v-model.trim="level.name"
              required="true"
              autofocus
              :class="{'p-invalid': submitted && !level.name}"
            />
            <small
              class="p-invalid"
              v-if="submitted && !level.name"
            >Name is required.</small>
          </div>
          <div class="field">
            <label for="description">Descrição</label>
            <Textarea
              id="description"
              v-model="level.description"
              required="true"
              rows="3"
              cols="20"
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
              @click="saveLevel"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteLevelDialog"
          :style="{width: '450px'}"
          header="Atenção"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="level"> Você tem certeza que deseja deletar a fase <b>{{level.name}}</b>?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteLevelDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteLevel"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteLevelsDialog"
          :style="{width: '450px'}"
          header="Atenção"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="level"> Você tem certeza que deseja deletar essas fases?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteLevelsDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedLevels"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>

</template>

<script>
import http from "../utils/http-common.js";
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const levels = computed(() => store.state.levels)
    const dispatchSetLevels = (levels) =>  store.dispatch('setLevels', levels)

    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const stateUser = computed(() => JSON.parse(store.state.user))
    const userToken = computed(() => {
      const currentUser = stateUser.value
      return currentUser.token
    })

    return {
      isAuthenticated,
      stateUser,
      levels,
      store,
      userToken,
      dispatchSetLevels
    }
  },
  data() {
    return {
      levelDialog: false,
      deleteLevelDialog: false,
      deleteLevelsDialog: false,
      level: {},
      selectedLevels: null,
      submitted: false,
      filters: {},
    };
  },
  methods: {
    openNew() {
      this.level = {};
      this.submitted = false;
      this.levelDialog = true;
    },
    hideDialog() {
      this.levelDialog = false;
      this.submitted = false;
    },
    async saveLevel() {
      this.submitted = true;
      if (this.level.name.trim()) {
        if (this.level._id) {
          await http.post(`/levels/${this.level._id}`, {
            ...this.level
          }, {
            headers: { 
              'Authorization': `Bearer ${this.userToken}`
            }
          });

          // TODO: Figure out a way of not needing the API call
          //       to update levels after one is created/deleted
          const { data } = await http.get("/levels", {
            headers: {
              'Authorization': `Bearer ${this.userToken}`
            },
          });

          this.dispatchSetLevels(data)

          this.$toast.add({
            severity: "success",
            summary: "Tudo certo!",
            detail: "Fase atualizada",
            life: 3000
          });
        } else {
          await http.post(`/levels`, {
            ...this.level
          }, {
            headers: { 
              'Authorization': `Bearer ${this.userToken  }`
            }
          });

          const { data } = await http.get("/levels", {
            headers: {
              'Authorization': `Bearer ${this.userToken}`
            },
          });
          this.dispatchSetLevels(data)

          this.$toast.add({
            severity: "success",
            summary: "Tudo certo!",
            detail: "Fase criada",
            life: 3000
          });
        }
        this.levelDialog = false;
        this.level = {};
      }
    },
    editLevel(level) {
      this.level = { ...level };
      this.levelDialog = true;
    },
    confirmDeleteLevel(level) {
      this.level = level;
      this.deleteLevelDialog = true;
    },
    async deleteLevel() {
      await http.delete(`/levels/${this.level._id}`, {
        headers: {
          'Authorization': `Bearer ${this.userToken}`
        },
      });

      this.$toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Fase Deletada",
        life: 3000
      });

      const { data } = await http.get("/levels", {
        headers: {
          'Authorization': `Bearer ${this.userToken}`
        },
      });

      this.dispatchSetLevels(data)
      this.level = {};
      this.deleteLevelDialog = false;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteLevelsDialog = true;
    },
    async deleteSelectedLevels() {
      this.levelsToDelete = this.levels.filter(
        val => !this.selectedLevels.includes(val)
      );

      this.levelsToDelete.forEach(async level => {
        await http.delete(`/levels/${level._id}`, {
          headers: {
            'Authorization': `Bearer ${this.userToken}`
          },
        });
      });

      this.deleteLevelsDialog = false;
      this.selectedLevels = null;
      const { data } = await http.get("/levels", {
        headers: {
          'Authorization': `Bearer ${this.userToken}`
        },
      });
      this.dispatchSetLevels(data)

      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Fases Deletadas",
        life: 3000
      });
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
		},
  }
};
</script>

<style scoped lang="scss">
.level-badge {
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
