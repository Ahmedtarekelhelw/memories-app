import { Container } from "@mui/system";
import React from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Navbar from "./components/navbar/Navbar";
import { useSelector } from "react-redux";
import CreatorOrTag from "./pages/CreatorOrTag";

const LazyPostDetails = React.lazy(() =>
  import("./pages/postDetails/PostDetails")
);

const renderMultiRoutes = ({ element: Element, paths, ...rest }) =>
  paths.map((path) => (
    <Route key={path} path={path} {...rest} element={Element} />
  ));

const ProtectRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/posts";
  return user ? <Navigate to={from} /> : children;
};

const App = () => {
  return (
    <HashRouter>
      <Container maxWidth="xl">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="posts" element={<Home />} />
          <Route path="posts/search" element={<Home />} />

          <Route
            path="posts/:id"
            element={
              <React.Suspense fallback="Loading....">
                <LazyPostDetails />
              </React.Suspense>
            }
          />
          {renderMultiRoutes({
            paths: ["creators/:name", "tags/:name"],
            element: <CreatorOrTag />,
          })}
          <Route
            path="/auth"
            element={
              <ProtectRoute>
                <Auth />
              </ProtectRoute>
            }
          />
        </Routes>
      </Container>
    </HashRouter>
  );
};

export default App;
