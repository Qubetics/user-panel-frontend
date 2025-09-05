import React from "react";
import ButtonCustom from "../../Common/ButtonCustom/ButtonCustom";
import "../../styles/components/landingPage/downloadOptions.scss";
import { AndroidIcon, IOSIcon } from "../../assets/StoreAsset/StoreAsset";

const DownloadOptions = () => {
  return (
    <div className="download-options">
      {/* Android Card */}
      <div className="download-options__wrapper">
        <div className="download-options__card">
          <div className="download-options__content">
            <h2 className="download-options__heading">Android</h2>
            <p className="download-options__message">
              Secure, fast, and decentralized VPN powered by blockchain
            </p>
          </div>
          <div className="download-options__actions">
            <AndroidIcon />
          </div>
        </div>
        <ButtonCustom regularBtn label="Download" />
      </div>
      {/* iOS Card */}
      <div className="download-options__wrapper">
        <div className="download-options__card">
          <div className="download-options__content">
            <h2 className="download-options__heading">iOS</h2>
            <p className="download-options__message">
              Secure, fast, and decentralized VPN powered by blockchain
            </p>
          </div>
          <div className="download-options__actions">
            <IOSIcon />
          </div>
        </div>
        <ButtonCustom regularBtn label="Download" />
      </div>
    </div>
  );
};

export default DownloadOptions;
