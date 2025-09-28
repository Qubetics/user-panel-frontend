import React from "react";
import ButtonCustom from "../../Common/ButtonCustom/ButtonCustom";
import "../../styles/components/register/responseTabs.scss";

export const NotificationModal = ({
  title = "Node Request",
  message = "",
  onClose,
  buttonLabel = "OK",
  show = true,
  children,
}) =>
  show ? (
    <div className="notification-modal">
      <div className="notification-modal__content">
        <button
          aria-label="Close modal"
          className="notification-modal__close-btn"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>
        <h2 className="notification-modal__content__heading">{title}</h2>
        <p className="notification-modal__content__message">{message}</p>
        {children}
        <div className="notification-modal__actions">
          <ButtonCustom regularBtn label={buttonLabel} onClick={onClose} />
        </div>
      </div>
    </div>
  ) : null;
