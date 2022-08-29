import {
  START_LOADING,
  END_LOADING,
  GET_POST,
  GET_POSTS,
  UPDATE_POST,
  DELETE_POST,
  CREATE_POST,
  LIKE_POST,
  GET_POST_BY_SEARCH,
  COMMENT_POST,
  GET_POSTS_BY_CREATOR,
} from "../constants/actionTypes";
const initState = {
  posts: [],
  post: {},
  loading: false,
  error: null,
};
const postReducer = (state = initState, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, loading: true };
    case END_LOADING:
      return { ...state, loading: false };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };
    case GET_POST_BY_SEARCH:
    case GET_POSTS_BY_CREATOR:
      return { ...state, posts: action.payload };
    case GET_POST:
      return { ...state, post: action.payload };
    case COMMENT_POST:
    case LIKE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload?._id ? action.payload : post
        ),
      };
    case UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
      };
    case CREATE_POST:
      if (state.posts.length >= 6) {
        return {
          ...state,
          posts: [
            ...state.posts.filter((post, i) => state.posts.length !== i + 1),
            action.payload,
          ],
        };
      } else {
        return {
          ...state,
          posts: [...state.posts, action.payload],
        };
      }

    default:
      return state;
  }
};

export default postReducer;
