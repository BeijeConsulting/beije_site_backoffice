import axios from "axios";

let AUTH_TOKEN = window.localStorage.getItem("tk");

const instance = axios.create({
  /* baseURL: "https://mgmt-test-api.beije.it/", */
  baseURL: "https://dev-mgmt.beije.it/",
  headers: {
    Authorization: AUTH_TOKEN ? "Bearer " + AUTH_TOKEN : "",
  },
});

export async function uploadImages(resource, imageObj) {
    return await instance.post(resource, imageObj)
    .then((response)=> response.data)
    .catch((error)=> error);
}

function handleSuccess(response) {
  if (response.config.url.includes("signin")) {
    window.localStorage.setItem("tk", response.data.token);
    instance.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
  }

  return response;
}

function handleError(error) {
  const { config, response } = error;
  return new Promise(async (resolve, reject) => {
    if (
      response?.status === 401 &&
      !config.url.includes("signin") &&
      !config.url.includes("updateAuthToken")
    ) {
      try {
        const { data } = await instance.post("/updateAuthToken");
        window.localStorage.setItem("tk", data.token);
        instance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        await axios.request(config);
        resolve();
      } catch {
        window.localStorage.clear();
        window.location.href = "/login";
        console.log("Unauthorized");
        reject(error);
      }
    }
    reject(error);
  });
}

function handleRequest(config) {
  const token = localStorage.getItem('tk');
  if (token && config.headers.Authorization === "") {
    config.headers.Authorization = `Bearer ${localStorage.getItem('tk')}`;
    instance.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem('tk')}`;
  }
  return config;
}

instance.interceptors.response.use(handleSuccess, handleError);

instance.interceptors.request.use(handleRequest);

export default instance;
