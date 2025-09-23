import React from "react";
import "../../styles/components/landingPage/hero.scss";
import ButtonCustom from "../../Common/ButtonCustom/ButtonCustom";
import { useNavigate } from "react-router-dom";
import { env } from "../../Constant/envConstants";

const Hero = ({ onDownloadClick }) => {
  const navigate = useNavigate();

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
            <ButtonCustom
              className='btn'
              regularBtn
              label="Become Node Provider"
              onClick={() => navigate("/register")}
            />
            <ButtonCustom
              className='btn'
              regularBtn
              label="Become Service Provider"
              onClick={() => window.open(env.provider_api, "_blank")}
            />
            <ButtonCustom regularBtn label="Download dVPN App"
              className='btn'
              onClick={() => {
                const section = document.getElementById("download-section");
                section?.scrollIntoView({ behavior: "smooth" });
              }}

            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
