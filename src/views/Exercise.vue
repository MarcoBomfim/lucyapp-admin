<template>
  <div class="home">
    <router-link to="/exercises/new">Criar exercício</router-link>

    <update-form itemType="exercise" fetchItemFrom="/exercises" />
  </div>
</template>

<script>
import UpdateForm from '../components/UpdateForm.vue';

export default {
  components: { UpdateForm },
  name: "Exercise",
};
</script>
