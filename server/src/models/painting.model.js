/**
 * @class Painting
 */

class Painting {
    constructor(title, artist, price) {
        this.title = title
        this.artist = artist
        this.price = price
    }

    /**
     * Changes the price of the painting
     * @param {String} newPrice - The new price of the painting
     * @returns
     */
    changePrice(newPrice) {
        this.price = newPrice
    }

    /**
     * Returns the title of the painting
     * @param
     * @returns {String}
     */
    getTitle() {
        return this.title
    }
    /**
     * Returns the name of the painting's artist
     * @param
     * @returns {String}
     */
    getArtist() {
        return this.artist
    }
    /**
     * Returns the price of the painting
     * @param
     * @returns {String}
     */
    getPrice() {
        return this.price
    }
}

export default Painting