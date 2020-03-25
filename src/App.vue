<template>
  <div id="app" class="columns is-gapless">
    <div class="column is-one-fifth">
      <div class="aside">
        <div class="dataset-container">
          <Dataset>
          </Dataset>
        </div>
        <div class="categories-container">
          <Categories>
          </Categories>
        </div>
        <div class="selections-container">
          <Selections>
          </Selections>
        </div>
      </div>
    </div>

    <div class="column">
      <Canvas v-if="currentImage" :key="currentImage" :image="currentImage"></Canvas>
    </div>
  </div>
</template>

<script>
import NativeCanvas from './components/NativeCanvas.vue'
import Dataset from './components/Dataset.vue'
import Selections from './components/Selections.vue'
import Categories from "./components/Categories.vue";

export default {
  name: 'App',
  components: {
    // HelloWorld,
    Canvas: NativeCanvas,
    Dataset,
    Selections,
    Categories,
  },
  computed: {
    currentImage() {
      return this.$store.state.image.path
    },
  },
  mounted() {
    this.$store.dispatch('fetchImages')
    this.$store.dispatch('fetchCategories')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%; 
  height: 100%;
  overflow: hidden;
  /* font-size: 1rem; */
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
/* 
  display: flex;  
  box-sizing: border-box; */
}

.aside {
  display: flex;
  flex-direction: column;

  height: 100%;
}
.dataset-container {
  max-height: 30%;
  flex-grow: 1;
}
.categories-container {
  max-height: 25%;
  flex-grow: 1;
}
.selections-container {
  max-height: 45%;
  flex-grow: 1;
}

html, body {
  width: 100%; 
  height: 100%;
  overflow: hidden;  /*makes the body non-scrollable (we will add scrolling to the sidebar and main content containers)*/
  margin: 0px;  /*removes default style*/

  user-select: none;

}

</style>
