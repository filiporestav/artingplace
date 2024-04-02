import { defineStore } from 'pinia'

export const userDataStore = defineStore('userDataStore', {
    // State properties
    state: () => ({
        authenticated: false,
        username: null,
        cookie: null,
    }),
    actions: {
        login() {
            this.authenticated = true
        },
        logout() {
            this.authenticated = false
        }
    }
})