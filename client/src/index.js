import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./redux/reducers";

export const store = createStore(reducers, compose(applyMiddleware(thunk)));

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
