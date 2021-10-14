<template>
  <div class="home">
    <router-link to="/lectures/new">Criar Aula</router-link>

    <update-form itemType="lecture" fetchItemFrom="/lectures" />
  </div>
</template>

<script>
import UpdateForm from '../components/UpdateForm.vue';

export default {
  components: { UpdateForm },
  name: "Lecture",
};
</script>