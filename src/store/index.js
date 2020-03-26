import Vue from 'vue'
import Vuex from 'vuex'
import { listImages, getImageData, getCategories } from '../api'
import { mapSelection } from '../helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    images: [],
    image: {
      path: '',
      dimensions: { width: null, height: null },
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
    }
  },
  mutations: {
    setImages(state, images) {
      state.images = images
    },
    setImage(state, data) {
      state.image = {
        path: data.path,
        dimensions: { width: null, height: null },
        activeSelection: null,
        selections: data.selections || [],
        meta: data.meta || {}
      }

      document.title = data.path + ' - Labeler'
    },
    setImageDimensions(state, { width, height }) {
      state.image.dimensions.width = width
      state.image.dimensions.height = height
    },
    setCanvasDimensions(state, { width, height }) {
      state.canvas.width = width
      state.canvas.height = height

      // Resize selections
      state.image.selections = state.image.selections.map(s => {
        s.client = mapSelection(s.real, state.image.dimensions, state.canvas)
        return s
      })
    },

    setActiveSelection(state, index) {
      state.image.activeSelection = index
    },
    addSelection(state, selection) {
      state.image.selections.push(Object.assign({
        real: {},
        client: {},
        category: null,
      }, selection)
      )
    },
    removeSelection(state, index) {
      state.image.selections.splice(index, 1)
    },
    setSelection(state, {index, dimensions}) {
      let selection = state.image.selections[index]
      selection.client = dimensions
      selection.real = mapSelection(selection.client, state.canvas, state.image.dimensions)

      // Vue.set(
      //   state.image.selections, 
      //   index, 
      //   {
      //     ...state.image.selections[index]
      //     client: dimensions
      //   }
      //   mapSelection(selection, state.canvas, state.image.dimensions)
      // )
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
