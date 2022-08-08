import {
  AUTH_FAILURE,
  AUTH_START,
  AUTH_SUCCESS,
  LOGOUT,
  REFRESH_TOKEN,
} from "../constants/actionTypes";

const initState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case AUTH_START:
      return { user: null, loading: true, error: null };
    case REFRESH_TOKEN:
      localStorage.setItem(
        "user",
        JSON.stringify({ ...state.user, accessToken: action?.payload })
      );
      return {
        user: { ...state.user, accessToken: action?.payload },
        loading: false,
        error: null,
      };
    case AUTH_SUCCESS:
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { user: action.payload, loading: false, error: null };
    case AUTH_FAILURE:
      localStorage.clear();
      return { user: null, loading: false, error: action.payload };
    case LOGOUT:
      localStorage.clear();
      return { user: null, loading: false, error: null };
    default:
      return state;
  }
};

export default authReducer;
