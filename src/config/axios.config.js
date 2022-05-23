import axios from "axios";

let AUTH_TOKEN = window.localStorage.getItem("tk");

const instance = axios.create({
  baseURL: "https://mgmt-test-api.beije.it/",
  headers: {
    Authorization: AUTH_TOKEN ? "Bearer " + AUTH_TOKEN : "",
  },
});

function handleSuccess(response) {
  if (response.config.url.includes("signin")) {
    window.localStorage.setItem("tk", response.data.token);
    instance.defaults.headers.common["Authorization"] = response.data.token;
  }
  return response;
}

function handleError(error) {
  const { config, response } = error;
  return new Promise(async (resolve, reject) => {
    if (response?.status === 401 && !config.url.includes("signin")) {
      try {
        const { data } = await instance.post("/updateAuthToken");
        window.localStorage.setItem("tk", data.refreshToken);
        instance.defaults.headers.common["Authorization"] = data.refreshToken;
        const retry = await axios.request(config);
        resolve(retry);
      } catch {
        console.log("Unauthorized");
        reject(error);
      }
    }
    if (response?.status === 403) {
      window.localStorage.removeItem('tk');
    }
    reject(error);
  });
}

instance.interceptors.response.use(handleSuccess, handleError);

export default instance;
