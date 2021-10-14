<template>
  <div class="home">
    <div class="form">
      <create-form itemType="exercise" fetchItemFrom="/exercises"/>
    </div> 
  </div>
</template>

<script>
import CreateForm from "@/components/CreateForm.vue";

export default {
  name: "NewLevel",
  components: { CreateForm },
};
</script>
