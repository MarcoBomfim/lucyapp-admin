<template>
    <div v-for="(item, index) in items" :key="index">
        <router-link :to="`${route}/${item._id}`">
            {{ item.name }}
        </router-link>
    </div>
</template>

<script>
export default {
  name: "CardList",
  props: {
      items: Array,
      route: String
  }
};
</script>
