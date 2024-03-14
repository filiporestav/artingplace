import { defineStore } from 'pinia'

export const userDataStore = defineStore('userDataStore', {
    // State properties
    state: () => ({
        authenticated: false,
        name: null
    }),
})