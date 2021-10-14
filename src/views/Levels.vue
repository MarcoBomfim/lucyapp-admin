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
            <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
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
          <!-- <Column field="description" header="Descrição" :sortable="false">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.description}}
						</template>
					</Column> -->
          <!-- <Column field="stages" header="Etapas da fase" :sortable="false">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{ slotProps.data.stages || []}}
						</template>
					</Column> -->
          <!-- <Column header="Image">
						<template #body="slotProps">
							<span class="p-column-title">Image</span>
							<img :src="'images/level/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />
						</template>
					</Column> -->
          <!-- <Column field="price" header="Price" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Price</span>
							{{formatCurrency(slotProps.data.price)}}
						</template>
					</Column> -->
          <!-- <Column field="category" header="Category" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Category</span>
							{{formatCurrency(slotProps.data.category)}}
						</template>
					</Column> -->
          <!-- <Column field="rating" header="Reviews" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Rating</span>
							<Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
						</template>
					</Column> -->
          <!-- <Column field="inventoryStatus" header="Status" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Status</span>
							<span :class="'level-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{slotProps.data.inventoryStatus}}</span>
						</template>
					</Column> -->
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
          <!-- <img :src="'images/level/' + level.image" :alt="level.image" v-if="level.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
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

          <!-- <div class="field">
						<label for="inventoryStatus" class="mb-3">Inventory Status</label>
						<Dropdown id="inventoryStatus" v-model="level.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
							<template #value="slotProps">
								<div v-if="slotProps.value && slotProps.value.value">
									<span :class="'level-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
								</div>
								<div v-else-if="slotProps.value && !slotProps.value.value">
									<span :class="'level-badge status-' +slotProps.value.toLowerCase()">{{slotProps.value}}</span>
								</div>
								<span v-else>
									{{slotProps.placeholder}}
								</span>
							</template>
						</Dropdown>
					</div> -->

          <!-- <div class="field">
						<label class="mb-3">Category</label>
						<div class="formgrid grid">
							<div class="field-radiobutton col-6">
								<RadioButton id="category1" name="category" value="Accessories" v-model="level.category" />
								<label for="category1">Accessories</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="category2" name="category" value="Clothing" v-model="level.category" />
								<label for="category2">Clothing</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="category3" name="category" value="Electronics" v-model="level.category" />
								<label for="category3">Electronics</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="category4" name="category" value="Fitness" v-model="level.category" />
								<label for="category4">Fitness</label>
							</div>
						</div>
					</div> -->

          <!-- <div class="formgrid grid">
						<div class="field col">
							<label for="price">Price</label>
							<InputNumber id="price" v-model="level.price" mode="currency" currency="USD" locale="en-US" />
						</div>
						<div class="field col">
							<label for="quantity">Quantity</label>
							<InputNumber id="quantity" v-model="level.quantity" integeronly />
						</div>
					</div> -->
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

export default {
  data() {
    return {
      levels: null,
      levelDialog: false,
      deleteLevelDialog: false,
      deleteLevelsDialog: false,
      level: {},
      selectedLevels: null,
      submitted: false,
      filters: {}
    };
  },
  async mounted() {
    const { data } = await http.get("/levels");
    this.levels = data;
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
          });

          const { data } = await http.get("/levels");
          this.levels = data;

          this.$toast.add({
            severity: "success",
            summary: "Tudo certo!",
            detail: "Fase atualizada",
            life: 3000
          });
        } else {
          await http.post(`/levels`, {
            ...this.level
          });

          const { data } = await http.get("/levels");
          this.levels = data;

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
      await http.delete(`/levels/${this.level._id}`);

      this.$toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Fase Deletada",
        life: 3000
      });

      const { data } = await http.get("/levels");

      this.levels = data;
      this.level = {};
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
        await http.delete(`/levels/${level._id}`);
      });

      this.deleteLevelsDialog = false;
      this.selectedLevels = null;
      const { data } = await http.get("/levels");
      this.levels = data;

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
