import {BASE_URL} from "./endpoints.ts";
import router from "../router";
import store from "../store";

export async function requestWrapper(payload = {}) {
    const authErrors = [401, 403];
    let body;
    let headers;
    let fullRequestUrl = BASE_URL + payload.additionUrl;

    if (payload.getParam) {
        fullRequestUrl += payload.getParam;
    }

    headers = {
        Authorization: payload.userID + " " + payload.token,
    }

    if (payload.postBody) {
        headers["Content-Type"] = 'application/json;charset=utf-8';
        body = JSON.stringify(payload.postBody);
    } else if (payload.formData) {
        body = payload.formData;
    }

    try {
        const response = await fetch(fullRequestUrl, {
            method: payload.method,
            headers: headers,
            body: body,
        });
        if (authErrors.includes(response.status)) {
            await store.dispatch("logout");
            await router.push({name: "auth"});
        }
        return response.json();
    } catch (err) {
        alert(`Упс, что-то пошло не так! Ошибка: ${err}`);
    }
}
