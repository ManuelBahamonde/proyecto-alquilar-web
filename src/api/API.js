import axios from "axios";
import { NotificationManager } from 'react-notifications';

const methods = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
};

// TODO: get it from Context/LocalStorage
const token = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiUm9iZXJ0byBCZXJtZWpvIFNhbmNoZXoiLCJBbHF1aWxBci5FbWFpbCI6InJvYmVydG9iZXJtZWpvc2FuY2hlekBnbWFpbC5jb20iLCJBbHF1aWxBci5Ob21icmVVc3VhcmlvIjoiUm9iZXJ0b1NhbmNoZXoiLCJBbHF1aWxBci5Ob21icmVSb2wiOiJQYXJ0aWN1bGFyIiwiZXhwIjoxNjUwNDk4NzE3LCJpc3MiOiJBbHF1aWxBckdyb3VwIiwiYXVkIjoibG9jYWxob3N0In0.je80lNUYqL4_8oZd4TCWYd52qWk_vEaTXPtzx30WmvHXOxCPUnYMiqmbjO87xnXGJzh3IacjCI-UylzKulhlFw';

const API = axios.create({
    baseURL: 'https://localhost:44380',
    headers: {
        ...(token ? { Authorization: `bearer ${token}` } : null),
    },
});

const sendRequest = async (url, method, payload) => {
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
    })
    .catch((error) => {
        console.error(error);
        NotificationManager.error(error.message);

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