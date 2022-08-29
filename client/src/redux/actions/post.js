import * as api from "../../api";
import {
  CREATE_POST,
  DELETE_POST,
  GET_POST,
  GET_POSTS,
  GET_POST_BY_SEARCH,
  LIKE_POST,
  START_LOADING,
  UPDATE_POST,
  END_LOADING,
  COMMENT_POST,
  GET_POSTS_BY_CREATOR,
} from "../constants/actionTypes";
export const getPost = (id) => async (dispatch) => {
  dispatch({ type: START_LOADING });
  try {
    const { data } = await api.getPost(id);
    dispatch({ type: GET_POST, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};
export const getPosts = (page) => async (dispatch) => {
  dispatch({ type: START_LOADING });
  try {
    const { data } = await api.getPosts(page);
    dispatch({ type: GET_POSTS, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};
export const updatePost = (id, updatePost) => async (dispatch) => {
  try {
    const res = await api.updatePost(id, updatePost);
    dispatch({ type: UPDATE_POST, payload: res?.data });
  } catch (error) {
    console.log(error);
  }
};
export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE_POST, payload: id });
  } catch (error) {
    console.log(error);
  }
};
export const createPost = (newPost) => async (dispatch) => {
  dispatch({ type: START_LOADING });
  try {
    const { data } = await api.createPost(newPost);
    dispatch({ type: CREATE_POST, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const res = await api.likePost(id);
    dispatch({ type: LIKE_POST, payload: res?.data });
  } catch (error) {
    console.log(error);
  }
};

export const getPostBySearch = (search) => async (dispatch) => {
  dispatch({ type: START_LOADING });
  try {
    const { data } = await api.getPostBySearch(search);
    dispatch({ type: GET_POST_BY_SEARCH, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};
export const commentPost = (comment, postId) => async (dispatch) => {
  try {
    const { data } = await api.commentPost(comment, postId);
    dispatch({ type: COMMENT_POST, payload: data });
    return data.comments;
  } catch (error) {
    console.log(error);
  }
};

export const getPostsByCreator = (name) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.getPostByCreator(name);
    dispatch({ type: GET_POSTS_BY_CREATOR, payload: data });
  } catch (error) {
    console.log(error);
  } finally {
    dispatch({ type: END_LOADING });
  }
};
