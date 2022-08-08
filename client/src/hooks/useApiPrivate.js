// import { apiPrivate } from "../api";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { refresh } from "../redux/actions/auth";

// const useApiPrivate = () => {
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const reqInterceptors = apiPrivate.interceptors.request.use((req) => {
//       if (!req.headers["Authorization"]) {
//         req.headers["Authorization"] = `Bearer ${user?.accessToken}`;
//       }
//       return req;
//     });

//     const resInterceptor = apiPrivate.interceptors.response.use(
//       (res) => res,
//       async (err) => {
//         const prevReq = err?.config;
//         if (err.response.status === 403 && !prevReq?.sent) {
//           prevReq.sent = true;
//           const newAccessToken = dispatch(refresh());
//           prevReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
//           return apiPrivate(prevReq);
//         }
//       }
//     );

//     return () => {
//       apiPrivate.interceptors.request.eject(reqInterceptors);
//       apiPrivate.interceptors.response.eject(resInterceptor);
//     };
//   }, [user, dispatch]);
//   return apiPrivate;
// };

// export default useApiPrivate;
