<template>
  <div class="buttons is-centered">
    <button 
      :class="{ 'is-loading': saveLoading }"
      class="button is-success"
      @click="save"
      >
      <span class="icon is-small">
        <i class="fas fa-check"></i>
      </span>
      <span>Save</span>
    </button>
    <button 
      :class="{ 'is-loading': saveAndNextLoading }"
      class="button is-primary"
      @click="save"
      >
      <span class="icon is-small">
        <i class="fas fa-forward"></i>
      </span>
      <span>Save & Next</span>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      saveLoading: false,
      saveAndNextLoading: false,
    }
  },
  methods: {
    async save() {
      this.saveLoading = true
      await this.$store.dispatch('submitImage')
      this.saveLoading = false
    },
  }
}
</script>

<style>
.buttons {
  background-color: #ededed;
  padding: 0.75em 0em;
}
</style>