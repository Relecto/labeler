<template>
  <!-- <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" id="imageCanvas"></canvas> -->
  <div class="canvas">
    <div ref="container" class="canvas-container">
      <img 
        ref="image" 
        class="image" 
        :src="'/img/' + image"

        draggable="false"

        @load="resizeImage"
      />
      <svg 
        id="svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"

        width="100%"
        height="100%"

        @mousedown="mouseDown"
        @mouseup="mouseUp"
        @mousemove="mouseMove"
      >
      </svg>
    </div>
  </div>

</template>

<script>
import { SVG } from '@svgdotjs/svg.js'
// import '@svgdotjs/svg.draggable.js'

export default {
  props: {
    image: String
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      selections: [], 
      activeSelection: null,
      isDrawing: false,
    }
  },
  computed: {
    meta() {
      return this.$store.state.images[this.currentImage]
    }
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.resizeImage)
  },
  mounted() {
    this.svg = new SVG('#svg')
  },
  methods: {
    resizeImage() {
      console.log('resizing..')
      let image = this.$refs.image
      let container = this.$refs.container

      let widthRatio = image.naturalWidth / container.parentElement.clientWidth
      let heightRatio = image.naturalHeight / container.parentElement.clientHeight

      if (widthRatio > heightRatio) {
        container.style.width = '100%'
        container.style.height = 'auto'
        image.style.width = '100%'
        image.style.height = 'auto'
      } else {
        container.style.width = 'auto'
        container.style.height = '100%'
        image.style.width = 'auto'
        image.style.height = '100%'
      }

      console.log({ widthRatio, heightRatio }) 
    },

    setActiveSelection(rect) {
      if (this.activeSelection) {
        console.log('removing')
        this.activeSelection.removeClass('active')
      }
      this.activeSelection = rect
      this.activeSelection.addClass('active')
    },

    mouseDown(e) {
      this.isDrawing = true

      let rect = this.svg.rect()

      rect.attr({ 'fill-opacity': 0 })
      rect.stroke('#000')
      rect.move(e.layerX, e.layerY)

      rect.startX = e.layerX
      rect.startY = e.layerY

      rect.addClass('selection')

      this.activeSelection = rect
    },
    mouseUp(e) {
      this.isDrawing = false
      console.log({ clientX: e.clientX, clientY: e.clientY })

      let rect = this.activeSelection

      if (rect.width === 0 || rect.width === 0) {
        rect.remove()
        return
      }

      // rect.draggable()

      rect.click(() => {
        this.setActiveSelection(rect)
        console.log('setting...')
        return false
      })
      
      this.selections.push(rect)
    }, 
    mouseMove(e) {
      if (!this.isDrawing) {
        return
      }
      let rect = this.activeSelection

      let width = e.layerX - rect.startX
      let height = e.layerY - rect.startY 

      let rectX = width > 0 ? rect.startX : rect.startX + width
      let rectY = height > 0 ? rect.startY : rect.startY + height

      rect.move(rectX, rectY)
      rect.size(Math.abs(width), Math.abs(height))
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

  background-color: #ededed;
}

.canvas-container {
  position: relative;
  display: inline-block; 
}
.canvas-container svg {
  position: absolute;
  top: 0;
  left: 0;
}

/* .image-container svg {
  position: absolute;
  width: 100%;
  height: 100%;
} */

.image {
  /* object-fit: contain;

  margin-left: auto;
	margin-right: auto; */
	
  /* object-fit: contain; */

  width: 100%;
  height: 100%;
}
</style>