<template>
  <div class="home">
    <router-link to="/stages/new">Criar Fase</router-link>

    <update-form itemType="stage" fetchItemFrom="/stages" />
  </div>
</template>

<script>
import UpdateForm from '../components/UpdateForm.vue';

export default {
  components: { UpdateForm },
  name: "Stage",
};
</script>