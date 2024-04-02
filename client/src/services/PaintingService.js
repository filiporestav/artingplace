const URL = '/api/paintings'

class PaintingService {
    // Get Paintings
    static getPaintings() {
        fetch(URL, {
            method: "GET"
        })
    }

    // Create Painting
    static uploadPainting() {
        fetch(URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        })
    }

    // Delete Painting
}