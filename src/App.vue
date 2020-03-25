<template>
  <div id="app" class="columns is-gapless">
    <div class="column is-one-fifth">
      <Dataset>
      </Dataset>
      <Categories>
      </Categories>
      <Selections>
      </Selections>
    </div>

    <div class="column">
      <Canvas v-if="currentImage" :key="currentImage" :image="currentImage"></Canvas>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
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

.panel-container {
  position: fixed;
  margin: 1vh;
  max-width: 25vw;
  min-width: 250px;
 /* overflow-y: scroll; */
  z-index: 10; 
}

.selections-container {
  position: fixed;
  margin-right: 1vh;
  margin-top: 1vh;
  max-width: 25vw;
  min-width: 250px;
 /* overflow-y: scroll; */
  z-index: 10; 
}

html, body {
  width: 100%; 
  height: 100%;
  overflow: hidden;  /*makes the body non-scrollable (we will add scrolling to the sidebar and main content containers)*/
  margin: 0px;  /*removes default style*/

  user-select: none;

}

</style>
