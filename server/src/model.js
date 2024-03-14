import { v4 as uuidv4 } from 'uuid'
import User from './models/user.model.js'
import Painting from './models/painting.model.js'

class Model {
    constructor() {
        this.paintings = {}
        this.users = {}
        this.io = undefined
    }

    /**
     * Initialize the model after its creation
     * @param {SocketIO.Server} io - The socket.io server instance
     * @returns {void} 
     */
    init(io) {
        this.io = io
    }

    /**
     * Adds a painting to the server.
     * @param {String} title - Name of the painting (Noname if empty)
     * @param {String} artist - Name of the artist (Unknown if empty)
     * @returns {void}
     */
    addPainting(title="Noname", artist="Unknown", paintingId = uuidv4()) {
        this.paintings[paintingId] = new Painting(title, artist)
    }

    /**
     * Adds a user to the model
     * @param {String} id - The id of the session (unique)
     * @param {String} name - Name of the user
     * @returns {void}
     */
    addUser(id, name) {
        this.users[id] = new User(name)
    }

    /**
     * Finds an user by its ID.
     * @param {String} id - The id of the session (unique)
     * @returns {User}
     */
    findUserById(id) {
        return this.users[id]
    }
}

export default new Model()