import Vue from 'vue'
import Vuex from 'vuex'
import { listImages, getImageData, getCategories } from '../api'
import { map } from '../helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    images: [],
    image: {
      path: '',
      width: null,
      height: null,
      // dimensions: { width: null, height: null },
      activeSelection: null,
      selections: [],
      meta: {}
    },

    categories: [],
    activeCategory: null,

    palette: ['#b86bff', '#56c5e8', '#73ff5e', '#e86c56', '#ffdb63'],

    canvas: {
      width: null, 
      height: null,
    }
  },
  getters: {
    active(state) {
      return state.image.selections[state.image.activeSelection]
    },
    activeCategory(state) {
      return state.categories[state.activeCategory]
    },
    /**
     * realSelections returns selection dimensions 
     * mapped to image coordinates 
     */
    realSelections(state) {
      return state.image.selections.map(s => {
        let news = {
          x: Math.floor(map(s.x, 0, state.canvas.width, 0, state.image.width)),
          y: Math.floor(map(s.y, 0, state.canvas.height, 0, state.image.height)),
          width: Math.floor(map(s.width, 0, state.canvas.width, 0, state.image.width)),
          height: Math.floor(map(s.height, 0, state.canvas.height, 0, state.image.height))
        }
        return news
      })
    },
  },
  mutations: {
    setImages(state, images) {
      state.images = images
    },
    setImage(state, data) {
      state.image = {
        path: data.path,
        width: null, 
        height: null,
        activeSelection: null,
        selections: data.selections || [],
        meta: data.meta || {}
      }
    },
    setImageDimensions(state, { width, height }) {
      state.image.width = width
      state.image.height = height
    },
    setCanvasDimensions(state, { width, height }) {
      state.canvas.width = width
      state.canvas.height = height
    },

    setActiveSelection(state, index) {
      state.image.activeSelection = index
    },
    addSelection(state, selection) {
      state.image.selections.push(selection)
    },
    removeSelection(state, index) {
      state.image.selections.splice(index, 1)
    },
    setSelection(state, {index, selection}) {
      Vue.set(state.image.selections, index, selection)
    },

    setCategories(state, categories) {
      state.categories = categories
    },
    setActiveCategory(state, index) {
      state.activeCategory = index
    },
  },
  actions: {
    async fetchImages(context) {
      let images = await listImages()
      context.commit('setImages', images)
    },
    async fetchImage(context, path) {
      let data = await getImageData(path)
      context.commit('setImage', {
        path,
        selections: data.selections,
        meta: data.meta
      })
    },
    async fetchCategories(context) {
      let categories = await getCategories()
      context.commit('setCategories', categories)
    }
  },
  modules: {
  }
})
