import "../../styles/components/landingPage/downloadOptions.scss";
import { AndroidIcon, IOSIcon } from "../../assets/StoreAsset/StoreAsset";

const DownloadOptions = () => {
  return (
    <section className="download">
      <div className="download-options">
        <h2 className="download-options__heading">Download it now.</h2>
        <p className="download-options__message">
          Secure, fast and decentralized VPN powered by blockchain
        </p>
        <div className="download-options__actions">
          <a
            href="#"
            className="download-options__store-btn customButton-regular"
          >
            <span className="download-options__store-btn_icon">
              <IOSIcon />
            </span>
            <span>App Store</span>
          </a>
          <a
            href="#"
            className="download-options__store-btn customButton-regular"
          >
            <span className="download-options__store-btn_icon">
              <AndroidIcon />
            </span>{" "}
            <span>Play Store</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DownloadOptions;
