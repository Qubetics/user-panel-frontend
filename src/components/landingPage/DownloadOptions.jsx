import "../../styles/components/landingPage/downloadOptions.scss";
import { AndroidIcon, IOSIcon } from "../../assets/StoreAsset/StoreAsset";
import { toast } from "react-toastify";
import { env } from "../../Constant/envConstants";
import { message } from "../../Constant/constants";

const DownloadOptions = () => {
  const handleToast = () => {
    toast.success(message.app_store_coming);
    return;
  };

  return (
    <section className="download" id="download-section">
      <div className="download-options">
        {/* <h2 className="smallText download-options__heading">Download it now</h2> */}
        <h2 className="smallText download-options__heading">Coming Soon</h2>
        {/* <h6 className="download-options__message">
          Secure, fast and decentralized VPN powered by Qubetics
        </h6> */}
        <h6 className="download-options__message">
          Downloads will be available soon.
        </h6>
        <div className="download-options__actions">
          <a
            className="download-options__store-btn customButton disabled"
            onClick={() => window.open(env.appStore, "_blank")}
          >
            <span className="download-options__store-btn_icon">
              <IOSIcon />
            </span>
            <span className="text-btn">App Store</span>
          </a>
          <a
            className="download-options__store-btn customButton disabled"
            onClick={() => window.open(env.app_link, "_blank")}
          >
            <span className="download-options__store-btn_icon">
              <AndroidIcon />
            </span>{" "}
            <span className="text-btn">Play Store</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DownloadOptions;
