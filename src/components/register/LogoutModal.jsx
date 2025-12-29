import ButtonCustom from "../../Common/ButtonCustom/ButtonCustom";
import "../../styles/components/register/responseTabs.scss";

export const LogoutConfirmModal = ({ show = false, onConfirm, onCancel }) =>
  show ? (
    <div className="logout-modal">
      <div className="logout-modal__content">
        <button
          aria-label="Close modal"
          className="logout-modal__close-btn"
          onClick={onCancel}
          type="button"
        >
          &times;
        </button>

        <h2 className="logout-modal__content__heading">Logout</h2>

        <p className="logout-modal__content__message">
          Are you sure you want to logout?
        </p>

        <div className="logout-modal__actions" style={{ gap: "16px" }}>
          <ButtonCustom
            className="customButton-bordered"
            label="No"
            onClick={onCancel}
          />

          <ButtonCustom regularBtn label="Yes" onClick={onConfirm} />
        </div>
      </div>
    </div>
  ) : null;
