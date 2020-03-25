<template>
<nav class="panel">
  <p class="panel-heading header">
    Dataset
  </p>
  <p class="panel-tabs header">
    <a class="is-active">All</a>
    <a>Image</a>
    <a>Dataset</a>
    <a>Host</a>
  </p>
  <div class="panel-items">
    <a
    v-for="path in images"
    :key="path"

    @click="$store.dispatch('fetchImage', path)"

    :class="{'is-active': image.path == path}"
    class="panel-block">
    <span class="panel-icon">
      <i class="fas fa-file-image" aria-hidden="true"></i>
    </span>
    {{path}}
  </a>
  </div>
</nav>

</template>

<script>
// import ImageListItem from './ImageListItem.vue'
import { mapState } from 'vuex'

export default {
  // components: { ImageListItem },
  computed: {
    ...mapState(['image', 'images'])
  }
}
</script>

<style scoped>
.panel {
  background: #ffffff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  flex-grow: 0;
}
.panel-items {
  flex-grow: 2;

  overflow-y: scroll;
  overflow-x: hidden;
}
</style>