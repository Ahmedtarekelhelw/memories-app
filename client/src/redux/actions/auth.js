import * as api from "../../api";
import {
  AUTH_FAILURE,
  AUTH_START,
  AUTH_SUCCESS,
  REFRESH_TOKEN,
  LOGOUT,
} from "../constants/actionTypes";

export const login = (formData) => async (dispatch) => {
  dispatch({ type: AUTH_START });
  try {
    const { data } = await api.login(formData);
    dispatch({ type: AUTH_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: AUTH_FAILURE, payload: err.response?.data?.msg });
  }
};
export const logout = () => async (dispatch) => {
  try {
    await api.logout();
    dispatch({ type: LOGOUT });
  } catch (err) {
    console.log(err);
  }
};

export const signup = (formData) => async (dispatch) => {
  dispatch({ type: AUTH_START });
  try {
    const { data } = await api.signup(formData);
    dispatch({ type: AUTH_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: AUTH_FAILURE, payload: err.response?.data?.msg });
  }
};

export const refresh = () => async (dispatch) => {
  try {
    const { data } = await api.refresh();
    dispatch({ type: REFRESH_TOKEN, payload: data?.accessToken });
    return data?.accessToken;
  } catch (err) {
    dispatch({ type: AUTH_FAILURE, payload: err?.response?.data?.msg });
  }
};
