import { useNavigate } from "react-router-dom";
import Logo from "../assets/HeaderLogo.svg";
import "../styles/components/header/header.scss";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header__container">
        <div
          className="header__logo"
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={Logo} alt="" />
        </div>
      </div>
    </header>
  );
};

export default Header;
