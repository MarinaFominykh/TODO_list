export const BASE_URL = "http://localhost:3000";
const checkResponse = (res) => {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(res.status);
};

export const authorize = (login, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            login,
            password
        }),
    }).then(checkResponse);
};

export const getProfile = () => {
    return fetch(`${BASE_URL}/users/me`, {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
        },
    }).then(checkResponse);
}

export const getTasks = () => {
    return fetch(`${BASE_URL}/tasks`, {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`

        },
    }).then(checkResponse)
}
