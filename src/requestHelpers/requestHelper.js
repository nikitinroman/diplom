// @ts-ignore
import { BASE_URL } from "./endpoints.ts";
import router from "../router";
import store from "../store";

// additionUrl = "",
//     userID = "",
//     token = "",
//     method = "",
//     getParam = "",
//     postBody = "",
//     formData = FormData

export async function requestWrapper(payload = {}) {
  const authErrors = [401, 403];
  let body;
  let contentType;
  let fullRequestUrl = BASE_URL + payload.additionUrl;

  if (payload.getParam) {
    fullRequestUrl += payload.getParam;
  }

  contentType = "application/json;charset=utf-8";

  if (payload.postBody) {
    body = JSON.stringify(payload.postBody);
  } else if (payload.formData) {
    body = payload.formData;
    contentType = "multipart/form-data";
  }

  try {
    const response = await fetch(fullRequestUrl, {
      method: payload.method,
      headers: {
        "Content-Type": contentType,
        Authorization: payload.userID + " " + payload.token,
      },
      body: body,
    });
    if (authErrors.includes(response.status)) {
      await store.dispatch("logout");
      await router.push({ name: "auth" });
    }
    return response.json();
  } catch (err) {
    alert(`Упс, что-то пошло не так! Ошибка: ${err}`);
  }
}
