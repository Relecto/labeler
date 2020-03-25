<template>
<nav class="panel">
  <p class="panel-heading header">
    Selections
  </p>
  <div class="panel-items">
    <a
    v-for="(selection, i) in realSelections"
    :key="i"

    @click="setActiveSelection(i)"

    :class="{'is-active': image.activeSelection == i}"
    class="panel-block">
    <span class="panel-icon">
      <i class="fas fa-vector-square" aria-hidden="true"></i>
    </span>
    <div class="columns is-mobile selection-item">
      <div class="column is-one-third selection-column">
        <p>x: {{selection.x}}</p> <p>y: {{selection.y}}</p>
      </div>
      <div class="column is-narrow selection-column">
        <p>w: {{selection.width}} </p> <p> h: {{selection.height}} </p>
      </div>
      <div class="column selection-column">
        <button @click="removeSelection(i)" class="button is-danger is-outlined is-small">
          <span class="icon">
            <i class="fas fa-times"></i>
          </span>
        </button>
      </div>
    </div>
    
  </a>
  </div>
</nav>

</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
        image: state => state.image,
        // selections: state => state.image.selections
    }),
    ...mapGetters(['realSelections'])
  },
  methods: {
    ...mapMutations(['setActiveSelection', 'removeSelection'])
  }
}
</script>

<style scoped>
.panel {
  background: #ffffff;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-basis: content;
}

.header {
  flex-grow: 0;
}
.panel-items {
  flex-grow: 2;

  overflow-y: scroll;
  overflow-x: hidden;
}

.buttons {
  margin-bottom: 0;
}
.selection-item {
  width: 100%;
}

.selection-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>