import { Link } from "react-router-dom";
import "./loginPage.css";
const LoginPage = () => {
  //
  const focusPlaceholder = (inputId) => {
    document.querySelector(inputId).focus();
  };

  //
  return (
    <div className="login-container">
      <span className="h-12  text-[40px] font-bol mb-[41px] block text-center">
        Login
      </span>
      <form action="" className="flex flex-col items-center">
        <div
          className="input-container mb-6"
          onClick={() => focusPlaceholder("email")}
        >
          <input
            type="text"
            id="email"
            placeholder=""
            className="input-field"
          />
          <label htmlFor="email" className="placeholder">
            Email
          </label>
        </div>
        <div
          className="input-container mb-[19px]"
          onClick={() => focusPlaceholder("password")}
        >
          <input
            type="password"
            id="password"
            placeholder=""
            className="input-field"
          />
          <label htmlFor="password" className="placeholder">
            Password
          </label>
        </div>
        <Link className="mb-[19px] block text-[15px]" to={"/register"}>
          Register here.
        </Link>
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};
export default LoginPage;
