import { Link } from "react-router-dom";
import "./registerPage.css";
const RegisterPage = () => {
  const focusPlaceholder = (inputId) => {
    document.querySelector(inputId).focus();
  };
  return (
    <div className="register-container">
      <span className="h-12  text-[40px] font-bol mb-[32.75px] block text-center">
        Signup
      </span>
      <form action="" className="flex flex-col items-center">
        <div
          className="input-container mb-[24.65px]"
          onClick={() => focusPlaceholder("name")}
        >
          <input type="text" id="name" placeholder="" className="input-field" />
          <label htmlFor="name" className="placeholder">
            Name
          </label>
        </div>
        <div
          className="input-container mb-[24.65px]"
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
        {/*  */}
        <div
          className="input-container mb-[24.65px]"
          onClick={() => focusPlaceholder("phone")}
        >
          <input
            type="number"
            id="phone"
            placeholder=""
            className="input-field"
          />
          <label htmlFor="phone" className="placeholder">
            Phone
          </label>
        </div>
        <div
          className="input-container mb-[47px]"
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

        <button type="submit" className="submit-button">
          Signup
        </button>
      </form>
    </div>
  );
};
export default RegisterPage;
