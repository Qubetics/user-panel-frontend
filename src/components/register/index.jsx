import React, { useState } from "react";
import ButtonCustom from "../../Common/ButtonCustom/ButtonCustom";
import "../../styles/components/register/style.scss";
import { NotificationModal } from "./ResponseTabs";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("success");

  const message =
    status === "success"
      ? "Node request sent successfully!"
      : "Node request failed!";

  const handleClick = () => {
    setVisible(true);
  };

  return (
    <div className="register-overlay">
      <div className="register-popup">
        <h2 className="register-popup__title">Register as Node Service</h2>

        <div className="register-popup__form">
          <label className="register-popup__label">Org Name</label>
          <input
            type="text"
            className="register-popup__input"
            placeholder="Enter Organization Name"
          />
          <label className="register-popup__label">Email Address</label>
          <input
            type="text"
            className="register-popup__input"
            placeholder="Enter your email address"
          />
          <label className="register-popup__label">Node Address</label>
          <input
            type="text"
            className="register-popup__input"
            placeholder="Enter Node Address"
          />
          <label className="register-popup__label">Choose Plan</label>
          <select name="plan" id="plan" className="register-popup__select">
            <option value="1000 TICS/month">1000 TICS/month</option>
            <option value="1000 BTC/month">1000 BTC/month</option>
          </select>
          <div className="register-popup__actions">
            <ButtonCustom
              regularBtn
              label="Submit"
              onClick={() => handleClick()}
            />
          </div>
        </div>
      </div>
      <NotificationModal
        title="Node Request"
        message={message}
        onClose={() => setVisible(false)}
        show={visible}
      />
    </div>
  );
};

export default Register;
