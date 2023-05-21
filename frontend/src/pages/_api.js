import {writable} from "svelte/store";
import login from "./login.svelte";

export const user = writable(false)
const baseURL = "https://api.noname.to/"
const tokenField = "token"

let doRequest = async (action, args = undefined, method = "GET") => {
    let token = localStorage.getItem(tokenField);
    let response = await fetch(baseURL + action + (method === "POST" || args === undefined ? "" : "?" + new URLSearchParams(args).toString()), {
        headers: {
            "Authorization": token == null ? undefined : `Bearer ${token}`,
            "Content-Type": "application/json",
            'Accept': "application/json",
        },
        method,
        body: method === "POST" ? JSON.stringify(args) : undefined
    })

    let data = await response.json();

    if (response.status >= 400) {
        throw { message: data.message, statusCode: response.status };
    }

    return data
}

const api = {
    "user": {
        "signIn": async (login, password) => doRequest(
            "user/signIn", {login, password}, "POST"),
        "info": async () => doRequest("user/info"),
        "list": async (page = 1, pageSize = 10) => doRequest("user/list", {page, pageSize})
    },
    "participants": {
        "list": async (page=1, pageSize=10) => doRequest(
            "participant/list", {page, pageSize}, "GET")
    }
}

export default api

export let setToken = (token) => {
    localStorage.setItem(tokenField, token);
}

export let removeToken = () => {
    localStorage.removeItem(tokenField);
}

export let loadUser = async () => {
    if(!localStorage.getItem(tokenField)) return null;

    // нужно обработать единственную ошибку: 401
    try {
        const userData = await api.user.info();
        console.log(userData)
        user.set(userData);
    } catch (error) {
        if(error.statusCode !== 401) {
            throw error;
        }
    }
}