import { useNavigate } from "react-router-dom";
import Logo from "../assets/HeaderLogo.svg";
import "../styles/components/header/header.scss";
import ButtonCustom from "../Common/ButtonCustom/ButtonCustom";
import { useIsLoggedIn } from "../Context/LoggedInContext";
import { toast } from "react-toastify";
import { env } from "../Constant/envConstants";
import CopyText from "../Common/Copy/copyText";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useGetApi from "../Hooks/useGetApi";
import { apiUrls } from "../Constant/apiUrls";
import { apiMethods } from "../Constant/constants";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authData, setAuthData } = useIsLoggedIn();
  const [activity, setActivity] = useState("");
  console.log("🚀 ~ Header ~ activity:", activity)


  const getStatus = async (address) => {
    console.log("🚀 ~ getStatus ~ address:", address)
    try {
      const { success, data } = await useGetApi(apiUrls.getStatus(address), apiMethods.GET);
      console.log("🚀 ~ getStatus ~ data:", data);
      console.log("🚀 ~ getStatus ~ result:", data?.data?.status);
      if (!success) {
        console.error("No node address in the request");
        return;
      }
      setActivity(data?.data?.status);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "status-badge active";
      case "inactive":
        return "status-badge inactive";
      case "pending":
        return "status-badge pending";
      case "approved":
        return "status-badge approved";
      case "rejected":
        return "status-badge rejected";
      default:
        return "status-badge default";
    }
  };

  const handleClick = async () => {
    if (!window.keplr) {
      toast.error("Install Keplr Wallet extension");
      return;
    }

    const chainId = env.chainId;

    try {
      await window.keplr.disable(chainId);
      await window.keplr.enable(chainId);

      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();

      if (!accounts.length) {
        toast.error("No accounts found in Keplr");
        return;
      }

      // const evmAddress = await showEVMAddress(accounts[0].address);
      // console.log("🚀 ~ connectWallet ~ evmAddress:", evmAddress)
      // const valoperAddress = await convertToValoperAddress(
      //   accounts[0].address
      // );

      setAuthData(accounts[0].address);
      toast.success("Wallet connected successfully!");
      getStatus(accounts[0].address);
    } catch (error) {
      console.error("Keplr login error:", error);
      toast.error("Failed to connect Keplr: " + error.message);
    }
  };


  const handleLogout = () => {
    setAuthData("");
    toast.success("Wallet disconnected");
  };

  return (
    <header className="header">
      <div className="header__container">
        <div
          className="header__logo"
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={Logo} alt="" />
        </div>
        <div className="header__action">
          {(location.pathname !== '/') ?
            (!authData ? (
              <ButtonCustom regularBtn label="Connect Wallet" onClick={handleClick} />
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {authData && activity && <ButtonCustom className={getStatusClass(activity)} regularBtn label={activity} />}
                  <div className="gradientbrder">
                    <div>{authData.slice(0, 6)}...{authData.slice(-4)}</div>
                    <CopyText text={authData} />
                  </div>
                  <ButtonCustom regularBtn label="Logout" onClick={handleLogout} />
                </div>
              </>
            )) : ""}
        </div>
      </div>
    </header>
  );
};

export default Header;
