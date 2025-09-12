import React from "react";
import ButtonCustom from "../../Common/ButtonCustom/ButtonCustom";
import "../../styles/components/landingPage/downloadOptions.scss";
import { AndroidIcon, IOSIcon } from "../../assets/StoreAsset/StoreAsset";
import bgImgDownload from "../../assets/bgImgDownload.png";
const DownloadOptions = () => {
  return (
    <section id="download-section" className="download-section">
      <div
        className="download-section-bg"
        style={{ backgroundImage: `url(${bgImgDownload}) `}}
      ></div>
      <div className="download-options">
        <div className="download-options__card">
          <div className="download-options__content">
            <h2 className="download-options__heading">Download it now.</h2>
            <p className="download-options__message">
              Secure, fast and decentralized VPN powered by blockchain
            </p>
          </div>
          <div className="download-options__actions">
            <ButtonCustom icon={<IOSIcon />} label="App Store" regularBtn />
            <ButtonCustom
              icon={<AndroidIcon />}
              label="Play Store"
              regularBtn
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadOptions;