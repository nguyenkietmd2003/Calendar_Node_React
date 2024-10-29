// import React, { useContext } from "react";
// import { Route, Navigate } from "react-router-dom";
// import { AuthContext } from "../context/wrapContext";

// const ProtectedRoute = ({ element, ...rest }) => {
//   const { auth } = useContext(AuthContext);
//   console.log(auth?.isAuthenticated);
//   return (
//     <Route
//       {...rest}
//       element={auth?.isAuthenticated ? element : <Navigate to="/login" />}
//     />
//   );
// };

// export default ProtectedRoute;
