<template>
  <!-- <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" id="imageCanvas"></canvas> -->
  <div class="canvas">
    <div ref="container" class="canvas-container">
      <img 
        ref="image" 
        class="image" 
        :src="'/img/' + image"

        draggable="false"

        @load="onImageLoad"
      />
      <CanvasSelection
        v-for="(rect, i) in rects"
        :key="i"

        :active="i == activeSelection"
        :x="rect.x"
        :y="rect.y"
        :width="rect.width"
        :height="rect.height"
        :color="rect.color"

        @mousedown="selectionMouseDown(i)"
        @resizestart="resizeStart(i, arguments[0])"
      >
      </CanvasSelection>
      <div 
        class="canvas-overlay"
        @mousedown="overlayMouseDown"
      ></div>
    </div>
  </div>

</template>

<script>
import CanvasSelection from './CanvasSelection.vue'
import { mapState, mapMutations } from 'vuex'

// Minimal selection size
const MIN_SIZE = 10

export default {
  components: {
    CanvasSelection
  },
  props: {
    image: String
  },
  data() {
    return {
      // canvas: null,
      // ctx: null,
      // selections: [], 
      // activeSelection: null,
    }
  },
  computed: {
    ...mapState({
      selections: state => state.image.selections,
      rects: state => state.image.selections.map(s => {
        return {
          color: state.palette[state.categories.indexOf(s.category)],
          ...s.client
        }
      }),
      activeSelection: state => state.image.activeSelection,
      categories: state => state.categories,
      activeCategory: state => state.activeCategory,
      palette: state => state.palette,
    }),
    active() {
      return this.$store.getters.active
    }
  },
  beforeDestroy() {
    window.addEventListener('resize', this.resize)
  },
  mounted() {
    window.addEventListener('resize', this.resize)
  },
  methods: {
    ...mapMutations([
      'setActiveSelection',
      'addSelection',
      'removeSelection',
      'setSelection',
      'setImageDimensions',
      'setCanvasDimensions'
    ]),
    resize() {
      let { width, height } = this.$refs.container.getBoundingClientRect()
      this.setCanvasDimensions({ width, height })
    },
    onImageLoad() {
      let { naturalWidth, naturalHeight } = this.$refs.image
      let { width, height } = this.$refs.container.getBoundingClientRect()

      this.setImageDimensions({ width: naturalWidth, height: naturalHeight})
      this.setCanvasDimensions({ width, height })
    },
    overlayMouseDown(e) {
      if (this.activeCategory === null) {
        return
      }
      let selection = {
        startX: e.layerX,
        startY: e.layerY,
        category: this.categories[this.activeCategory]
      }
      
      this.addSelection(selection)
      this.setActiveSelection(this.selections.length - 1)

      document.addEventListener('mousemove', this.overlayMouseMove)
      document.addEventListener('mouseup', this.overlayMouseUp)

      this.drawing = true

      return false
    },
    overlayMouseUp() {
      this.drawing = false

      let rect = this.active.real

      if (!rect.width && !rect.height || 
          rect.width < MIN_SIZE || rect.height < MIN_SIZE) {
        this.removeSelection(this.selections.length - 1)
        this.setActiveSelection(null)
      }

      document.removeEventListener('mousemove', this.overlayMouseMove)
      document.removeEventListener('mouseup', this.overlayMouseUp)
    }, 
    overlayMouseMove(e) {
      if (!this.drawing) {
        return 
      }

      const container = this.$refs.container.getBoundingClientRect()
      let mouseX = e.clientX - container.left;
      let mouseY = e.clientY - container.top;

      // constrain to container size
      if (mouseX > container.width) {
        mouseX = container.width
      }
      if (mouseX < 0) {
        mouseX = 0
      }
      if (mouseY > container.height) {
        mouseY = container.height
      }
      if (mouseY < 0) {
        mouseY = 0
      }

      let rect = this.active

      let width = mouseX - rect.startX
      let height = mouseY - rect.startY 

      let x = width > 0 ? rect.startX : rect.startX + width
      let y = height > 0 ? rect.startY : rect.startY + height

      rect.x = x
      rect.y = y

      width = Math.abs(width)
      height = Math.abs(height)

      this.setSelection({
        index: this.selections.length - 1,
        dimensions: { x, y, width, height }
      })
    },

    /* 
     * Selection movement
     */
    selectionMouseDown(selection) {
      this.setActiveSelection(selection)
      document.addEventListener('mousemove', this.selectionMouseMove)
      document.addEventListener('mouseup', this.selectionMouseUp)
    },
    selectionMouseMove(e) {
      const container = this.$refs.container.getBoundingClientRect()
      let rect = this.active.client

      let x = rect.x + e.movementX
      let y = rect.y + e.movementY

      if (x < 0 || x + rect.width > container.width) {
        x = rect.x
      }
      if (y < 0 || y + rect.height > container.height) {
        y = rect.y
      }

      this.setSelection({
        index: this.activeSelection,
        dimensions: { x, y, width: rect.width, height: rect.height }
      })
    },
    selectionMouseUp() {
      document.removeEventListener('mousemove', this.selectionMouseMove)
      document.removeEventListener('mouseup', this.selectionMouseUp)
    },

    /* 
     * Selection resizing
     */
    resizeStart(selection, direction) {
      this.setActiveSelection(selection)
      document.addEventListener('mousemove', this.resizeMove)
      document.addEventListener('mouseup', this.resizeEnd)

      this.resizeDirection = direction
    },
    resizeMove(e) {
      const container = this.$refs.container.getBoundingClientRect()
      let rect = this.active.client

      let x = rect.x
      let y = rect.y
      let width = rect.width
      let height = rect.height

      switch (this.resizeDirection) {
        case 'nw':
          x += e.movementX
          y += e.movementY

          width -= e.movementX
          height -= e.movementY
          break;

        case 'sw':
          x += e.movementX

          width -= e.movementX
          height += e.movementY
          break;

        case 'ne':
          y += e.movementY

          width += e.movementX
          height -= e.movementY
          break;

        case 'se':
          width += e.movementX
          height += e.movementY
          break;
      }



      if (width < MIN_SIZE) {
        width = MIN_SIZE
      }
      if (height < MIN_SIZE) {
        height = MIN_SIZE
      }

      if (x < 0 || x + width > container.width) {
        x = rect.x
        width = rect.width
      }
      if (y < 0 || y + height > container.height) {
        y = rect.y
        height = rect.height
      }

      this.setSelection({
        index: this.activeSelection,
        dimensions: { x, y, width, height }
      })
    },
    resizeEnd() {
      document.removeEventListener('mousemove', this.resizeMove)
      document.removeEventListener('mouseup', this.resizeEnd)
    }
  }
}
</script>

<style>
.canvas {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  background-color: #ededed;
}

.canvas-container {
  position: relative;
  display: block; 
}

.canvas-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  cursor: crosshair;
}

.image {
  max-width: 100%;

  /* setting this to 100% makes it grow to it's natural height for SOME REASON */
  /* 100vh will result in some wierd behaviour if someone changes layout */
  /* however, with max-height: 100% behaviour is much wierder */

  /* but f*ck this... i've been trying to solve this in other way for three days */
  /* if you need to add footer or something just put calc() here */
  /* Yeah it is a crutch. But I at this point I don't care */
  max-height: 100vh; 
}
</style>