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
            password,
        }),
    }).then(checkResponse);
};

export const getProfile = () => {
    return fetch(`${BASE_URL}/users/me`, {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }).then(checkResponse);
};

export const getTasks = () => {
    return fetch(`${BASE_URL}/tasks`, {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }).then(checkResponse);
};

export const getUsers = () => {
    return fetch(`${BASE_URL}/users`, {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
        },
    }).then(checkResponse);
};

export const addTask = (data) => {
    return fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            title: data.title,
            description: data.description,
            finish: data.finish,
            priority: data.priority,
            status: data.status,
            executor: data.executor,
        }),
    }).then(checkResponse);
};

export const updateTask = (task, data) => {
    return fetch(`${BASE_URL}/tasks/${task._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`

        },
        body: JSON.stringify({
            title: data.title,
            description: data.description,
            finish: data.finish,
            priority: data.priority,
            status: data.status,
            executor: data.executor,
        })
    }).then(checkResponse)
}
