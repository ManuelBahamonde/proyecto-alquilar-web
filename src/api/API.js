import axios from "axios";
import { NotificationManager } from 'react-notifications';

const methods = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
};


const API = axios.create({
    baseURL: 'https://localhost:5001',
});

const sendRequest = async (url, method, payload) => {
    const token = localStorage.getItem("token");
    const formattedPayload = {};

    if (payload) {
        if (method === methods.GET) {
            formattedPayload.params = payload;
        } else {
            formattedPayload.data = payload;
        }
    }

    return API({
        url,
        method,
        ...formattedPayload,
        headers: {...(token ? { Authorization: `bearer ${token}` } : null)},
    })
    .catch((error) => {
        console.error(error);
        const { response } = error;
        NotificationManager.error(response.data.Message);

        throw error;
    });
};

const get = (url, payload) => {
    return sendRequest(url, methods.GET, payload);
};

const post = (url, body) => {
    return sendRequest(url, methods.POST, body);
};

const put = (url, body) => {
    return sendRequest(url, methods.PUT, body);
};

const del = (url) => {
    return sendRequest(url, methods.DELETE);
};

export {
    get,
    post,
    put,
    del,
};
export default API;