import axios from "axios";
import { store } from "..";
import { refresh as refr } from "../redux/actions/auth";

//main endPoint
const BASE_URL = "http://localhost:5000";

// tihs for any route not require authorization
const API = axios.create({
  baseURL: BASE_URL,
});

// tihs for any route require authorization
export const apiPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

//set headers in request
apiPrivate.interceptors.request.use((req) => {
  const accessToken = JSON.parse(localStorage.getItem("user")).accessToken; // my backend token
  const token = JSON.parse(localStorage.getItem("user")).token; //google token
  if (!req.headers["Authorization"]) {
    req.headers["Authorization"] = `Bearer ${accessToken || token}`;
  }
  return req;
});

apiPrivate.interceptors.response.use(
  // return res incase of not find any problem with authorization
  (res) => res,
  async (err) => {
    //incase of access token in not valid for any reason
    const prevReq = err?.config;
    if (err?.response?.status === 403 && !prevReq?.sent) {
      prevReq.sent = true; // this custom property
      //we regenrate new accessToken by refreshToken
      const newAccessToken = await store.dispatch(refr());
      prevReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return apiPrivate(prevReq);
    }
  }
);

//auth
export const login = (formData) =>
  API.post("/auth/login", formData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

export const logout = () =>
  API.get("/auth/logout", {
    withCredentials: true,
  });

export const signup = (formData) =>
  API.post("/auth/register", formData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

export const refresh = () =>
  API.get("/refresh", {
    withCredentials: true,
  });

//posts
export const getPost = (id) => API.get(`/posts/${id}`);
export const getPosts = (page) => API.get(`/posts?page=${page || 1}`);
export const getPostBySearch = (search) =>
  API.get(
    `/posts/search?searchQuery=${search?.title?.trim() || "none"}&tags=${
      search.tags?.length > 1
        ? search.tags?.join(",")
        : search.tags?.join() || "none"
    }`
  );
export const getPostByCreator = (name) => API.get(`/posts/creator/${name}`);

// this require authorization so we use apiPrivate instead API
export const updatePost = (id, updatedPost) =>
  apiPrivate.patch(`/posts/${id}`, updatedPost);
export const createPost = (newPost) => apiPrivate.post("/posts", newPost);
export const deletePost = (id) => apiPrivate.delete(`/posts/${id}`);

export const likePost = (id) => apiPrivate.patch(`/posts/${id}/likePost`);
export const commentPost = (comment, postId) =>
  apiPrivate.patch(`/posts/${postId}/comment`, { comment });
