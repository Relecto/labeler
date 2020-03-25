<template>
  <div 
    class="selection"
    :style="{
      height: `${height}px`,
      width: `${width}px`,
      transform: `translate(${x}px, ${y}px)`,
      border: active ? `2px solid ${color}` : `2px dashed ${color}`,
      background: /*active ? null :*/ `repeating-linear-gradient(
        45deg,
        ${color + '33'},
        ${color + '33'} 5px,
        ${color + '00'} 5px,
        ${color + '00'} 10px
      )`
    }"

    @mousedown="$emit('mousedown', arguments[0])"
    >
    <div @mousedown.stop="$emit('resizestart', 'ne')" class="handle ne"></div>
    <div @mousedown.stop="$emit('resizestart', 'nw')" class="handle nw"></div>
    <div @mousedown.stop="$emit('resizestart', 'se')" class="handle se"></div>
    <div @mousedown.stop="$emit('resizestart', 'sw')" class="handle sw"></div>

  </div>
</template>

<script>
export default {
  props: {
    active: Boolean,

    width: Number,
    height: Number,

    x: Number,
    y: Number,

    color: String,
  }
}
</script>

<style scoped>
.selection {
  /* border: 1px dashed rgba(0,0,0,.5); */
  z-index: 3;
  cursor: move;

  position: absolute;
  top: 0;
}

.handle {
  position: absolute;
  
  border: 1px solid #000;
  background-color: #fff;
  width: 7px;
  height: 7px;
  z-index: 4;
}

.handle.nw {
  cursor: nw-resize;

  left: 0;
  top: 0;

  margin-left: -5px;
  margin-top: -5px;
}
.handle.ne {
  cursor: ne-resize;

  right: 0;
  top: 0;

  margin-right: -5px;
  margin-top: -5px;
}
.handle.sw {
  cursor: sw-resize;

  left: 0;
  bottom: 0;

  margin-left: -5px;
  margin-bottom: -5px;
}
.handle.se {
  cursor: se-resize;

  right: 0;
  bottom: 0;

  margin-right: -5px;
  margin-bottom: -5px;
}

</style>