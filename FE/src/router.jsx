// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/homepage/homepages"; // Đảm bảo tên file và đường dẫn đúng
import ErrorPage from "./pages/errorpage/ErrorPage"; // Đảm bảo tên file và đường dẫn đúng
import LoginPage from "./pages/loginPage/loginpage";
import RegisterPage from "./pages/registerPage/registerPage";
import Test from "./pages/test";
import Test2 from "./pages/test1";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  // Route lỗi
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/test1",
    element: <Test2 />,
  },
]);
