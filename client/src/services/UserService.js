const URL = '/api/user' // The URL to fetch

class UserService {
    static register(email, username, password, confirmedPassword) {
        return fetch(URL, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, username, password, confirmedPassword})
        })
        .then((response) => {
            data = response.json()
            if (response.ok) {
                data['status'] = 'ok' // Used for vue frontend, if user should sign in automatically or not
            }
            else { data['status'] = 'invalid' }
            return data
        })
        .catch((err) => {
            console.error(err)
        })
    }

    static login(email, password) {
        return fetch(URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        })
        .then((response) => {
            return response.json()
        })
        .catch((err) => {
            console.error(err)
        })
    }

    static logout() {
        return fetch(URL, {
            method: "DELETE",
        })
        .then((response) => {
            return response.json()
        })
        .catch((err) => {
            console.error(err)
        })
    }
}

export default UserService