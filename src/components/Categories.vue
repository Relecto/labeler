<template>
<nav class="panel">
  <p class="panel-heading">
    Categories
  </p>
  <div class="category-list">
    <a
    v-for="(category, i) in categories"
    :key="i"

    @click="setActiveCategory(i)"

    :class="{'has-text-weight-bold': activeCategory == i, 'is-active': activeCategory == i}"
    class="panel-block"
    >
    
    <span :style="{ color: palette[i] }" class="panel-icon">
      <i class="fas fa-square" aria-hidden="true"></i>
    </span>
    {{category}}
  </a>
  </div>
</nav>

</template>

<script>
// import ImageListItem from './ImageListItem.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  // components: { ImageListItem },
  computed: {
    ...mapState(['categories', 'activeCategory', 'palette'])
  },
  methods: {
    ...mapMutations(['setActiveCategory'])
  }
}
</script>

<style scoped>
.panel {
  background: #ffffff;
}
.category-list {
  max-height: 20vh;
  min-height: 200px;
  overflow: scroll;
}
</style>