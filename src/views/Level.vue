<template>
  <div class="home">
    <router-link to="/levels/new">Criar Fase</router-link>

    <update-form itemType="level" fetchItemFrom="/levels" />
  </div>
</template>

<script>
import UpdateForm from '../components/UpdateForm.vue';

export default {
  components: { UpdateForm },
  name: "Level",
};
</script>