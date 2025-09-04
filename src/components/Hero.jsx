import React from "react";
import "../styles/components/hero.scss";
import ButtonCustom from "../Common/ButtonCustom/ButtonCustom";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">
            Power the New Internet: Become a
            <br />
            <span className="hero__title-gradient">dVPN Node Today</span>
          </h1>
          <div className="hero__cta">
            <ButtonCustom regularBtn label="Start Earning as a Provider" />
            <ButtonCustom regularBtn label="Download dVPN App" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
