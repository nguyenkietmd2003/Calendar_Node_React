// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/homepage/homepages"; // Đảm bảo tên file và đường dẫn đúng
import ErrorPage from "./pages/errorpage/ErrorPage"; // Đảm bảo tên file và đường dẫn đúng
import LoginPage from "./pages/loginPage/loginpage";
import RegisterPage from "./pages/registerPage/registerPage";
import SharedPage from "./pages/SharedPage/SharePage";
import ProtectedRoute from "./util/protectedRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/calendar",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  // Route lỗi
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: `/link-schedule/:randomString`,
    element: <SharedPage />,
  },
]);
