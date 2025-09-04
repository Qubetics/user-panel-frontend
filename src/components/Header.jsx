import Logo from "../assets/HeaderLogo.svg";
import "../styles/components/header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <img src={Logo} alt="" />
        </div>
      </div>
    </header>
  );
};

export default Header;
